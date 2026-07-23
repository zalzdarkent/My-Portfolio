import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";

export async function GET() {
  const items = await prisma.heroContent.findMany({
    orderBy: { locale: "asc" },
  });

  return NextResponse.json(items);
}

export async function PUT(req: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await req.json();

    if (!Array.isArray(id)) {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }

    const results = await Promise.all(
      id.map((item: any) =>
        prisma.heroContent.upsert({
          where: { locale: item.locale },
          create: {
            locale: item.locale,
            greeting: item.greeting ?? "",
            nameLabel: item.nameLabel ?? "",
            description: item.description ?? "",
            btnProject: item.btnProject ?? "",
            btnContact: item.btnContact ?? "",
            status: item.status ?? "",
            stickerExp: item.stickerExp ?? "",
            stickerOpen: item.stickerOpen ?? "",
            availableText: item.availableText ?? "",
          },
          update: {
            greeting: item.greeting ?? "",
            nameLabel: item.nameLabel ?? "",
            description: item.description ?? "",
            btnProject: item.btnProject ?? "",
            btnContact: item.btnContact ?? "",
            status: item.status ?? "",
            stickerExp: item.stickerExp ?? "",
            stickerOpen: item.stickerOpen ?? "",
            availableText: item.availableText ?? "",
          },
        })
      )
    );

    return NextResponse.json(results);
  } catch (error) {
    console.error("Hero update error:", error);
    return NextResponse.json({ error: "Failed to update hero content" }, { status: 500 });
  }
}
