import type { NextApiRequest, NextApiResponse } from "next";
import { getAdminSession } from "@/lib/auth";
import prisma from "@/lib/prisma";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getAdminSession(req as any);
  if (!session) return res.status(401).json({ error: "Unauthorized" });

  const id = req.query.id as string;

  if (req.method === "PUT") {
    const { title, slug, description, prizeValue, ticketPrice, maxTickets, drawDate, status, imageUrl, maxPerOrder } = req.body;

    const competition = await prisma.competition.update({
      where: { id },
      data: {
        title,
        slug,
        description,
        prizeValue: parseFloat(prizeValue),
        ticketPrice: parseFloat(ticketPrice),
        maxTickets: parseInt(maxTickets),
        drawDate: new Date(drawDate),
        status,
        imageUrl: imageUrl || null,
        maxPerOrder: parseInt(maxPerOrder) || 100,
      },
    });

    return res.status(200).json(competition);
  }

  if (req.method === "DELETE") {
    await prisma.competition.delete({ where: { id } });
    return res.status(200).json({ ok: true });
  }

  return res.status(405).end();
}
