import type { NextApiRequest, NextApiResponse } from "next";
import { getAdminSession } from "@/lib/auth";
import prisma from "@/lib/prisma";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") return res.status(405).end();

  const session = await getAdminSession(req as any);
  if (!session) return res.status(401).json({ error: "Unauthorized" });

  const orders = await prisma.order.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      tickets: {
        include: { competition: { select: { title: true } } },
      },
    },
  });

  return res.status(200).json(orders);
}
