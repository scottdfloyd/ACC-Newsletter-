import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const newsletter = await prisma.newsletter.findUnique({ where: { id } });
  if (!newsletter) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({
    ...newsletter,
    subThemes: newsletter.subThemes.split("|"),
  });
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await req.json();

  const updated = await prisma.newsletter.update({
    where: { id },
    data: {
      ...(body.theme && { theme: body.theme }),
      ...(body.body && { body: body.body }),
      ...(body.subThemes && { subThemes: Array.isArray(body.subThemes) ? body.subThemes.join("|") : body.subThemes }),
      ...(body.status && { status: body.status }),
    },
  });

  return NextResponse.json(updated);
}
