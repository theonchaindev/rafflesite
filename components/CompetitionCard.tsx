import Link from "next/link";
import Image from "next/image";
import { Ticket, Clock } from "lucide-react";
import CountdownTimer from "./CountdownTimer";

interface Props {
  id: string;
  title: string;
  slug: string;
  description: string;
  prizeValue: number;
  ticketPrice: number;
  maxTickets: number;
  ticketsSold: number;
  drawDate: string;
  imageUrl?: string | null;
}

export default function CompetitionCard({
  title,
  slug,
  description,
  prizeValue,
  ticketPrice,
  maxTickets,
  ticketsSold,
  drawDate,
  imageUrl,
}: Props) {
  const remaining = maxTickets - ticketsSold;
  const soldPercent = Math.round((ticketsSold / maxTickets) * 100);

  return (
    <div
      className="glass-card overflow-hidden group"
      style={{ transition: "transform 0.2s, box-shadow 0.2s" }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLDivElement).style.transform = "translateY(-4px)";
        (e.currentTarget as HTMLDivElement).style.boxShadow = "0 20px 60px rgba(201,168,76,0.12)";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLDivElement).style.transform = "translateY(0)";
        (e.currentTarget as HTMLDivElement).style.boxShadow = "none";
      }}
    >
      {/* Image */}
      <div style={{ position: "relative", height: "220px", background: "#111", overflow: "hidden" }}>
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={title}
            fill
            style={{ objectFit: "cover", transition: "transform 0.4s" }}
            className="group-hover:scale-105"
          />
        ) : (
          <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", background: "linear-gradient(135deg, #1a1a1a, #2a2010)" }}>
            <Ticket size={48} style={{ color: "rgba(201,168,76,0.3)" }} />
          </div>
        )}
        {/* Prize value badge */}
        <div style={{ position: "absolute", top: "12px", right: "12px", background: "rgba(13,13,13,0.85)", border: "1px solid rgba(201,168,76,0.4)", borderRadius: "6px", padding: "4px 10px" }}>
          <span style={{ color: "#c9a84c", fontSize: "13px", fontWeight: 700 }}>
            Prize: £{prizeValue.toLocaleString()}
          </span>
        </div>
      </div>

      {/* Content */}
      <div style={{ padding: "20px" }}>
        <h3 style={{ fontFamily: "var(--font-playfair), Georgia, serif", fontSize: "18px", fontWeight: 700, color: "#f5f0e8", marginBottom: "6px", lineHeight: "1.3" }}>
          {title}
        </h3>
        <p style={{ color: "#888", fontSize: "13px", lineHeight: "1.5", marginBottom: "16px", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
          {description}
        </p>

        {/* Ticket price + remaining */}
        <div className="flex items-center justify-between" style={{ marginBottom: "10px" }}>
          <span style={{ color: "#c9a84c", fontSize: "20px", fontWeight: 700 }}>
            £{ticketPrice.toFixed(2)}
            <span style={{ color: "#666", fontSize: "13px", fontWeight: 400 }}> / ticket</span>
          </span>
          <div className="flex items-center gap-1" style={{ color: "#888", fontSize: "12px" }}>
            <Ticket size={12} style={{ color: "#c9a84c" }} />
            <span>{remaining.toLocaleString()} left</span>
          </div>
        </div>

        {/* Progress bar */}
        <div className="progress-bar" style={{ marginBottom: "10px" }}>
          <div
            className="progress-bar-fill"
            style={{ width: `${soldPercent}%` }}
          />
        </div>
        <div className="flex justify-between" style={{ marginBottom: "16px" }}>
          <span style={{ color: "#666", fontSize: "11px" }}>{ticketsSold.toLocaleString()} sold</span>
          <span style={{ color: "#666", fontSize: "11px" }}>{maxTickets.toLocaleString()} total</span>
        </div>

        {/* Countdown */}
        <div className="flex items-center gap-2" style={{ marginBottom: "16px" }}>
          <Clock size={13} style={{ color: "#c9a84c", flexShrink: 0 }} />
          <CountdownTimer drawDate={drawDate} compact />
        </div>

        {/* CTA */}
        <Link href={`/competitions/${slug}`}>
          <button className="btn-gold" style={{ width: "100%" }}>
            Enter Now
          </button>
        </Link>
      </div>
    </div>
  );
}
