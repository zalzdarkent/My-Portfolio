import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/db";
import { signToken } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const { username, password } = await req.json();

    if (!username?.trim() || !password?.trim()) {
      return NextResponse.json({ error: "Username dan password harus diisi." }, { status: 400 });
    }

    const user = await prisma.user.findUnique({ where: { username: username.trim() } });
    if (!user) {
      return NextResponse.json({ error: "Username atau password salah." }, { status: 401 });
    }

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) {
      return NextResponse.json({ error: "Username atau password salah." }, { status: 401 });
    }

    const token = await signToken({ userId: user.id, username: user.username });

    const cookieStore = await cookies();
    cookieStore.set("admin_auth", token, {
      path: "/",
      maxAge: 60 * 60 * 24,
      httpOnly: true,
      sameSite: "lax",
    });

    return NextResponse.json({ ok: true, username: user.username });
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json({ error: "Terjadi kesalahan server." }, { status: 500 });
  }
}
