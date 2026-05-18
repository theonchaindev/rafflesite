import type { GetServerSideProps } from "next";
import Head from "next/head";
import Link from "next/link";
import { CheckCircle, Ticket, Home } from "lucide-react";
import Layout from "@/components/Layout";
import { getStripeServer } from "@/lib/stripe";

interface TicketGroup {
  competitionTitle: string;
  ticketNumbers: number[];
}

interface Props {
  orderId: string;
  customerName: string;
  email: string;
  total: number;
  ticketGroups: TicketGroup[];
}

function generateTicketNumbers(seed: string, quantity: number): number[] {
  const tickets = new Set<number>();
  let counter = 0;
  while (tickets.size < quantity) {
    const hash = Array.from(`${seed}-${counter++}`).reduce((acc, c) => Math.imul(31, acc) + c.charCodeAt(0), 0);
    const num = (Math.abs(hash) % 10000) + 1;
    tickets.add(num);
  }
  return Array.from(tickets).sort((a, b) => a - b);
}

export default function OrderConfirmationPage({ orderId, customerName, email, total, ticketGroups }: Props) {
  return (
    <>
      <Head><title>Order Confirmed — LuxRaffle</title></Head>
      <Layout>
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16">
          <div style={{ textAlign: "center", marginBottom: "40px" }}>
            <div style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: "80px", height: "80px", background: "rgba(39,174,96,0.1)", border: "2px solid rgba(39,174,96,0.3)", borderRadius: "50%", marginBottom: "20px" }}>
              <CheckCircle size={40} style={{ color: "#27ae60" }} />
            </div>
            <h1 style={{ fontFamily: "var(--font-playfair), Georgia, serif", fontSize: "clamp(28px, 4vw, 42px)", fontWeight: 800, color: "#f5f0e8", marginBottom: "12px" }}>
              You're in the draw!
            </h1>
            <p style={{ color: "#aaa", fontSize: "16px" }}>
              Thanks {customerName}! Your order is confirmed and your tickets are registered. Good luck!
            </p>
          </div>

          <div className="glass-card" style={{ padding: "20px 24px", marginBottom: "24px", display: "flex", flexWrap: "wrap", gap: "16px", alignItems: "center", justifyContent: "space-between" }}>
            <div>
              <p style={{ color: "#888", fontSize: "12px", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "4px" }}>Order Reference</p>
              <p style={{ color: "#c9a84c", fontSize: "20px", fontWeight: 700 }}>#{orderId.slice(-8).toUpperCase()}</p>
            </div>
            <div>
              <p style={{ color: "#888", fontSize: "12px", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "4px" }}>Total Paid</p>
              <p style={{ color: "#f5f0e8", fontSize: "16px", fontWeight: 600 }}>£{total.toFixed(2)}</p>
            </div>
          </div>

          <div style={{ background: "rgba(201,168,76,0.05)", border: "1px solid rgba(201,168,76,0.2)", borderRadius: "10px", padding: "16px 20px", marginBottom: "28px" }}>
            <p style={{ color: "#888", fontSize: "14px" }}>
              A confirmation email has been sent to <strong style={{ color: "#c9a84c" }}>{email}</strong> with your ticket numbers.
            </p>
          </div>

          <div className="glass-card" style={{ padding: "28px", marginBottom: "28px" }}>
            <h2 style={{ fontFamily: "var(--font-playfair), Georgia, serif", fontSize: "22px", fontWeight: 700, color: "#f5f0e8", marginBottom: "20px" }}>
              Your Tickets
            </h2>
            <div className="flex flex-col gap-5">
              {ticketGroups.map((group) => (
                <div key={group.competitionTitle} style={{ borderBottom: "1px solid #1a1a1a", paddingBottom: "20px" }}>
                  <div className="flex items-center gap-2" style={{ marginBottom: "12px" }}>
                    <Ticket size={16} style={{ color: "#c9a84c" }} />
                    <h3 style={{ color: "#f5f0e8", fontWeight: 600, fontSize: "16px" }}>{group.competitionTitle}</h3>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {group.ticketNumbers.map((num) => (
                      <span key={num} style={{ background: "rgba(201,168,76,0.1)", border: "1px solid rgba(201,168,76,0.3)", borderRadius: "6px", padding: "4px 10px", color: "#c9a84c", fontSize: "13px", fontWeight: 600 }}>
                        #{String(num).padStart(4, "0")}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <Link href="/#competitions" style={{ flex: 1 }}>
              <button className="btn-outline-gold" style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}>
                <Ticket size={16} /> Enter More
              </button>
            </Link>
            <Link href="/" style={{ flex: 1 }}>
              <button className="btn-gold" style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}>
                <Home size={16} /> Back to Home
              </button>
            </Link>
          </div>
        </div>
      </Layout>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const orderId = params?.orderId as string;
  if (!orderId || orderId === "pending") return { notFound: true };

  // Reconstruct from Stripe payment intent
  const piId = orderId.length < 20 ? null : `pi_${orderId}`;
  if (!piId) return { notFound: true };

  try {
    const stripe = getStripeServer();
    const paymentIntent = await stripe.paymentIntents.retrieve(piId);

    if (paymentIntent.status !== "succeeded") return { notFound: true };

    const { customerName, customerEmail, items: itemsJson } = paymentIntent.metadata;
    const items: Array<{ competitionId: string; competitionTitle: string; quantity: number; ticketPrice: number }> = JSON.parse(itemsJson || "[]");

    const ticketGroups = items.map((item) => ({
      competitionTitle: item.competitionTitle,
      ticketNumbers: generateTicketNumbers(`${piId}-${item.competitionId}`, item.quantity),
    }));

    const total = items.reduce((sum, i) => sum + i.ticketPrice * i.quantity, 0);

    return {
      props: { orderId, customerName, email: customerEmail, total, ticketGroups },
    };
  } catch {
    return { notFound: true };
  }
};
