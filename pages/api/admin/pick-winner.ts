import type { NextApiRequest, NextApiResponse } from "next";
import { getAdminSession } from "@/lib/auth";
import prisma from "@/lib/prisma";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).end();

  const session = await getAdminSession(req as any);
  if (!session) return res.status(401).json({ error: "Unauthorized" });

  const { competitionId } = req.body;
  if (!competitionId) return res.status(400).json({ error: "Missing competitionId" });

  const competition = await prisma.competition.findUnique({
    where: { id: competitionId },
    include: { tickets: { include: { order: true } } },
  });

  if (!competition) return res.status(404).json({ error: "Competition not found" });

  // Only pick from paid orders
  const validTickets = competition.tickets.filter((t) => t.order.status === "paid");
  if (validTickets.length === 0) {
    return res.status(400).json({ error: "No valid tickets to draw from" });
  }

  const existingWinner = await prisma.winner.findUnique({ where: { competitionId } });
  if (existingWinner) {
    return res.status(400).json({ error: "Winner already drawn" });
  }

  // Random selection
  const winnerTicket = validTickets[Math.floor(Math.random() * validTickets.length)];

  const winner = await prisma.winner.create({
    data: {
      competitionId,
      ticketId: winnerTicket.id,
      winnerName: winnerTicket.order.customerName,
      winnerEmail: winnerTicket.order.email,
    },
  });

  await prisma.competition.update({
    where: { id: competitionId },
    data: { status: "drawn" },
  });

  return res.status(200).json({
    winner,
    ticketNumber: winnerTicket.ticketNumber,
    winnerName: winnerTicket.order.customerName,
    winnerEmail: winnerTicket.order.email,
  });
}
