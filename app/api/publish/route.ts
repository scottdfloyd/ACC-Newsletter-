import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";

export async function POST(req: NextRequest) {
  const { newsletterId } = await req.json();

  const newsletter = await prisma.newsletter.findUnique({
    where: { id: newsletterId },
  });

  if (!newsletter) {
    return NextResponse.json({ error: "Newsletter not found" }, { status: 404 });
  }

  const slug = `${newsletter.month.toLowerCase()}-${newsletter.year}`;
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
  const pageUrl = `${baseUrl}/newsletter/${slug}`;

  await prisma.newsletter.update({
    where: { id: newsletterId },
    data: {
      status: "published",
      publishedAt: new Date(),
      framerPageUrl: pageUrl,
    },
  });

  return NextResponse.json({ success: true, pageUrl });
}
