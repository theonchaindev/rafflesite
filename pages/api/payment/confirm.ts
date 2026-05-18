import type { NextApiRequest, NextApiResponse } from "next";
import { getStripeServer } from "@/lib/stripe";
import { sendOrderConfirmationEmail } from "@/lib/email";

function generateTicketNumbers(seed: string, quantity: number, maxTickets: number): number[] {
  // Deterministic ticket numbers based on payment intent ID + competition
  const tickets = new Set<number>();
  let counter = 0;
  while (tickets.size < quantity) {
    const hash = Array.from(`${seed}-${counter++}`).reduce((acc, c) => Math.imul(31, acc) + c.charCodeAt(0), 0);
    const num = (Math.abs(hash) % maxTickets) + 1;
    tickets.add(num);
  }
  return Array.from(tickets).sort((a, b) => a - b);
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).end();

  const { paymentIntentId } = req.body;
  if (!paymentIntentId) return res.status(400).json({ error: "Missing paymentIntentId" });

  const stripe = getStripeServer();
  const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

  if (paymentIntent.status !== "succeeded") {
    return res.status(400).json({ error: "Payment not succeeded" });
  }

  const { customerName, customerEmail, customerPhone, items: itemsJson } = paymentIntent.metadata;
  const items: Array<{ competitionId: string; competitionTitle: string; quantity: number; ticketPrice: number }> = JSON.parse(itemsJson || "[]");

  // Generate ticket groups for each competition
  const ticketGroups = items.map((item) => {
    const ticketNumbers = generateTicketNumbers(
      `${paymentIntentId}-${item.competitionId}`,
      item.quantity,
      10000
    );
    return { competitionTitle: item.competitionTitle, ticketNumbers, quantity: item.quantity };
  });

  const total = items.reduce((sum, i) => sum + i.ticketPrice * i.quantity, 0);
  const orderId = paymentIntentId.replace("pi_", "");

  // Send confirmation email
  await sendOrderConfirmationEmail({
    to: customerEmail,
    customerName,
    orderId,
    tickets: ticketGroups,
    total,
  });

  return res.status(200).json({ orderId, ticketGroups, customerName, customerEmail, total });
}
