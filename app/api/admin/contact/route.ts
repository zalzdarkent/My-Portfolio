import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";

export async function GET() {
  const [content, links] = await Promise.all([
    prisma.contactContent.findMany({ orderBy: { locale: "asc" } }),
    prisma.contactLink.findMany({ orderBy: { sortOrder: "asc" } }),
  ]);

  return NextResponse.json({ content, links });
}

export async function PUT(req: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { content, links } = body;

  const upserts = (content as any[]).map((c) =>
    prisma.contactContent.upsert({
      where: { locale: c.locale },
      create: {
        locale: c.locale,
        title: c.title ?? "",
        description1: c.description1 ?? "",
        description2: c.description2 ?? "",
        formName: c.formName ?? "",
        formEmail: c.formEmail ?? "",
        formMessage: c.formMessage ?? "",
        formPlaceholder: c.formPlaceholder ?? "",
        formSubmit: c.formSubmit ?? "",
        formSubmitting: c.formSubmitting ?? "",
        toast: c.toast ?? "",
      },
      update: {
        title: c.title ?? "",
        description1: c.description1 ?? "",
        description2: c.description2 ?? "",
        formName: c.formName ?? "",
        formEmail: c.formEmail ?? "",
        formMessage: c.formMessage ?? "",
        formPlaceholder: c.formPlaceholder ?? "",
        formSubmit: c.formSubmit ?? "",
        formSubmitting: c.formSubmitting ?? "",
        toast: c.toast ?? "",
      },
    })
  );

  await Promise.all(upserts);

  await prisma.contactLink.deleteMany();

  if ((links as any[])?.length) {
    await prisma.contactLink.createMany({
      data: (links as any[]).map((l) => ({
        iconName: l.iconName ?? "",
        label: l.label ?? "",
        href: l.href ?? "",
        sortOrder: l.sortOrder ?? 0,
      })),
    });
  }

  const updatedContent = await prisma.contactContent.findMany({
    orderBy: { locale: "asc" },
  });
  const updatedLinks = await prisma.contactLink.findMany({
    orderBy: { sortOrder: "asc" },
  });

  return NextResponse.json({ content: updatedContent, links: updatedLinks });
}
