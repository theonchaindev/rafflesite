import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import { ShoppingCart, Menu, X, Trophy } from "lucide-react";
import { useCart } from "@/context/CartContext";

export default function Navbar() {
  const { itemCount } = useCart();
  const [mobileOpen, setMobileOpen] = useState(false);
  const router = useRouter();

  const links = [
    { href: "/", label: "Home" },
    { href: "/#competitions", label: "Competitions" },
    { href: "/#winners", label: "Winners" },
    { href: "/faq", label: "FAQ" },
    { href: "/postal-entry", label: "Postal Entry" },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50" style={{ background: "rgba(13,13,13,0.95)", backdropFilter: "blur(12px)", borderBottom: "1px solid rgba(201,168,76,0.15)" }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <Trophy size={24} className="text-gold" style={{ color: "#c9a84c" }} />
            <span style={{ fontFamily: "var(--font-playfair), Georgia, serif", fontSize: "22px", fontWeight: 700, color: "#c9a84c", letterSpacing: "0.5px" }}>
              {process.env.NEXT_PUBLIC_SITE_NAME || "LuxRaffle"}
            </span>
          </Link>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-6">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                style={{ color: router.pathname === l.href ? "#c9a84c" : "#aaa", fontSize: "14px", fontWeight: 500, transition: "color 0.2s" }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "#c9a84c")}
                onMouseLeave={(e) => (e.currentTarget.style.color = router.pathname === l.href ? "#c9a84c" : "#aaa")}
              >
                {l.label}
              </Link>
            ))}
          </div>

          {/* Cart + Mobile toggle */}
          <div className="flex items-center gap-3">
            <Link href="/basket" style={{ position: "relative", display: "flex", alignItems: "center", justifyContent: "center", width: "40px", height: "40px", borderRadius: "8px", background: "rgba(201,168,76,0.1)", border: "1px solid rgba(201,168,76,0.2)", color: "#c9a84c", transition: "background 0.2s" }}>
              <ShoppingCart size={18} />
              {itemCount > 0 && (
                <span style={{ position: "absolute", top: "-6px", right: "-6px", background: "#c9a84c", color: "#0d0d0d", borderRadius: "50%", width: "18px", height: "18px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "11px", fontWeight: 700 }}>
                  {itemCount > 99 ? "99+" : itemCount}
                </span>
              )}
            </Link>
            <button
              className="md:hidden"
              onClick={() => setMobileOpen(!mobileOpen)}
              style={{ color: "#c9a84c", background: "none", border: "none", cursor: "pointer", padding: "4px" }}
            >
              {mobileOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div style={{ background: "#111", borderTop: "1px solid rgba(201,168,76,0.15)", padding: "16px" }}>
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setMobileOpen(false)}
              style={{ display: "block", padding: "12px 16px", color: "#f5f0e8", fontSize: "15px", borderRadius: "8px", marginBottom: "4px" }}
            >
              {l.label}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
}
