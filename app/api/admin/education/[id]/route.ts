import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const entry = await prisma.educationEntry.findUnique({
    where: { id: Number(id) },
    include: { highlights: { orderBy: { sortOrder: "asc" } } },
  });

  if (!entry) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json(entry);
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const body = await req.json();
  const { locale, title, place, period, sortOrder, highlights } = body;

  const entry = await prisma.educationEntry.update({
    where: { id: Number(id) },
    data: { locale, title, place, period, sortOrder },
  });

  await prisma.educationHighlight.deleteMany({
    where: { educationId: entry.id },
  });

  if (highlights?.length) {
    await prisma.educationHighlight.createMany({
      data: highlights.map((h: { text: string; sortOrder: number }) => ({
        educationId: entry.id,
        text: h.text,
        sortOrder: h.sortOrder,
      })),
    });
  }

  const updated = await prisma.educationEntry.findUnique({
    where: { id: entry.id },
    include: { highlights: { orderBy: { sortOrder: "asc" } } },
  });

  return NextResponse.json(updated);
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  await prisma.educationEntry.delete({
    where: { id: Number(id) },
  });

  return NextResponse.json({ ok: true });
}
