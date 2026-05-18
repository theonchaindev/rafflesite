import type { NextApiRequest, NextApiResponse } from "next";
import { signAdminToken, setAdminCookie } from "@/lib/auth";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).end();

  const { email, password } = req.body;
  const adminEmail = process.env.ADMIN_EMAIL || "admin@rafflesite.co.uk";
  const adminPassword = process.env.ADMIN_PASSWORD || "admin123";

  if (email !== adminEmail || password !== adminPassword) {
    return res.status(401).json({ error: "Invalid credentials" });
  }

  const token = await signAdminToken({ adminId: "admin", email, role: "admin" });
  res.setHeader("Set-Cookie", setAdminCookie(token));
  return res.status(200).json({ ok: true });
}
