import type { NextApiRequest, NextApiResponse } from "next";
import { clearAdminCookie } from "@/lib/auth";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  res.setHeader("Set-Cookie", clearAdminCookie());
  return res.status(200).json({ ok: true });
}
