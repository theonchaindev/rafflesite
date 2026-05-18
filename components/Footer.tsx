import Link from "next/link";
import { Trophy, Mail, Phone } from "lucide-react";

export default function Footer() {
  const siteName = process.env.NEXT_PUBLIC_SITE_NAME || "LuxRaffle";

  return (
    <footer style={{ background: "#080808", borderTop: "1px solid rgba(201,168,76,0.15)", marginTop: "80px" }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <Trophy size={22} style={{ color: "#c9a84c" }} />
              <span style={{ fontFamily: "var(--font-playfair), Georgia, serif", fontSize: "20px", fontWeight: 700, color: "#c9a84c" }}>
                {siteName}
              </span>
            </div>
            <p style={{ color: "#666", fontSize: "14px", lineHeight: "1.7", maxWidth: "300px" }}>
              Premium competitions with life-changing prizes. All competitions are run in full compliance with UK competition law.
            </p>
            <div className="flex flex-col gap-2 mt-6">
              <div className="flex items-center gap-2" style={{ color: "#666", fontSize: "13px" }}>
                <Mail size={14} style={{ color: "#c9a84c" }} />
                <span>hello@luxraffle.co.uk</span>
              </div>
              <div className="flex items-center gap-2" style={{ color: "#666", fontSize: "13px" }}>
                <Phone size={14} style={{ color: "#c9a84c" }} />
                <span>0800 000 0000</span>
              </div>
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h4 style={{ color: "#c9a84c", fontSize: "13px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "1px", marginBottom: "16px" }}>
              Quick Links
            </h4>
            <ul className="flex flex-col gap-3">
              {[
                { href: "/", label: "Home" },
                { href: "/#competitions", label: "Competitions" },
                { href: "/#winners", label: "Winners" },
                { href: "/basket", label: "My Basket" },
              ].map((l) => (
                <li key={l.href}>
                  <Link href={l.href} style={{ color: "#888", fontSize: "14px", transition: "color 0.2s" }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = "#c9a84c")}
                    onMouseLeave={(e) => (e.currentTarget.style.color = "#888")}>
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 style={{ color: "#c9a84c", fontSize: "13px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "1px", marginBottom: "16px" }}>
              Legal
            </h4>
            <ul className="flex flex-col gap-3">
              {[
                { href: "/terms", label: "Terms & Conditions" },
                { href: "/postal-entry", label: "Free Postal Entry" },
                { href: "/faq", label: "FAQ" },
              ].map((l) => (
                <li key={l.href}>
                  <Link href={l.href} style={{ color: "#888", fontSize: "14px", transition: "color 0.2s" }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = "#c9a84c")}
                    onMouseLeave={(e) => (e.currentTarget.style.color = "#888")}>
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Compliance notice */}
        <div style={{ borderTop: "1px solid #1a1a1a", marginTop: "40px", paddingTop: "24px" }}>
          <div style={{ background: "rgba(201,168,76,0.05)", border: "1px solid rgba(201,168,76,0.15)", borderRadius: "8px", padding: "16px 20px", marginBottom: "20px" }}>
            <p style={{ color: "#888", fontSize: "12px", lineHeight: "1.6" }}>
              <strong style={{ color: "#c9a84c" }}>Free Postal Entry:</strong> No purchase necessary. To enter without purchasing, send your full name, email address, phone number, and the competition name on a postcard to: [YOUR BUSINESS ADDRESS]. One postal entry per person per competition. See our{" "}
              <Link href="/postal-entry" style={{ color: "#c9a84c" }}>postal entry page</Link> for full details.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <p style={{ color: "#555", fontSize: "12px" }}>
              © {new Date().getFullYear()} {siteName}. All rights reserved. 18+ only. Please gamble responsibly.
            </p>
            <p style={{ color: "#555", fontSize: "12px" }}>
              Operated in accordance with UK competition law.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
