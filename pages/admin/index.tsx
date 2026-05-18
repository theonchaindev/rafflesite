import type { GetServerSideProps } from "next";
import Head from "next/head";
import { Trophy, ShoppingBag, DollarSign, Info } from "lucide-react";
import AdminLayout from "@/components/admin/AdminLayout";
import { getCompetitions, getWinners } from "@/data/competitions";
import { verifyAdminToken } from "@/lib/auth";

export default function AdminDashboard({ competitionCount, winnerCount }: { competitionCount: number; winnerCount: number }) {
  return (
    <>
      <Head><title>Dashboard — Admin</title></Head>
      <AdminLayout>
        <div style={{ marginBottom: "28px" }}>
          <h1 style={{ fontFamily: "var(--font-playfair), Georgia, serif", fontSize: "28px", fontWeight: 700, color: "#f5f0e8" }}>Dashboard</h1>
          <p style={{ color: "#666", fontSize: "14px", marginTop: "4px" }}>Overview of your competition platform</p>
        </div>

        <div style={{ background: "rgba(201,168,76,0.05)", border: "1px solid rgba(201,168,76,0.2)", borderRadius: "10px", padding: "16px 20px", marginBottom: "28px", display: "flex", gap: "12px", alignItems: "flex-start" }}>
          <Info size={18} style={{ color: "#c9a84c", flexShrink: 0, marginTop: "2px" }} />
          <p style={{ color: "#aaa", fontSize: "14px", lineHeight: "1.6" }}>
            This site is running in <strong style={{ color: "#c9a84c" }}>database-free mode</strong>. Competitions are managed by editing <code style={{ background: "#1a1a1a", padding: "2px 6px", borderRadius: "4px", color: "#c9a84c", fontSize: "12px" }}>data/competitions.ts</code>. Orders and payment data are stored in Stripe.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5" style={{ marginBottom: "32px" }}>
          {[
            { label: "Active Competitions", value: competitionCount, icon: Trophy, color: "#c9a84c" },
            { label: "Past Winners", value: winnerCount, icon: DollarSign, color: "#27ae60" },
            { label: "Payment Provider", value: "Stripe", icon: ShoppingBag, color: "#3498db" },
          ].map(({ label, value, icon: Icon, color }) => (
            <div key={label} style={{ background: "#111", border: "1px solid #1a1a1a", borderRadius: "10px", padding: "20px 24px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div>
                  <p style={{ color: "#666", fontSize: "13px", marginBottom: "6px" }}>{label}</p>
                  <p style={{ color: "#f5f0e8", fontSize: "28px", fontWeight: 700 }}>{value}</p>
                </div>
                <div style={{ background: `${color}18`, border: `1px solid ${color}33`, borderRadius: "8px", padding: "10px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Icon size={20} style={{ color }} />
                </div>
              </div>
            </div>
          ))}
        </div>

        <div style={{ background: "#111", border: "1px solid #1a1a1a", borderRadius: "10px", padding: "24px" }}>
          <h2 style={{ color: "#f5f0e8", fontSize: "16px", fontWeight: 600, marginBottom: "16px" }}>Managing Competitions</h2>
          <p style={{ color: "#888", fontSize: "14px", lineHeight: "1.7", marginBottom: "16px" }}>
            To add or edit competitions, update the <code style={{ background: "#1a1a1a", padding: "2px 6px", borderRadius: "4px", color: "#c9a84c" }}>data/competitions.ts</code> file and redeploy. Each competition needs a unique <code style={{ background: "#1a1a1a", padding: "2px 6px", borderRadius: "4px", color: "#c9a84c" }}>id</code> and <code style={{ background: "#1a1a1a", padding: "2px 6px", borderRadius: "4px", color: "#c9a84c" }}>slug</code>.
          </p>
          <p style={{ color: "#888", fontSize: "14px", lineHeight: "1.7" }}>
            To view orders and payment data, log in to your{" "}
            <a href="https://dashboard.stripe.com/payments" target="_blank" rel="noopener noreferrer" style={{ color: "#c9a84c" }}>Stripe Dashboard</a>. Customer details and ticket metadata are stored in each payment intent.
          </p>
        </div>
      </AdminLayout>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  const token = (req as any).cookies?.admin_token;
  if (!token) return { redirect: { destination: "/admin/login", permanent: false } };
  const session = await verifyAdminToken(token);
  if (!session) return { redirect: { destination: "/admin/login", permanent: false } };

  return {
    props: {
      competitionCount: getCompetitions().length,
      winnerCount: getWinners().length,
    },
  };
};
