import Link from "next/link";
import { useRouter } from "next/router";
import { LayoutDashboard, Trophy, ShoppingBag, LogOut, Medal } from "lucide-react";

const navItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/competitions", label: "Competitions", icon: Trophy },
  { href: "/admin/orders", label: "Orders", icon: ShoppingBag },
  { href: "/admin/winners", label: "Winners", icon: Medal },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
  }

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#0a0a0a" }}>
      {/* Sidebar */}
      <aside style={{ width: "240px", background: "#111", borderRight: "1px solid #1a1a1a", display: "flex", flexDirection: "column", flexShrink: 0 }}>
        <div style={{ padding: "24px 20px", borderBottom: "1px solid #1a1a1a" }}>
          <span style={{ fontFamily: "var(--font-playfair), Georgia, serif", fontSize: "18px", fontWeight: 700, color: "#c9a84c" }}>
            LuxRaffle Admin
          </span>
        </div>

        <nav style={{ flex: 1, padding: "16px 12px" }}>
          {navItems.map(({ href, label, icon: Icon }) => {
            const active = router.pathname === href || (href !== "/admin" && router.pathname.startsWith(href));
            return (
              <Link key={href} href={href}>
                <div
                  style={{
                    display: "flex", alignItems: "center", gap: "10px",
                    padding: "10px 12px", borderRadius: "8px", marginBottom: "4px",
                    background: active ? "rgba(201,168,76,0.12)" : "transparent",
                    color: active ? "#c9a84c" : "#888",
                    fontSize: "14px", fontWeight: active ? 600 : 400,
                    cursor: "pointer", transition: "all 0.15s",
                  }}
                  onMouseEnter={(e) => { if (!active) { (e.currentTarget as HTMLDivElement).style.background = "rgba(255,255,255,0.04)"; (e.currentTarget as HTMLDivElement).style.color = "#f5f0e8"; } }}
                  onMouseLeave={(e) => { if (!active) { (e.currentTarget as HTMLDivElement).style.background = "transparent"; (e.currentTarget as HTMLDivElement).style.color = "#888"; } }}
                >
                  <Icon size={16} />
                  {label}
                </div>
              </Link>
            );
          })}
        </nav>

        <div style={{ padding: "16px 12px", borderTop: "1px solid #1a1a1a" }}>
          <button
            onClick={handleLogout}
            style={{ display: "flex", alignItems: "center", gap: "10px", padding: "10px 12px", borderRadius: "8px", color: "#666", background: "none", border: "none", cursor: "pointer", fontSize: "14px", width: "100%", transition: "color 0.15s" }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "#e74c3c")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "#666")}
          >
            <LogOut size={16} /> Logout
          </button>
        </div>
      </aside>

      {/* Main */}
      <main style={{ flex: 1, padding: "32px", overflowY: "auto" }}>
        {children}
      </main>
    </div>
  );
}
