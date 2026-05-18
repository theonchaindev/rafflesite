import { SignJWT, jwtVerify } from "jose";
import type { NextRequest } from "next/server";
import type { IncomingMessage } from "http";

const SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "fallback-secret-change-in-prod"
);

export interface AdminSession {
  adminId: string;
  email: string;
  role: "admin";
}

export async function signAdminToken(payload: AdminSession): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("24h")
    .sign(SECRET);
}

export async function verifyAdminToken(
  token: string
): Promise<AdminSession | null> {
  try {
    const { payload } = await jwtVerify(token, SECRET);
    return payload as unknown as AdminSession;
  } catch {
    return null;
  }
}

// For use in Next.js API routes (Pages Router)
export async function getAdminSession(
  req: IncomingMessage & { cookies?: Record<string, string> }
): Promise<AdminSession | null> {
  const token = (req as any).cookies?.admin_token;
  if (!token) return null;
  return verifyAdminToken(token);
}

// For use in proxy.ts middleware
export async function getAdminSessionFromNextRequest(
  req: NextRequest
): Promise<AdminSession | null> {
  const token = req.cookies.get("admin_token")?.value;
  if (!token) return null;
  return verifyAdminToken(token);
}

export function setAdminCookie(token: string): string {
  return `admin_token=${token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${60 * 60 * 24}`;
}

export function clearAdminCookie(): string {
  return `admin_token=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0`;
}
