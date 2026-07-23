import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const experience = await prisma.experience.findUnique({
    where: { id: Number(id) },
    include: { items: { orderBy: { sortOrder: "asc" } } },
  });

  if (!experience) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json(experience);
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
  const { locale, role, place, period, sortOrder, logoPath, items } = body;

  const experience = await prisma.$transaction(async (tx) => {
    await tx.experienceItem.deleteMany({ where: { experienceId: Number(id) } });

    return tx.experience.update({
      where: { id: Number(id) },
      data: {
        locale,
        role,
        place: place ?? "",
        period: period ?? "",
        sortOrder: sortOrder ?? 0,
        logoPath: logoPath ?? "",
        items: {
          create: Array.isArray(items)
            ? items.map((item: { text: string; sortOrder: number }) => ({
                text: item.text ?? "",
                sortOrder: item.sortOrder ?? 0,
              }))
            : [],
        },
      },
      include: { items: { orderBy: { sortOrder: "asc" } } },
    });
  });

  return NextResponse.json(experience);
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

  await prisma.experience.delete({ where: { id: Number(id) } });

  return NextResponse.json({ ok: true });
}
