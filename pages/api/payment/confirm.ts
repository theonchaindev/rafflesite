import type { NextApiRequest, NextApiResponse } from "next";
import { getStripeServer } from "@/lib/stripe";
import prisma from "@/lib/prisma";
import { sendOrderConfirmationEmail } from "@/lib/email";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).end();

  const { paymentIntentId } = req.body;
  if (!paymentIntentId) return res.status(400).json({ error: "Missing paymentIntentId" });

  const stripe = getStripeServer();
  const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

  if (paymentIntent.status !== "succeeded") {
    return res.status(400).json({ error: "Payment not succeeded" });
  }

  const { orderId, items: itemsJson } = paymentIntent.metadata;
  if (!orderId) return res.status(400).json({ error: "Missing orderId in metadata" });

  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: { tickets: true },
  });

  if (!order) return res.status(404).json({ error: "Order not found" });

  // Already fulfilled
  if (order.status === "paid") {
    return res.status(200).json({ orderId: order.id });
  }

  const items: Array<{ competitionId: string; quantity: number }> = JSON.parse(itemsJson || "[]");

  // Assign tickets in a transaction
  await prisma.$transaction(async (tx) => {
    // Update order status
    await tx.order.update({
      where: { id: orderId },
      data: { status: "paid" },
    });

    // For each competition, assign sequential ticket numbers
    for (const item of items) {
      const comp = await tx.competition.findUnique({ where: { id: item.competitionId } });
      if (!comp) continue;

      const startTicket = comp.ticketsSold + 1;
      const ticketData = Array.from({ length: item.quantity }, (_, i) => ({
        ticketNumber: startTicket + i,
        competitionId: item.competitionId,
        orderId,
      }));

      await tx.ticket.createMany({ data: ticketData });
      await tx.competition.update({
        where: { id: item.competitionId },
        data: { ticketsSold: { increment: item.quantity } },
      });
    }
  });

  // Fetch updated order with tickets for email
  const fulfilledOrder = await prisma.order.findUnique({
    where: { id: orderId },
    include: {
      tickets: {
        include: { competition: { select: { title: true } } },
        orderBy: { ticketNumber: "asc" },
      },
    },
  });

  if (fulfilledOrder) {
    const groupMap: Record<string, { competitionTitle: string; ticketNumbers: number[]; quantity: number }> = {};
    for (const ticket of fulfilledOrder.tickets) {
      const title = ticket.competition.title;
      if (!groupMap[title]) groupMap[title] = { competitionTitle: title, ticketNumbers: [], quantity: 0 };
      groupMap[title].ticketNumbers.push(ticket.ticketNumber);
      groupMap[title].quantity++;
    }

    await sendOrderConfirmationEmail({
      to: order.email,
      customerName: order.customerName,
      orderId: order.id,
      tickets: Object.values(groupMap),
      total: order.total,
    });
  }

  return res.status(200).json({ orderId });
}
