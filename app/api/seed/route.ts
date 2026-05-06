import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";

const BUSINESS_UNITS = [
  { name: "ACC (Parent)", slug: "acc-parent", instagramHandle: "accelerationcc", linkedinHandle: "theacceleration", website: "accelerationcc.com" },
  { name: "DKC", slug: "dkc", instagramHandle: "dkcnews", linkedinHandle: "dkc", website: "dkcnews.com" },
  { name: "HangarFour", slug: "hangarfour", instagramHandle: "hangarfour", linkedinHandle: "hangarfour", website: "hangarfour.co" },
  { name: "MKG", slug: "mkg", instagramHandle: "thisismkg", linkedinHandle: "thisismkg", website: "thisismkg.com" },
  { name: "Pink Sparrow", slug: "pink-sparrow", instagramHandle: "pinksparrow_", linkedinHandle: "pink-sparrow-scenic", website: "pinksparrow.com" },
  { name: "Pixly", slug: "pixly", instagramHandle: "pixly.tv", linkedinHandle: "pixly.tv", website: "pixly.tv" },
  { name: "Trailblaze", slug: "trailblaze", instagramHandle: "trailblaze.co", linkedinHandle: "trailblazeco", website: "trailblaze.co" },
  { name: "Ingenuity", slug: "ingenuity", linkedinHandle: "ingenuitygroupllc" },
  { name: "PMK Entertainment", slug: "pmk-entertainment" },
];

export async function POST() {
  try {
    for (const unit of BUSINESS_UNITS) {
      await prisma.businessUnit.upsert({
        where: { slug: unit.slug },
        update: { ...unit },
        create: unit,
      });
    }
    return NextResponse.json({ success: true, seeded: BUSINESS_UNITS.length });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
