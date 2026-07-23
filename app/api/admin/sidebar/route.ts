import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";

export async function GET() {
  const [workHabits, snapshotItems, competencies, achievements] =
    await Promise.all([
      prisma.workHabit.findMany({ orderBy: { sortOrder: "asc" } }),
      prisma.snapshotItem.findMany({ orderBy: { sortOrder: "asc" } }),
      prisma.competency.findMany({ orderBy: { sortOrder: "asc" } }),
      prisma.achievement.findMany({ orderBy: { sortOrder: "asc" } }),
    ]);

  return NextResponse.json({ workHabits, snapshotItems, competencies, achievements });
}

export async function PUT(req: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { workHabits, snapshotItems, competencies, achievements } = body;

  await prisma.$transaction([
    prisma.workHabit.deleteMany(),
    prisma.snapshotItem.deleteMany(),
    prisma.competency.deleteMany(),
    prisma.achievement.deleteMany(),
  ]);

  if ((workHabits as any[])?.length) {
    await prisma.workHabit.createMany({
      data: workHabits.map((w: any) => ({
        locale: w.locale,
        k: w.k ?? "",
        v: w.v ?? "",
        sortOrder: w.sortOrder ?? 0,
      })),
    });
  }

  if ((snapshotItems as any[])?.length) {
    await prisma.snapshotItem.createMany({
      data: snapshotItems.map((s: any) => ({
        locale: s.locale,
        num: s.num ?? "",
        label: s.label ?? "",
        sortOrder: s.sortOrder ?? 0,
      })),
    });
  }

  if ((competencies as any[])?.length) {
    await prisma.competency.createMany({
      data: competencies.map((c: any) => ({
        locale: c.locale,
        k: c.k ?? "",
        v: c.v ?? "",
        sortOrder: c.sortOrder ?? 0,
      })),
    });
  }

  if ((achievements as any[])?.length) {
    await prisma.achievement.createMany({
      data: achievements.map((a: any) => ({
        locale: a.locale,
        text: a.text ?? "",
        sortOrder: a.sortOrder ?? 0,
      })),
    });
  }

  const [updatedWorkHabits, updatedSnapshotItems, updatedCompetencies, updatedAchievements] =
    await Promise.all([
      prisma.workHabit.findMany({ orderBy: { sortOrder: "asc" } }),
      prisma.snapshotItem.findMany({ orderBy: { sortOrder: "asc" } }),
      prisma.competency.findMany({ orderBy: { sortOrder: "asc" } }),
      prisma.achievement.findMany({ orderBy: { sortOrder: "asc" } }),
    ]);

  return NextResponse.json({
    workHabits: updatedWorkHabits,
    snapshotItems: updatedSnapshotItems,
    competencies: updatedCompetencies,
    achievements: updatedAchievements,
  });
}
