import type { GetServerSideProps } from "next";
import Head from "next/head";
import Link from "next/link";
import Image from "next/image";
import { ChevronRight, Star, Shield, Zap, Trophy, Gift } from "lucide-react";
import Layout from "@/components/Layout";
import CompetitionCard from "@/components/CompetitionCard";
import CountdownTimer from "@/components/CountdownTimer";
import prisma from "@/lib/prisma";

interface CompetitionItem {
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
  maxPerOrder: number;
}

interface WinnerItem {
  id: string;
  winnerName: string;
  announcedAt: string;
  competition: {
    title: string;
    prizeValue: number;
    imageUrl: string | null;
  };
}

interface Props {
  competitions: CompetitionItem[];
  winners: WinnerItem[];
  siteName: string;
}

export default function HomePage({ competitions, winners, siteName }: Props) {
  return (
    <>
      <Head>
        <title>{siteName} — Win Premium Prizes</title>
        <meta name="description" content="Enter our premium competitions and win life-changing prizes. Fully licensed and compliant with UK competition law." />
      </Head>
      <Layout>
        {/* Hero */}
        <section style={{ position: "relative", minHeight: "92vh", display: "flex", alignItems: "center", overflow: "hidden", background: "linear-gradient(160deg, #0d0d0d 0%, #1a1205 50%, #0d0d0d 100%)" }}>
          {/* Background decoration */}
          <div style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none" }}>
            <div style={{ position: "absolute", top: "10%", left: "5%", width: "600px", height: "600px", background: "radial-gradient(circle, rgba(201,168,76,0.06) 0%, transparent 70%)", borderRadius: "50%" }} />
            <div style={{ position: "absolute", bottom: "10%", right: "5%", width: "400px", height: "400px", background: "radial-gradient(circle, rgba(201,168,76,0.04) 0%, transparent 70%)", borderRadius: "50%" }} />
          </div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full" style={{ position: "relative", zIndex: 1 }}>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="animate-fade-in-up">
                <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", background: "rgba(201,168,76,0.1)", border: "1px solid rgba(201,168,76,0.3)", borderRadius: "100px", padding: "6px 14px", marginBottom: "24px" }}>
                  <Trophy size={14} style={{ color: "#c9a84c" }} />
                  <span style={{ color: "#c9a84c", fontSize: "13px", fontWeight: 500 }}>Premium UK Competitions</span>
                </div>

                <h1 style={{ fontFamily: "var(--font-playfair), Georgia, serif", fontSize: "clamp(42px, 6vw, 72px)", fontWeight: 800, lineHeight: 1.1, color: "#f5f0e8", marginBottom: "24px" }}>
                  Win Your{" "}
                  <span className="text-gold-gradient">Dream Prize</span>
                  {" "}Today
                </h1>

                <p style={{ color: "#aaa", fontSize: "18px", lineHeight: "1.7", marginBottom: "36px", maxWidth: "520px" }}>
                  Enter our exclusive competitions for a chance to win luxury cars, holidays, cash prizes, and more. Tickets from just £1.99.
                </p>

                <div className="flex flex-wrap gap-4">
                  <Link href="#competitions">
                    <button className="btn-gold" style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "16px", padding: "16px 32px" }}>
                      Enter Now <ChevronRight size={18} />
                    </button>
                  </Link>
                  <Link href="/how-it-works">
                    <button className="btn-outline-gold" style={{ fontSize: "15px", padding: "15px 28px" }}>
                      How It Works
                    </button>
                  </Link>
                </div>

                {/* Trust signals */}
                <div className="flex flex-wrap gap-6 mt-10">
                  {[
                    { icon: Shield, label: "UK Law Compliant" },
                    { icon: Star, label: "5-Star Rated" },
                    { icon: Zap, label: "Instant Entry" },
                  ].map(({ icon: Icon, label }) => (
                    <div key={label} className="flex items-center gap-2">
                      <Icon size={14} style={{ color: "#c9a84c" }} />
                      <span style={{ color: "#888", fontSize: "13px" }}>{label}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Stats */}
              <div className="hidden lg:grid grid-cols-2 gap-4">
                {[
                  { value: "£500K+", label: "In Prizes Won" },
                  { value: "10,000+", label: "Happy Winners" },
                  { value: "100%", label: "Transparent Draws" },
                  { value: "24/7", label: "Customer Support" },
                ].map(({ value, label }) => (
                  <div key={label} className="glass-card" style={{ padding: "28px 24px", textAlign: "center" }}>
                    <div style={{ fontFamily: "var(--font-playfair), Georgia, serif", fontSize: "36px", fontWeight: 800, color: "#c9a84c", marginBottom: "8px" }}>
                      {value}
                    </div>
                    <div style={{ color: "#888", fontSize: "14px" }}>{label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Active Competitions */}
        <section id="competitions" style={{ padding: "80px 0" }}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center" style={{ marginBottom: "56px" }}>
              <p style={{ color: "#c9a84c", fontSize: "13px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "2px", marginBottom: "12px" }}>
                Live Competitions
              </p>
              <h2 style={{ fontFamily: "var(--font-playfair), Georgia, serif", fontSize: "clamp(32px, 4vw, 48px)", fontWeight: 700, color: "#f5f0e8" }}>
                Enter to Win
              </h2>
            </div>

            {competitions.length === 0 ? (
              <div style={{ textAlign: "center", padding: "80px 0", color: "#666" }}>
                <Gift size={48} style={{ color: "rgba(201,168,76,0.3)", margin: "0 auto 16px" }} />
                <p>No active competitions right now. Check back soon!</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {competitions.map((c) => (
                  <CompetitionCard key={c.id} {...c} />
                ))}
              </div>
            )}
          </div>
        </section>

        {/* How It Works */}
        <section style={{ padding: "80px 0", background: "#080808", borderTop: "1px solid rgba(201,168,76,0.1)", borderBottom: "1px solid rgba(201,168,76,0.1)" }}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center" style={{ marginBottom: "56px" }}>
              <p style={{ color: "#c9a84c", fontSize: "13px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "2px", marginBottom: "12px" }}>
                Simple Process
              </p>
              <h2 style={{ fontFamily: "var(--font-playfair), Georgia, serif", fontSize: "clamp(32px, 4vw, 48px)", fontWeight: 700, color: "#f5f0e8" }}>
                How It Works
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  step: "01",
                  icon: Zap,
                  title: "Pick Your Tickets",
                  desc: "Browse our live competitions and choose how many tickets you want to enter. More tickets = more chances to win.",
                },
                {
                  step: "02",
                  icon: Shield,
                  title: "Secure Checkout",
                  desc: "Complete your purchase with our 100% secure payment system. We accept card, Apple Pay, Google Pay, and Klarna.",
                },
                {
                  step: "03",
                  icon: Trophy,
                  title: "You Could Win",
                  desc: "Your ticket numbers are assigned instantly. If your number is drawn at the deadline, you win the prize!",
                },
              ].map(({ step, icon: Icon, title, desc }) => (
                <div key={step} className="glass-card" style={{ padding: "36px 28px", textAlign: "center" }}>
                  <div style={{ position: "relative", display: "inline-flex", alignItems: "center", justifyContent: "center", marginBottom: "20px" }}>
                    <div style={{ width: "64px", height: "64px", background: "rgba(201,168,76,0.1)", border: "1px solid rgba(201,168,76,0.3)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <Icon size={24} style={{ color: "#c9a84c" }} />
                    </div>
                    <span style={{ position: "absolute", top: "-8px", right: "-12px", background: "#c9a84c", color: "#0d0d0d", borderRadius: "50%", width: "22px", height: "22px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "10px", fontWeight: 700 }}>
                      {step}
                    </span>
                  </div>
                  <h3 style={{ fontFamily: "var(--font-playfair), Georgia, serif", fontSize: "20px", fontWeight: 700, color: "#f5f0e8", marginBottom: "12px" }}>
                    {title}
                  </h3>
                  <p style={{ color: "#888", fontSize: "14px", lineHeight: "1.7" }}>{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Winners */}
        {winners.length > 0 && (
          <section id="winners" style={{ padding: "80px 0" }}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center" style={{ marginBottom: "56px" }}>
                <p style={{ color: "#c9a84c", fontSize: "13px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "2px", marginBottom: "12px" }}>
                  Hall of Fame
                </p>
                <h2 style={{ fontFamily: "var(--font-playfair), Georgia, serif", fontSize: "clamp(32px, 4vw, 48px)", fontWeight: 700, color: "#f5f0e8" }}>
                  Recent Winners
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {winners.map((w) => (
                  <div key={w.id} className="glass-card" style={{ padding: "24px", display: "flex", gap: "16px", alignItems: "center" }}>
                    {w.competition.imageUrl ? (
                      <div style={{ position: "relative", width: "70px", height: "70px", borderRadius: "8px", overflow: "hidden", flexShrink: 0 }}>
                        <Image src={w.competition.imageUrl} alt={w.competition.title} fill style={{ objectFit: "cover" }} />
                      </div>
                    ) : (
                      <div style={{ width: "70px", height: "70px", borderRadius: "8px", background: "rgba(201,168,76,0.1)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                        <Trophy size={28} style={{ color: "#c9a84c" }} />
                      </div>
                    )}
                    <div>
                      <div style={{ color: "#c9a84c", fontSize: "12px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "4px" }}>
                        Winner
                      </div>
                      <div style={{ color: "#f5f0e8", fontSize: "16px", fontWeight: 600, marginBottom: "2px" }}>
                        {w.winnerName}
                      </div>
                      <div style={{ color: "#888", fontSize: "13px", marginBottom: "4px" }}>
                        {w.competition.title}
                      </div>
                      <div style={{ color: "#c9a84c", fontSize: "14px", fontWeight: 700 }}>
                        £{w.competition.prizeValue.toLocaleString()}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* CTA banner */}
        <section style={{ padding: "60px 0" }}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div style={{ background: "linear-gradient(135deg, rgba(201,168,76,0.12), rgba(201,168,76,0.04))", border: "1px solid rgba(201,168,76,0.25)", borderRadius: "16px", padding: "clamp(32px, 5vw, 60px)", textAlign: "center" }}>
              <h2 style={{ fontFamily: "var(--font-playfair), Georgia, serif", fontSize: "clamp(28px, 3.5vw, 42px)", fontWeight: 700, color: "#f5f0e8", marginBottom: "16px" }}>
                Can't afford to miss out
              </h2>
              <p style={{ color: "#aaa", fontSize: "16px", marginBottom: "32px", maxWidth: "500px", margin: "0 auto 32px" }}>
                Tickets are selling fast. Enter today for your chance to win a life-changing prize.
              </p>
              <Link href="#competitions">
                <button className="btn-gold" style={{ fontSize: "16px", padding: "16px 40px" }}>
                  Browse Competitions
                </button>
              </Link>
            </div>
          </div>
        </section>
      </Layout>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async () => {
  const [competitions, winners] = await Promise.all([
    prisma.competition.findMany({
      where: { status: "active" },
      orderBy: { drawDate: "asc" },
    }),
    prisma.winner.findMany({
      take: 6,
      orderBy: { announcedAt: "desc" },
      include: {
        competition: {
          select: { title: true, prizeValue: true, imageUrl: true },
        },
      },
    }),
  ]);

  return {
    props: {
      competitions: competitions.map((c) => ({
        ...c,
        drawDate: c.drawDate.toISOString(),
        createdAt: c.createdAt.toISOString(),
      })),
      winners: winners.map((w) => ({
        ...w,
        announcedAt: w.announcedAt.toISOString(),
      })),
      siteName: process.env.NEXT_PUBLIC_SITE_NAME || "LuxRaffle",
    },
  };
};
