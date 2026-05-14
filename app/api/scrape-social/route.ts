import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';

const APIFY_API_KEY = process.env.APIFY_API_KEY;
const IG_ACTOR = 'apify~instagram-post-scraper';
const LI_ACTOR = 'data-slayer~linkedin-company-posts-scraper';

export async function POST() {
  if (!APIFY_API_KEY) {
    return NextResponse.json({ error: 'Apify API key not configured' }, { status: 400 });
  }
  try {
    const businessUnits = await prisma.businessUnit.findMany();
    const igHandles = businessUnits
      .map(u => u.instagramHandle)
      .filter((h): h is string => !!h && h.trim() !== '')
      .map(h => h.replace('@', '').toLowerCase());

    const liSlugs = businessUnits
      .map(u => u.linkedinHandle)
      .filter((s): s is string => !!s && s.trim() !== '');

    let igRunId = null;
    if (igHandles.length > 0) {
      const igRes = await fetch(`https://api.apify.com/v2/acts/${IG_ACTOR}/runs?token=${APIFY_API_KEY}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          directUrls: igHandles.map(h => `https://www.instagram.com/${h}/`),
          resultsLimit: 10,
          onlyPostsNewerThan: '2026-01-01',
        }),
      });
      const igData = await igRes.json();
      igRunId = igData.data?.id || null;
    }

    let liRunId = null;
    if (liSlugs.length > 0) {
      const liRes = await fetch(`https://api.apify.com/v2/acts/${LI_ACTOR}/runs?token=${APIFY_API_KEY}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          companyUrls: liSlugs.map(s => `https://www.linkedin.com/company/${s}/`),
          maxPosts: 10,
          startDate: '2026-01-01',
        }),
      });
      const liData = await liRes.json();
      liRunId = liData.data?.id || null;
    }

    return NextResponse.json({
      success: true,
      message: 'Scrape started! Click Fetch Results in about 2 minutes.',
      igRunId,
      liRunId,
    });
  } catch (error) {
    console.error('Scrape trigger error:', error);
    return NextResponse.json({ error: 'Failed to trigger scrape' }, { status: 500 });
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const igRunId = searchParams.get('igRunId');
  const liRunId = searchParams.get('liRunId');

  if (!igRunId && !liRunId) {
    try {
      const posts = await prisma.socialPost.findMany({
        include: { businessUnit: true },
        orderBy: { postedAt: 'desc' },
        take: 200,
      });
      return NextResponse.json(posts);
    } catch (error) {
      console.error(error);
      return NextResponse.json({ error: 'Failed to fetch posts' }, { status: 500 });
    }
  }

  if (!APIFY_API_KEY) {
    return NextResponse.json({ error: 'Apify API key not configured' }, { status: 400 });
  }

  try {
    const businessUnits = await prisma.businessUnit.findMany();
    let savedCount = 0;
    let skippedCount = 0;
    let igStatus = 'skipped';
    let liStatus = 'skipped';
    const debugLog: string[] = [];

    if (igRunId) {
      const statusRes = await fetch(`https://api.apify.com/v2/acts/${IG_ACTOR}/runs/${igRunId}?token=${APIFY_API_KEY}`);
      const statusData = await statusRes.json();
      igStatus = statusData.data?.status || 'UNKNOWN';

      if (igStatus === 'SUCCEEDED') {
        const dataRes = await fetch(`https://api.apify.com/v2/acts/${IG_ACTOR}/runs/${igRunId}/dataset/items?token=${APIFY_API_KEY}`);
        const items = await dataRes.json();
        const posts = Array.isArray(items) ? items : [];
        debugLog.push(`Instagram: ${posts.length} posts returned`);

        for (const post of posts) {
          const postUrl = post.url || (post.shortCode ? `https://www.instagram.com/p/${post.shortCode}/` : null);
          if (!postUrl) { skippedCount++; continue; }

          const ownerUsername = (post.ownerUsername || '').toLowerCase().replace('@', '');
          debugLog.push(`Trying to match: "${ownerUsername}"`);

          const unit = businessUnits.find(u => {
            const handle = (u.instagramHandle || '').toLowerCase().replace('@', '').trim();
            return handle === ownerUsername;
          });

          if (!unit) {
            debugLog.push(`No match for: "${ownerUsername}" — available: ${businessUnits.map(u => u.instagramHandle).join(', ')}`);
            skippedCount++;
            continue;
          }

          const existing = await prisma.socialPost.findFirst({ where: { postUrl } });
          if (existing) { skippedCount++; continue; }

          await prisma.socialPost.create({
            data: {
              businessUnitId: unit.id,
              platform: 'instagram',
              postUrl,
              content: (post.caption || '').slice(0, 2000),
              imageUrl: post.displayUrl || post.thumbnailUrl || null,
              postedAt: post.timestamp ? new Date(post.timestamp) : new Date(),
            },
          });
          savedCount++;
          debugLog.push(`Saved post for ${unit.name}`);
        }
      }
    }

    if (liRunId) {
      const statusRes = await fetch(`https://api.apify.com/v2/acts/${LI_ACTOR}/runs/${liRunId}?token=${APIFY_API_KEY}`);
      const statusData = await statusRes.json();
      liStatus = statusData.data?.status || 'UNKNOWN';

      if (liStatus === 'SUCCEEDED') {
        const dataRes = await fetch(`https://api.apify.com/v2/acts/${LI_ACTOR}/runs/${liRunId}/dataset/items?token=${APIFY_API_KEY}`);
        const items = await dataRes.json();

        for (const post of (Array.isArray(items) ? items : [])) {
          if (!post.url) continue;
          const rawSlug = (post.companyUrl || '').split('/company/')[1]?.replace('/', '') || '';
          const slug = rawSlug.toLowerCase();
          const unit = businessUnits.find(u =>
            (u.linkedinHandle || '').toLowerCase().replace('@', '').trim() === slug
          );
          if (!unit) { skippedCount++; continue; }

          const existing = await prisma.socialPost.findFirst({ where: { postUrl: post.url } });
          if (existing) { skippedCount++; continue; }

          await prisma.socialPost.create({
            data: {
              businessUnitId: unit.id,
              platform: 'linkedin',
              postUrl: post.url,
              content: (post.text || '').slice(0, 2000),
              imageUrl: post.image || null,
              postedAt: post.date ? new Date(post.date) : new Date(),
            },
          });
          savedCount++;
        }
      }
    }

    return NextResponse.json({
      success: true,
      igStatus,
      liStatus,
      saved: savedCount,
      skipped: skippedCount,
      debug: debugLog,
      message: savedCount > 0
        ? `Saved ${savedCount} new posts!`
        : igStatus === 'RUNNING' || liStatus === 'RUNNING'
        ? 'Still running — try again in 30 seconds.'
        : `No new posts saved. Skipped: ${skippedCount}. Check debug for details.`,
    });
  } catch (error) {
    console.error('Fetch results error:', error);
    return NextResponse.json({ error: 'Failed to fetch results' }, { status: 500 });
  }
}
