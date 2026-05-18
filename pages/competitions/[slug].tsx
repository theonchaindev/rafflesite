import type { GetServerSideProps } from "next";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Minus, Plus, ShoppingCart, Shield, Ticket, Clock, Mail, ChevronRight } from "lucide-react";
import Layout from "@/components/Layout";
import CountdownTimer from "@/components/CountdownTimer";
import { useCart } from "@/context/CartContext";
import prisma from "@/lib/prisma";

interface Competition {
  id: string;
  title: string;
  slug: string;
  description: string;
  prizeValue: number;
  ticketPrice: number;
  maxTickets: number;
  ticketsSold: number;
  drawDate: string;
  imageUrl: string | null;
  images: string | null;
  maxPerOrder: number;
}

export default function CompetitionPage({ competition }: { competition: Competition }) {
  const { addItem, items } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  const remaining = competition.maxTickets - competition.ticketsSold;
  const soldPercent = Math.round((competition.ticketsSold / competition.maxTickets) * 100);
  const maxQty = Math.min(competition.maxPerOrder, remaining);

  const inCart = items.find((i) => i.competitionId === competition.id);
  const alreadyInCart = inCart?.quantity ?? 0;

  const allImages = competition.images
    ? [competition.imageUrl, ...JSON.parse(competition.images)].filter(Boolean)
    : [competition.imageUrl].filter(Boolean);

  const [activeImage, setActiveImage] = useState(0);

  function handleAdd() {
    addItem({
      competitionId: competition.id,
      competitionTitle: competition.title,
      slug: competition.slug,
      ticketPrice: competition.ticketPrice,
      imageUrl: competition.imageUrl ?? undefined,
      maxPerOrder: competition.maxPerOrder,
      maxTickets: competition.maxTickets,
      ticketsSold: competition.ticketsSold,
      quantity,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  }

  return (
    <>
      <Head>
        <title>{competition.title} — LuxRaffle</title>
        <meta name="description" content={competition.description} />
      </Head>
      <Layout>
        {/* Breadcrumb */}
        <div style={{ borderBottom: "1px solid #1a1a1a", padding: "12px 0" }}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center gap-2" style={{ color: "#666", fontSize: "13px" }}>
            <Link href="/" style={{ color: "#888", transition: "color 0.2s" }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#c9a84c")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "#888")}>Home</Link>
            <ChevronRight size={12} />
            <Link href="/#competitions" style={{ color: "#888", transition: "color 0.2s" }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#c9a84c")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "#888")}>Competitions</Link>
            <ChevronRight size={12} />
            <span style={{ color: "#c9a84c" }}>{competition.title}</span>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Image gallery */}
            <div>
              <div style={{ position: "relative", height: "420px", background: "#111", borderRadius: "12px", overflow: "hidden", border: "1px solid rgba(201,168,76,0.15)", marginBottom: "12px" }}>
                {allImages[activeImage] ? (
                  <Image
                    src={allImages[activeImage] as string}
                    alt={competition.title}
                    fill
                    style={{ objectFit: "cover" }}
                    priority
                  />
                ) : (
                  <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Ticket size={64} style={{ color: "rgba(201,168,76,0.2)" }} />
                  </div>
                )}
                <div style={{ position: "absolute", top: "16px", left: "16px", background: "rgba(13,13,13,0.85)", border: "1px solid rgba(201,168,76,0.4)", borderRadius: "6px", padding: "5px 12px" }}>
                  <span style={{ color: "#c9a84c", fontSize: "14px", fontWeight: 700 }}>
                    Prize Value: £{competition.prizeValue.toLocaleString()}
                  </span>
                </div>
              </div>
              {allImages.length > 1 && (
                <div className="flex gap-2 flex-wrap">
                  {allImages.map((img, i) => (
                    <button
                      key={i}
                      onClick={() => setActiveImage(i)}
                      style={{ position: "relative", width: "72px", height: "72px", borderRadius: "8px", overflow: "hidden", border: `2px solid ${i === activeImage ? "#c9a84c" : "transparent"}`, background: "#111", cursor: "pointer" }}
                    >
                      <Image src={img as string} alt="" fill style={{ objectFit: "cover" }} />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Details + ticket selector */}
            <div>
              <h1 style={{ fontFamily: "var(--font-playfair), Georgia, serif", fontSize: "clamp(28px, 3vw, 40px)", fontWeight: 800, color: "#f5f0e8", marginBottom: "12px", lineHeight: "1.2" }}>
                {competition.title}
              </h1>
              <p style={{ color: "#aaa", fontSize: "16px", lineHeight: "1.7", marginBottom: "24px" }}>
                {competition.description}
              </p>

              {/* Countdown */}
              <div style={{ marginBottom: "24px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "10px" }}>
                  <Clock size={14} style={{ color: "#c9a84c" }} />
                  <span style={{ color: "#888", fontSize: "13px", textTransform: "uppercase", letterSpacing: "0.5px" }}>Draw Closes In</span>
                </div>
                <CountdownTimer drawDate={competition.drawDate} />
              </div>

              {/* Progress */}
              <div style={{ marginBottom: "24px" }}>
                <div className="flex justify-between" style={{ marginBottom: "8px" }}>
                  <span style={{ color: "#888", fontSize: "13px" }}>{competition.ticketsSold.toLocaleString()} tickets sold</span>
                  <span style={{ color: "#c9a84c", fontSize: "13px", fontWeight: 600 }}>{remaining.toLocaleString()} remaining</span>
                </div>
                <div className="progress-bar">
                  <div className="progress-bar-fill" style={{ width: `${soldPercent}%` }} />
                </div>
                <div style={{ textAlign: "right", color: "#555", fontSize: "11px", marginTop: "4px" }}>
                  {soldPercent}% sold of {competition.maxTickets.toLocaleString()} total
                </div>
              </div>

              {/* Ticket selector */}
              <div className="glass-card" style={{ padding: "24px", marginBottom: "20px" }}>
                <div style={{ marginBottom: "16px" }}>
                  <span style={{ color: "#c9a84c", fontSize: "28px", fontWeight: 800 }}>
                    £{competition.ticketPrice.toFixed(2)}
                  </span>
                  <span style={{ color: "#888", fontSize: "15px" }}> per ticket</span>
                </div>

                <div className="flex items-center gap-4" style={{ marginBottom: "16px" }}>
                  <span style={{ color: "#aaa", fontSize: "14px" }}>Quantity:</span>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      style={{ width: "36px", height: "36px", background: "#1a1a1a", border: "1px solid #333", borderRadius: "8px", color: "#f5f0e8", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}
                    >
                      <Minus size={16} />
                    </button>
                    <input
                      type="number"
                      min={1}
                      max={maxQty}
                      value={quantity}
                      onChange={(e) => {
                        const v = parseInt(e.target.value) || 1;
                        setQuantity(Math.min(Math.max(1, v), maxQty));
                      }}
                      style={{ width: "64px", textAlign: "center", background: "#111", border: "1px solid #333", borderRadius: "8px", color: "#f5f0e8", fontSize: "16px", fontWeight: 600, padding: "8px 4px" }}
                    />
                    <button
                      onClick={() => setQuantity(Math.min(maxQty, quantity + 1))}
                      style={{ width: "36px", height: "36px", background: "#1a1a1a", border: "1px solid #333", borderRadius: "8px", color: "#f5f0e8", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                </div>

                <div className="flex justify-between" style={{ marginBottom: "20px", padding: "12px 16px", background: "#111", borderRadius: "8px" }}>
                  <span style={{ color: "#888" }}>Total</span>
                  <span style={{ color: "#c9a84c", fontWeight: 700, fontSize: "18px" }}>
                    £{(quantity * competition.ticketPrice).toFixed(2)}
                  </span>
                </div>

                {remaining === 0 ? (
                  <button className="btn-gold" style={{ width: "100%", opacity: 0.4, cursor: "not-allowed" }} disabled>
                    Sold Out
                  </button>
                ) : (
                  <button
                    className="btn-gold"
                    style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}
                    onClick={handleAdd}
                  >
                    <ShoppingCart size={18} />
                    {added ? "Added!" : "Add to Basket"}
                  </button>
                )}

                {alreadyInCart > 0 && (
                  <p style={{ textAlign: "center", color: "#888", fontSize: "12px", marginTop: "10px" }}>
                    You already have {alreadyInCart} in your basket.{" "}
                    <Link href="/basket" style={{ color: "#c9a84c" }}>View basket</Link>
                  </p>
                )}
              </div>

              {/* Trust badges */}
              <div className="grid grid-cols-2 gap-3">
                {[
                  { icon: Shield, text: "Secure Payment" },
                  { icon: Ticket, text: "Instant Ticket Assignment" },
                  { icon: Clock, text: "24h Draw Notification" },
                  { icon: Mail, text: "Email Confirmation" },
                ].map(({ icon: Icon, text }) => (
                  <div key={text} className="flex items-center gap-2" style={{ color: "#888", fontSize: "12px" }}>
                    <Icon size={13} style={{ color: "#c9a84c", flexShrink: 0 }} />
                    <span>{text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Postal entry notice */}
          <div style={{ marginTop: "48px", background: "rgba(201,168,76,0.05)", border: "1px solid rgba(201,168,76,0.2)", borderRadius: "12px", padding: "24px 28px" }}>
            <div className="flex items-start gap-4">
              <Mail size={20} style={{ color: "#c9a84c", flexShrink: 0, marginTop: "2px" }} />
              <div>
                <h4 style={{ color: "#f5f0e8", fontWeight: 600, marginBottom: "8px" }}>
                  Free Postal Entry Available
                </h4>
                <p style={{ color: "#888", fontSize: "14px", lineHeight: "1.6" }}>
                  No purchase necessary. You can enter this competition for free by post. Write your full name, email address, phone number, and this competition's name (<strong style={{ color: "#c9a84c" }}>{competition.title}</strong>) on a postcard and send it to our address.{" "}
                  <Link href="/postal-entry" style={{ color: "#c9a84c" }}>Learn more about postal entries →</Link>
                </p>
              </div>
            </div>
          </div>

          {/* Terms */}
          <div style={{ marginTop: "24px", padding: "20px 28px", background: "#111", borderRadius: "12px" }}>
            <h4 style={{ color: "#c9a84c", fontSize: "13px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "1px", marginBottom: "10px" }}>
              Competition Terms
            </h4>
            <ul style={{ color: "#666", fontSize: "13px", lineHeight: "2", listStyle: "disc", paddingLeft: "20px" }}>
              <li>Open to UK residents aged 18 and over.</li>
              <li>Maximum {competition.maxPerOrder} tickets per person per order.</li>
              <li>Draw will take place on or after {new Date(competition.drawDate).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}.</li>
              <li>Winner selected by random number generator from valid ticket entries.</li>
              <li>No cash alternative to stated prize.</li>
              <li>Full terms and conditions apply. <Link href="/terms" style={{ color: "#c9a84c" }}>Read T&Cs</Link></li>
            </ul>
          </div>
        </div>
      </Layout>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const slug = params?.slug as string;
  const competition = await prisma.competition.findUnique({ where: { slug } });

  if (!competition || competition.status !== "active") {
    return { notFound: true };
  }

  return {
    props: {
      competition: {
        ...competition,
        drawDate: competition.drawDate.toISOString(),
        createdAt: competition.createdAt.toISOString(),
      },
    },
  };
};
