import type { GetServerSideProps } from "next";
import Head from "next/head";
import { Info, Ticket } from "lucide-react";
import AdminLayout from "@/components/admin/AdminLayout";
import { getCompetitions, type Competition } from "@/data/competitions";
import { verifyAdminToken } from "@/lib/auth";
import CountdownTimer from "@/components/CountdownTimer";

export default function AdminCompetitionsPage({ competitions }: { competitions: Competition[] }) {
  return (
    <>
      <Head><title>Competitions — Admin</title></Head>
      <AdminLayout>
        <div style={{ marginBottom: "28px" }}>
          <h1 style={{ fontFamily: "var(--font-playfair), Georgia, serif", fontSize: "28px", fontWeight: 700, color: "#f5f0e8" }}>Competitions</h1>
          <p style={{ color: "#666", fontSize: "14px", marginTop: "4px" }}>{competitions.length} active competitions</p>
        </div>

        <div style={{ background: "rgba(201,168,76,0.05)", border: "1px solid rgba(201,168,76,0.2)", borderRadius: "10px", padding: "16px 20px", marginBottom: "24px", display: "flex", gap: "12px", alignItems: "flex-start" }}>
          <Info size={18} style={{ color: "#c9a84c", flexShrink: 0, marginTop: "2px" }} />
          <p style={{ color: "#aaa", fontSize: "14px", lineHeight: "1.6" }}>
            To add, edit, or remove competitions, update <code style={{ background: "#1a1a1a", padding: "2px 6px", borderRadius: "4px", color: "#c9a84c", fontSize: "12px" }}>data/competitions.ts</code> and redeploy.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {competitions.map((c) => {
            const remaining = c.maxTickets - c.ticketsSold;
            const soldPercent = Math.round((c.ticketsSold / c.maxTickets) * 100);
            return (
              <div key={c.id} style={{ background: "#111", border: "1px solid #1a1a1a", borderRadius: "10px", padding: "20px" }}>
                <div className="flex justify-between items-start" style={{ marginBottom: "12px" }}>
                  <div>
                    <h3 style={{ color: "#f5f0e8", fontWeight: 600, fontSize: "15px", marginBottom: "4px" }}>{c.title}</h3>
                    <span style={{ color: "#666", fontSize: "12px" }}>/{c.slug}</span>
                  </div>
                  <span style={{ padding: "3px 10px", borderRadius: "100px", fontSize: "12px", fontWeight: 600, background: "rgba(39,174,96,0.15)", color: "#27ae60", border: "1px solid rgba(39,174,96,0.3)" }}>
                    {c.status}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-3" style={{ marginBottom: "12px" }}>
                  <div style={{ background: "#0d0d0d", borderRadius: "6px", padding: "10px 12px" }}>
                    <div style={{ color: "#666", fontSize: "11px", marginBottom: "3px" }}>Ticket Price</div>
                    <div style={{ color: "#c9a84c", fontSize: "16px", fontWeight: 700 }}>£{c.ticketPrice.toFixed(2)}</div>
                  </div>
                  <div style={{ background: "#0d0d0d", borderRadius: "6px", padding: "10px 12px" }}>
                    <div style={{ color: "#666", fontSize: "11px", marginBottom: "3px" }}>Prize Value</div>
                    <div style={{ color: "#f5f0e8", fontSize: "16px", fontWeight: 700 }}>£{c.prizeValue.toLocaleString()}</div>
                  </div>
                </div>
                <div className="progress-bar" style={{ marginBottom: "6px" }}>
                  <div className="progress-bar-fill" style={{ width: `${soldPercent}%` }} />
                </div>
                <div className="flex justify-between" style={{ marginBottom: "10px" }}>
                  <span style={{ color: "#666", fontSize: "12px" }}><Ticket size={11} style={{ display: "inline", marginRight: "4px" }} />{c.ticketsSold.toLocaleString()} sold</span>
                  <span style={{ color: "#888", fontSize: "12px" }}>{remaining.toLocaleString()} left of {c.maxTickets.toLocaleString()}</span>
                </div>
                <div style={{ color: "#666", fontSize: "12px" }}>
                  Draw: <CountdownTimer drawDate={c.drawDate} compact />
                </div>
              </div>
            );
          })}
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

  return { props: { competitions: getCompetitions() } };
};
