import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function GET() {
  const entries = await prisma.educationEntry.findMany({
    include: { highlights: { orderBy: { sortOrder: "asc" } } },
    orderBy: { sortOrder: "asc" },
  });

  return NextResponse.json(entries);
}

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { locale, title, place, period, sortOrder, highlights } = body;

  if (!locale || !title) {
    return NextResponse.json({ error: "locale and title are required" }, { status: 400 });
  }

  const entry = await prisma.educationEntry.create({
    data: {
      locale,
      title,
      place: place ?? "",
      period: period ?? "",
      sortOrder: sortOrder ?? 0,
      highlights: {
        create: Array.isArray(highlights)
          ? highlights.map((h: { text: string; sortOrder: number }) => ({
              text: h.text ?? "",
              sortOrder: h.sortOrder ?? 0,
            }))
          : [],
      },
    },
    include: { highlights: { orderBy: { sortOrder: "asc" } } },
  });

  return NextResponse.json(entry, { status: 201 });
}
