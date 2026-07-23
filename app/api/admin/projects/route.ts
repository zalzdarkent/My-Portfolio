import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";

export async function GET() {
  const projects = await prisma.project.findMany({
    include: {
      translations: true,
      tags: true,
      techStack: true,
    },
    orderBy: { sortOrder: "asc" },
  });

  return NextResponse.json(projects);
}

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { image, githubUrl, liveUrl, sortOrder, translations, tags, tech } = await req.json();

    const project = await prisma.project.create({
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

    return NextResponse.json(project, { status: 201 });
  } catch (error) {
    console.error("Project create error:", error);
    return NextResponse.json({ error: "Failed to create project" }, { status: 500 });
  }
}
