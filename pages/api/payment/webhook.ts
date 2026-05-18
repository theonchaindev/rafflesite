import type { NextApiRequest, NextApiResponse } from "next";
import { getStripeServer } from "@/lib/stripe";
import prisma from "@/lib/prisma";
import { sendOrderConfirmationEmail } from "@/lib/email";
import { buffer } from "micro";

export const config = { api: { bodyParser: false } };

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).end();

  const stripe = getStripeServer();
  const sig = req.headers["stripe-signature"];
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!sig || !webhookSecret) return res.status(400).json({ error: "Missing stripe-signature or webhook secret" });

  let event;
  try {
    const rawBody = await buffer(req);
    event = stripe.webhooks.constructEvent(rawBody, sig, webhookSecret);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Webhook error";
    return res.status(400).json({ error: message });
  }

  if (event.type === "payment_intent.succeeded") {
    const paymentIntent = event.data.object;
    const { orderId, items: itemsJson } = paymentIntent.metadata;

    if (!orderId) return res.status(200).json({ received: true });

    const order = await prisma.order.findUnique({ where: { id: orderId } });
    if (!order || order.status === "paid") return res.status(200).json({ received: true });

    const items: Array<{ competitionId: string; quantity: number }> = JSON.parse(itemsJson || "[]");

    await prisma.$transaction(async (tx) => {
      await tx.order.update({ where: { id: orderId }, data: { status: "paid" } });

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
  }

  return res.status(200).json({ received: true });
}
