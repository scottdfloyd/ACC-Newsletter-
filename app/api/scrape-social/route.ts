import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

const APIFY_API_KEY = process.env.APIFY_API_KEY;

async function scrapeInstagram(handles: string[]) {
  if (!APIFY_API_KEY) return [];
  
  const validHandles = handles.filter(h => h && h.trim() !== '');
  if (validHandles.length === 0) return [];

  try {
    const response = await fetch(
      `https://api.apify.com/v2/acts/apify~instagram-post-scraper/runs?token=${APIFY_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          directUrls: validHandles.map(h => `https://www.instagram.com/${h.replace('@', '')}/`),
          resultsLimit: 10,
          onlyPostsNewerThan: '2026-01-01',
        }),
      }
    );
    
    if (!response.ok) return [];
    const run = await response.json();
    const runId = run.data?.id;
    if (!runId) return [];

    // Poll for completion (max 60 seconds)
    for (let i = 0; i < 12; i++) {
      await new Promise(r => setTimeout(r, 5000));
      const statusRes = await fetch(
        `https://api.apify.com/v2/acts/apify~instagram-post-scraper/runs/${runId}?token=${APIFY_API_KEY}`
      );
      const status = await statusRes.json();
      if (status.data?.status === 'SUCCEEDED') break;
      if (status.data?.status === 'FAILED') return [];
    }

    const dataRes = await fetch(
      `https://api.apify.com/v2/acts/apify~instagram-post-scraper/runs/${runId}/dataset/items?token=${APIFY_API_KEY}`
    );
    const items = await dataRes.json();
    return Array.isArray(items) ? items : [];
  } catch {
    return [];
  }
}

async function scrapeLinkedIn(slugs: string[]) {
  if (!APIFY_API_KEY) return [];
  
  const validSlugs = slugs.filter(s => s && s.trim() !== '');
  if (validSlugs.length === 0) return [];

  try {
    const response = await fetch(
      `https://api.apify.com/v2/acts/data-slayer~linkedin-company-posts-scraper/runs?token=${APIFY_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          companyUrls: validSlugs.map(s => `https://www.linkedin.com/company/${s}/`),
          maxPosts: 10,
          startDate: '2026-01-01',
        }),
      }
    );

    if (!response.ok) return [];
    const run = await response.json();
    const runId = run.data?.id;
    if (!runId) return [];

    for (let i = 0; i < 12; i++) {
      await new Promise(r => setTimeout(r, 5000));
      const statusRes = await fetch(
        `https://api.apify.com/v2/acts/data-slayer~linkedin-company-posts-scraper/runs/${runId}?token=${APIFY_API_KEY}`
      );
      const status = await statusRes.json();
      if (status.data?.status === 'SUCCEEDED') break;
      if (status.data?.status === 'FAILED') return [];
    }

    const dataRes = await fetch(
      `https://api.apify.com/v2/acts/data-slayer~linkedin-company-posts-scraper/runs/${runId}/dataset/items?token=${APIFY_API_KEY}`
    );
    const items = await dataRes.json();
    return Array.isArray(items) ? items : [];
  } catch {
    return [];
  }
}

export async function POST(request: Request) {
  if (!APIFY_API_KEY) {
    return NextResponse.json({ error: 'Apify API key not configured' }, { status: 400 });
  }

  try {
    const businessUnits = await prisma.businessUnit.findMany();
    
    const instagramHandles = businessUnits
      .map(u => u.instagramHandle)
      .filter((h): h is string => !!h);
    
    const linkedInSlugs = businessUnits
      .map(u => u.linkedinHandle)
      .filter((s): s is string => !!s);

    const [igPosts, liPosts] = await Promise.all([
      scrapeInstagram(instagramHandles),
      scrapeLinkedIn(linkedInSlugs),
    ]);

    // Save Instagram posts
    let savedCount = 0;
    for (const post of igPosts) {
      if (!post.url) continue;
      const unit = businessUnits.find(u => 
        post.ownerUsername && u.instagramHandle?.replace('@','') === post.ownerUsername
      );
      if (!unit) continue;
      
      await prisma.socialPost.upsert({
        where: { url: post.url },
        update: {},
        create: {
          businessUnitId: unit.id,
          platform: 'instagram',
          url: post.url,
          caption: post.caption?.slice(0, 2000) || '',
          imageUrl: post.displayUrl || null,
          publishedAt: post.timestamp ? new Date(post.timestamp) : new Date(),
          likes: post.likesCount || 0,
          comments: post.commentsCount || 0,
        },
      });
      savedCount++;
    }

    // Save LinkedIn posts
    for (const post of liPosts) {
      if (!post.url) continue;
      const slug = post.companyUrl?.split('/company/')?.[1]?.replace('/', '');
      const unit = businessUnits.find(u => u.linkedinHandle === slug);
      if (!unit) continue;

      await prisma.socialPost.upsert({
        where: { url: post.url },
        update: {},
        create: {
          businessUnitId: unit.id,
          platform: 'linkedin',
          url: post.url,
          caption: post.text?.slice(0, 2000) || '',
          imageUrl: post.image || null,
          publishedAt: post.date ? new Date(post.date) : new Date(),
          likes: post.likes || 0,
          comments: post.comments || 0,
        },
      });
      savedCount++;
    }

    return NextResponse.json({ 
      success: true, 
      instagramPosts: igPosts.length,
      linkedInPosts: liPosts.length,
      saved: savedCount 
    });
  } catch (error) {
    console.error('Scrape error:', error);
    return NextResponse.json({ error: 'Scraping failed' }, { status: 500 });
  }
}

export async function GET() {
  try {
    const posts = await prisma.socialPost.findMany({
      include: { businessUnit: true },
      orderBy: { publishedAt: 'desc' },
      take: 100,
    });
    return NextResponse.json(posts);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch posts' }, { status: 500 });
  }
}
