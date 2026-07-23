import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function GET() {
  const skills = await prisma.techSkill.findMany({
    orderBy: { sortOrder: "asc" },
  });

  return NextResponse.json(skills);
}

export async function PUT(req: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { items } = await req.json();

  if (!Array.isArray(items)) {
    return NextResponse.json({ error: "items must be an array" }, { status: 400 });
  }

  await prisma.$transaction(async (tx) => {
    await tx.techSkill.deleteMany();

    if (items.length > 0) {
      await tx.techSkill.createMany({
        data: items.map((item: { id?: number; name: string; level: string; color: string; iconName: string; sortOrder: number }) => ({
          name: item.name,
          level: item.level,
          color: item.color ?? "",
          iconName: item.iconName ?? "",
          sortOrder: item.sortOrder ?? 0,
        })),
      });
    }
  });

  const skills = await prisma.techSkill.findMany({
    orderBy: { sortOrder: "asc" },
  });

  return NextResponse.json(skills);
}
