import { NextRequest, NextResponse } from "next/server";
import { getAllPosts, getPostsByMonth } from "@/lib/social/mock-feeds";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const month = searchParams.get("month");
  const year = searchParams.get("year");

  const posts =
    month && year
      ? getPostsByMonth(parseInt(month), parseInt(year))
      : getAllPosts();

  return NextResponse.json(posts);
}
