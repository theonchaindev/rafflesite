import type { NextApiRequest, NextApiResponse } from "next";
import { getStripeServer } from "@/lib/stripe";
import prisma from "@/lib/prisma";

interface CartItem {
  competitionId: string;
  competitionTitle: string;
  quantity: number;
  ticketPrice: number;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).end();

  const { items, customer } = req.body as {
    items: CartItem[];
    customer: { fullName: string; email: string; phone: string };
  };

  if (!items?.length || !customer?.fullName || !customer?.email || !customer?.phone) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  // Validate competitions and ticket availability
  const competitionIds = items.map((i) => i.competitionId);
  const competitions = await prisma.competition.findMany({
    where: { id: { in: competitionIds }, status: "active" },
  });

  for (const item of items) {
    const comp = competitions.find((c) => c.id === item.competitionId);
    if (!comp) {
      return res.status(400).json({ error: `Competition not found: ${item.competitionTitle}` });
    }
    const remaining = comp.maxTickets - comp.ticketsSold;
    if (item.quantity > remaining) {
      return res.status(400).json({ error: `Not enough tickets for: ${comp.title}` });
    }
    if (item.quantity > comp.maxPerOrder) {
      return res.status(400).json({ error: `Exceeds max per order for: ${comp.title}` });
    }
  }

  // Calculate total in pence
  const total = items.reduce((sum, i) => sum + i.ticketPrice * i.quantity, 0);
  const totalPence = Math.round(total * 100);

  const stripe = getStripeServer();

  // Create a pending order first
  const order = await prisma.order.create({
    data: {
      customerName: customer.fullName,
      email: customer.email,
      phone: customer.phone,
      total,
      status: "pending",
    },
  });

  // Create payment intent with order metadata
  const paymentIntent = await stripe.paymentIntents.create({
    amount: totalPence,
    currency: "gbp",
    automatic_payment_methods: { enabled: true },
    metadata: {
      orderId: order.id,
      items: JSON.stringify(items.map((i) => ({ competitionId: i.competitionId, quantity: i.quantity }))),
      customerEmail: customer.email,
      customerName: customer.fullName,
    },
    receipt_email: customer.email,
  });

  // Store the payment intent ID on the order
  await prisma.order.update({
    where: { id: order.id },
    data: { stripePaymentId: paymentIntent.id },
  });

  return res.status(200).json({ clientSecret: paymentIntent.client_secret });
}
