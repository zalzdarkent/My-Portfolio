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
    const body = await req.json();
    const { image, images, githubUrl, liveUrl, sortOrder, translations, tags, techStack, tech } = body;

    const rawTags = tags ?? [];
    const parsedTags = rawTags
      .map((t: any) => (typeof t === "string" ? t : t?.tag))
      .filter((t: any) => typeof t === "string" && t.trim() !== "");

    const rawTech = techStack ?? tech ?? [];
    const parsedTech = rawTech
      .map((t: any) => (typeof t === "string" ? t : t?.techName))
      .filter((t: any) => typeof t === "string" && t.trim() !== "");

    const project = await prisma.project.create({
      data: {
        image: image ?? "",
        images: images ?? "[]",
        githubUrl: githubUrl ?? "",
        liveUrl: liveUrl ?? "",
        sortOrder: Number(sortOrder) || 0,
        translations: {
          create: (translations ?? []).map((t: any) => ({
            locale: t.locale,
            name: t.name ?? "",
            shortDesc: t.shortDesc ?? "",
            longDesc: t.longDesc ?? "",
            features: typeof t.features === "string" ? t.features : JSON.stringify(t.features ?? []),
          })),
        },
        tags: {
          create: parsedTags.map((tag: string) => ({ tag })),
        },
        techStack: {
          create: parsedTech.map((t: string) => ({ techName: t })),
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

