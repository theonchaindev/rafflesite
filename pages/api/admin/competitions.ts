import type { NextApiRequest, NextApiResponse } from "next";
import { getAdminSession } from "@/lib/auth";
import prisma from "@/lib/prisma";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getAdminSession(req as any);
  if (!session) return res.status(401).json({ error: "Unauthorized" });

  if (req.method === "GET") {
    const competitions = await prisma.competition.findMany({
      orderBy: { createdAt: "desc" },
      include: { _count: { select: { tickets: true } } },
    });
    return res.status(200).json(competitions);
  }

  if (req.method === "POST") {
    const { title, slug, description, prizeValue, ticketPrice, maxTickets, drawDate, status, imageUrl, maxPerOrder } = req.body;

    if (!title || !slug || !description || !ticketPrice || !maxTickets || !drawDate) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const existing = await prisma.competition.findUnique({ where: { slug } });
    if (existing) return res.status(400).json({ error: "Slug already exists" });

    const competition = await prisma.competition.create({
      data: {
        title,
        slug,
        description,
        prizeValue: parseFloat(prizeValue),
        ticketPrice: parseFloat(ticketPrice),
        maxTickets: parseInt(maxTickets),
        drawDate: new Date(drawDate),
        status: status || "active",
        imageUrl: imageUrl || null,
        maxPerOrder: parseInt(maxPerOrder) || 100,
      },
    });

    return res.status(201).json(competition);
  }

  return res.status(405).end();
}
