import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { generateNewsletter } from "@/lib/ai/claude";
import { getAllPosts } from "@/lib/social/mock-feeds";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { monthlyContentId, selectedTheme } = body;

  let monthlyContent;
  if (monthlyContentId) {
    monthlyContent = await prisma.monthlyContent.findUnique({
      where: { id: monthlyContentId },
    });
  }

  const socialPosts = getAllPosts();

  const now = new Date();
  const month = monthlyContent?.month || now.toLocaleString("default", { month: "long" });
  const year = monthlyContent?.year || now.getFullYear();

  const talkingPoints = monthlyContent?.talkingPoints || "No talking points provided.";
  const links = monthlyContent?.links ? monthlyContent.links.split("\n").filter(Boolean) : [];

  const result = await generateNewsletter({
    month,
    year,
    talkingPoints,
    links,
    socialPosts,
    selectedTheme,
  });

  const newsletter = await prisma.newsletter.create({
    data: {
      monthlyContentId: monthlyContentId || null,
      month,
      year,
      theme: result.theme,
      subThemes: result.subThemes.join("|"),
      body: result.body,
      status: "draft",
    },
  });

  return NextResponse.json({
    ...newsletter,
    subThemes: result.subThemes,
    suggestedThemes: result.suggestedThemes,
  });
}

export async function GET() {
  const newsletters = await prisma.newsletter.findMany({
    orderBy: { createdAt: "desc" },
    take: 20,
  });
  return NextResponse.json(newsletters);
}
