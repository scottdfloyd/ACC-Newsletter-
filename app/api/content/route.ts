import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const month = searchParams.get("month");
  const year = searchParams.get("year");

  const where = month && year
    ? { month, year: parseInt(year) }
    : {};

  const content = await prisma.monthlyContent.findMany({
    where,
    orderBy: { uploadedAt: "desc" },
    take: 10,
  });

  return NextResponse.json(content);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { month, year, talkingPoints, links, imageUrls } = body;

  if (!month || !year || !talkingPoints) {
    return NextResponse.json(
      { error: "month, year, and talkingPoints are required" },
      { status: 400 }
    );
  }

  const content = await prisma.monthlyContent.create({
    data: {
      month,
      year: parseInt(year),
      talkingPoints,
      links: Array.isArray(links) ? links.join("\n") : (links || ""),
      imageUrls: Array.isArray(imageUrls) ? imageUrls.join("\n") : (imageUrls || ""),
    },
  });

  return NextResponse.json(content);
}
