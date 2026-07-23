import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

const SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "portfolio-brutalist-secret-key-change-in-production-2026"
);

const COOKIE_NAME = "admin_auth";
const EXPIRY = "24h";

export interface JwtPayload {
  userId: number;
  username: string;
}

export async function signToken(payload: JwtPayload): Promise<string> {
  return new SignJWT(payload as any)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(EXPIRY)
    .sign(SECRET);
}

export async function verifyToken(token: string): Promise<JwtPayload | null> {
  try {
    const { payload } = await jwtVerify(token, SECRET);
    return payload as unknown as JwtPayload;
  } catch {
    return null;
  }
}

export async function getSession(): Promise<JwtPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return null;
  return verifyToken(token);
}

export function setSessionCookie(token: string): string {
  const maxAge = 60 * 60 * 24; // 24 hours
  return `${COOKIE_NAME}=${token}; Path=/admin; Max-Age=${maxAge}; HttpOnly; SameSite=Lax`;
}

export function clearSessionCookie(): string {
  return `${COOKIE_NAME}=; Path=/admin; Max-Age=0; HttpOnly; SameSite=Lax`;
}
