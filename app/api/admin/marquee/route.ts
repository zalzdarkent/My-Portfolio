import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";

export async function GET() {
  const items = await prisma.marqueeItem.findMany({
    orderBy: { sortOrder: "asc" },
  });

  return NextResponse.json(items);
}

export async function PUT(req: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { items } = body;

  await prisma.marqueeItem.deleteMany();

  if ((items as any[])?.length) {
    await prisma.marqueeItem.createMany({
      data: items.map((item: any) => ({
        text: item.text ?? "",
        sortOrder: item.sortOrder ?? 0,
      })),
    });
  }

  const updated = await prisma.marqueeItem.findMany({
    orderBy: { sortOrder: "asc" },
  });

  return NextResponse.json(updated);
}
