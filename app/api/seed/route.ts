import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";

const BUSINESS_UNITS = [
  { name: "HangarFour", slug: "hangarfour", instagramHandle: "hangarfour", linkedinHandle: "hangarfour" },
  { name: "Pink Sparrow", slug: "pink-sparrow", instagramHandle: "pinksparrownyc", linkedinHandle: "pink-sparrow" },
  { name: "Advisory", slug: "advisory", linkedinHandle: "acc-advisory" },
  { name: "Speakeasy", slug: "speakeasy", instagramHandle: "speakeasypr", linkedinHandle: "speakeasy-pr" },
  { name: "Cavalry", slug: "cavalry", instagramHandle: "cavalrymedia", linkedinHandle: "cavalry-media" },
  { name: "AMP Agency", slug: "amp-agency", instagramHandle: "ampagency", linkedinHandle: "amp-agency" },
  { name: "Goodway Group", slug: "goodway-group", linkedinHandle: "goodway-group" },
  { name: "True Media", slug: "true-media", linkedinHandle: "true-media" },
  { name: "Crossmedia", slug: "crossmedia", linkedinHandle: "crossmedia" },
  { name: "Levelwing", slug: "levelwing", instagramHandle: "levelwing", linkedinHandle: "levelwing" },
];

export async function POST() {
  try {
    for (const unit of BUSINESS_UNITS) {
      await prisma.businessUnit.upsert({
        where: { slug: unit.slug },
        update: {},
        create: unit,
      });
    }
    return NextResponse.json({ success: true, seeded: BUSINESS_UNITS.length });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
