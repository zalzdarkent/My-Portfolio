import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const project = await prisma.project.findUnique({
    where: { id: Number(id) },
    include: {
      translations: true,
      tags: true,
      techStack: true,
    },
  });

  if (!project) {
    return NextResponse.json({ error: "Project not found" }, { status: 404 });
  }

  return NextResponse.json(project);
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;
    const projectId = Number(id);
    const { image, githubUrl, liveUrl, sortOrder, translations, tags, tech } = await req.json();

    const existing = await prisma.project.findUnique({ where: { id: projectId } });
    if (!existing) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    await prisma.$transaction([
      prisma.projectTranslation.deleteMany({ where: { projectId } }),
      prisma.projectTag.deleteMany({ where: { projectId } }),
      prisma.projectTech.deleteMany({ where: { projectId } }),
    ]);

    const project = await prisma.project.update({
      where: { id: projectId },
      data: {
        image: image ?? "",
        githubUrl: githubUrl ?? "",
        liveUrl: liveUrl ?? "",
        sortOrder: sortOrder ?? 0,
        translations: {
          create: (translations ?? []).map((t: any) => ({
            locale: t.locale,
            name: t.name ?? "",
            shortDesc: t.shortDesc ?? "",
            longDesc: t.longDesc ?? "",
            features: t.features ?? "[]",
          })),
        },
        tags: {
          create: (tags ?? []).map((tag: string) => ({ tag })),
        },
        techStack: {
          create: (tech ?? []).map((t: string) => ({ techName: t })),
        },
      },
      include: {
        translations: true,
        tags: true,
        techStack: true,
      },
    });

    return NextResponse.json(project);
  } catch (error) {
    console.error("Project update error:", error);
    return NextResponse.json({ error: "Failed to update project" }, { status: 500 });
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;
    const projectId = Number(id);

    const existing = await prisma.project.findUnique({ where: { id: projectId } });
    if (!existing) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    await prisma.project.delete({ where: { id: projectId } });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Project delete error:", error);
    return NextResponse.json({ error: "Failed to delete project" }, { status: 500 });
  }
}
