import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";

export async function GET() {
  const items = await prisma.aboutContent.findMany({
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
    const { items } = await req.json();

    if (!Array.isArray(items)) {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }

    const results = await Promise.all(
      items.map((item: any) =>
        prisma.aboutContent.upsert({
          where: { locale: item.locale },
          create: {
            locale: item.locale,
            title: item.title ?? "",
            description: item.description ?? "",
            btnLabel: item.btnLabel ?? "",
            cvModalTitle: item.cvModalTitle ?? "",
            cvModalDownload: item.cvModalDownload ?? "",
          },
          update: {
            title: item.title ?? "",
            description: item.description ?? "",
            btnLabel: item.btnLabel ?? "",
            cvModalTitle: item.cvModalTitle ?? "",
            cvModalDownload: item.cvModalDownload ?? "",
          },
        })
      )
    );

    return NextResponse.json(results);
  } catch (error) {
    console.error("About update error:", error);
    return NextResponse.json({ error: "Failed to update about content" }, { status: 500 });
  }
}
