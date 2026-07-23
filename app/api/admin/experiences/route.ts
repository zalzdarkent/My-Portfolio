import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function GET() {
  const experiences = await prisma.experience.findMany({
    include: { items: { orderBy: { sortOrder: "asc" } } },
    orderBy: { sortOrder: "asc" },
  });

  return NextResponse.json(experiences);
}

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { locale, role, place, period, sortOrder, logoPath, items } = body;

  if (!locale || !role) {
    return NextResponse.json({ error: "locale and role are required" }, { status: 400 });
  }

  const experience = await prisma.experience.create({
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

  return NextResponse.json(experience, { status: 201 });
}
