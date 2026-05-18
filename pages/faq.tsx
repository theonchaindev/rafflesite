import Head from "next/head";
import Link from "next/link";
import { useState } from "react";
import { ChevronDown } from "lucide-react";
import Layout from "@/components/Layout";

const faqs = [
  {
    q: "How does the draw work?",
    a: "Once a competition closes (either the draw date is reached or all tickets are sold), we conduct a random draw using a certified random number generator. Every valid ticket — both online and postal — is given an equal chance. The winning ticket number is selected and the holder is notified by email within 24 hours.",
  },
  {
    q: "Can I get a refund on my tickets?",
    a: "All ticket sales are final. Refunds are not available once tickets have been purchased, except in the unlikely event that the Promoter cancels a competition, in which case all ticket holders will receive a full refund to their original payment method.",
  },
  {
    q: "How do I enter by post for free?",
    a: "No purchase is necessary. Write your full name, email address, phone number, and the competition name on a postcard or piece of paper. Post it to our address listed on the Postal Entry page. One postal entry per person per competition. Postal entries are processed within 5 working days and have an equal chance of winning.",
  },
  {
    q: "When will the winner be announced?",
    a: "Winners are announced within 24 hours of the draw. The draw takes place once the competition closes — either at the stated draw date, or when all tickets have been sold (whichever comes first). Winners are contacted by email and announced on our website and social media.",
  },
  {
    q: "What happens if I win?",
    a: "We'll contact you by email using the address you provided at checkout. You'll need to respond within 28 days to claim your prize. We'll arrange delivery or collection of physical prizes, or transfer cash prizes directly. If we cannot contact you within 28 days, we reserve the right to draw a new winner.",
  },
  {
    q: "Is LuxRaffle legal?",
    a: "Yes. Our competitions are prize draws, not lotteries, and are fully compliant with the Gambling Act 2005 and UK competition law. We always provide a free entry route (postal entry) to ensure compliance. We are operated in England and Wales.",
  },
  {
    q: "How many tickets can I buy?",
    a: "Each competition has a maximum ticket limit per person, which is displayed on the competition page. This ensures the draw remains fair and competitive. You can purchase multiple tickets to increase your chances.",
  },
  {
    q: "Are the photos of prizes accurate?",
    a: "Yes — the photos shown represent the actual prize. In the rare event a prize becomes unavailable, we reserve the right to substitute a prize of equal or greater value. This is always disclosed clearly.",
  },
  {
    q: "How are ticket numbers assigned?",
    a: "Online purchases receive ticket numbers immediately after payment is confirmed — they're shown on your order confirmation page and emailed to you. Postal entries receive ticket numbers when processed (within 5 working days). All ticket numbers go into the same draw.",
  },
  {
    q: "What payment methods are accepted?",
    a: "We accept all major debit and credit cards, Apple Pay, Google Pay, and Klarna (pay in 3 instalments). All payments are processed securely through Stripe and protected by 256-bit SSL encryption.",
  },
];

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);

  return (
    <div style={{ border: "1px solid #1a1a1a", borderRadius: "10px", overflow: "hidden", transition: "border-color 0.2s" }}
      onMouseEnter={(e) => (e.currentTarget.style.borderColor = "rgba(201,168,76,0.2)")}
      onMouseLeave={(e) => (e.currentTarget.style.borderColor = "#1a1a1a")}>
      <button
        onClick={() => setOpen(!open)}
        style={{ width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center", padding: "20px 24px", background: "#111", border: "none", cursor: "pointer", textAlign: "left", gap: "16px" }}
      >
        <span style={{ color: "#f5f0e8", fontSize: "15px", fontWeight: 500 }}>{q}</span>
        <ChevronDown
          size={18}
          style={{ color: "#c9a84c", flexShrink: 0, transform: open ? "rotate(180deg)" : "rotate(0)", transition: "transform 0.25s" }}
        />
      </button>
      {open && (
        <div style={{ padding: "0 24px 20px", background: "#111" }}>
          <p style={{ color: "#aaa", fontSize: "15px", lineHeight: "1.7" }}>{a}</p>
        </div>
      )}
    </div>
  );
}

export default function FAQPage() {
  return (
    <>
      <Head>
        <title>FAQ — LuxRaffle</title>
        <meta name="description" content="Frequently asked questions about LuxRaffle competitions." />
      </Head>
      <Layout>
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16">
          <div style={{ textAlign: "center", marginBottom: "48px" }}>
            <h1 style={{ fontFamily: "var(--font-playfair), Georgia, serif", fontSize: "clamp(32px, 4vw, 48px)", fontWeight: 700, color: "#f5f0e8", marginBottom: "16px" }}>
              Frequently Asked Questions
            </h1>
            <p style={{ color: "#888", fontSize: "16px" }}>
              Got a question? We've got answers. Can't find what you're looking for?{" "}
              <a href="mailto:hello@luxraffle.co.uk" style={{ color: "#c9a84c" }}>Email us</a>.
            </p>
          </div>

          <div className="flex flex-col gap-3">
            {faqs.map((faq) => (
              <FAQItem key={faq.q} {...faq} />
            ))}
          </div>

          <div style={{ marginTop: "48px", textAlign: "center" }}>
            <p style={{ color: "#666", fontSize: "14px", marginBottom: "20px" }}>
              Ready to enter? Browse our live competitions below.
            </p>
            <Link href="/#competitions">
              <button className="btn-gold">Browse Competitions</button>
            </Link>
          </div>
        </div>
      </Layout>
    </>
  );
}
