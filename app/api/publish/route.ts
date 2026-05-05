import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { publishToFramer } from "@/lib/framer/publish";

export async function POST(req: NextRequest) {
  const { newsletterId } = await req.json();

  const newsletter = await prisma.newsletter.findUnique({
    where: { id: newsletterId },
  });

  if (!newsletter) {
    return NextResponse.json({ error: "Newsletter not found" }, { status: 404 });
  }

  const result = await publishToFramer({
    title: `${newsletter.month} ${newsletter.year} — ${newsletter.theme}`,
    theme: newsletter.theme,
    subThemes: newsletter.subThemes,
    body: newsletter.body,
    month: newsletter.month,
    year: newsletter.year,
    publishedAt: new Date().toISOString(),
  });

  if (!result.success) {
    return NextResponse.json({ error: result.error }, { status: 500 });
  }

  await prisma.newsletter.update({
    where: { id: newsletterId },
    data: {
      status: "published",
      publishedAt: new Date(),
      framerPageUrl: result.pageUrl,
    },
  });

  return NextResponse.json({ success: true, pageUrl: result.pageUrl });
}
