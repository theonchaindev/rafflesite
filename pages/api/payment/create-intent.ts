import type { NextApiRequest, NextApiResponse } from "next";
import { getStripeServer } from "@/lib/stripe";
import { getCompetitionById } from "@/data/competitions";

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

  // Validate competitions exist
  for (const item of items) {
    const comp = getCompetitionById(item.competitionId);
    if (!comp) return res.status(400).json({ error: `Competition not found: ${item.competitionTitle}` });
    if (item.quantity > comp.maxPerOrder) return res.status(400).json({ error: `Exceeds max per order for: ${comp.title}` });
    const remaining = comp.maxTickets - comp.ticketsSold;
    if (item.quantity > remaining) return res.status(400).json({ error: `Not enough tickets for: ${comp.title}` });
  }

  const total = items.reduce((sum, i) => sum + i.ticketPrice * i.quantity, 0);
  const totalPence = Math.round(total * 100);

  const stripe = getStripeServer();

  const paymentIntent = await stripe.paymentIntents.create({
    amount: totalPence,
    currency: "gbp",
    automatic_payment_methods: { enabled: true },
    metadata: {
      customerName: customer.fullName,
      customerEmail: customer.email,
      customerPhone: customer.phone,
      items: JSON.stringify(
        items.map((i) => ({ competitionId: i.competitionId, competitionTitle: i.competitionTitle, quantity: i.quantity, ticketPrice: i.ticketPrice }))
      ),
    },
    receipt_email: customer.email,
  });

  return res.status(200).json({ clientSecret: paymentIntent.client_secret });
}
