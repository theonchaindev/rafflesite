import type { GetServerSideProps } from "next";
import Head from "next/head";
import { Trophy } from "lucide-react";
import AdminLayout from "@/components/admin/AdminLayout";
import { getWinners, type Winner } from "@/data/competitions";
import { verifyAdminToken } from "@/lib/auth";

export default function AdminWinnersPage({ winners }: { winners: Winner[] }) {
  return (
    <>
      <Head><title>Winners — Admin</title></Head>
      <AdminLayout>
        <div style={{ marginBottom: "28px" }}>
          <h1 style={{ fontFamily: "var(--font-playfair), Georgia, serif", fontSize: "28px", fontWeight: 700, color: "#f5f0e8" }}>Winners</h1>
          <p style={{ color: "#666", fontSize: "14px", marginTop: "4px" }}>Manage winners in <code style={{ background: "#1a1a1a", padding: "2px 6px", borderRadius: "4px", color: "#c9a84c", fontSize: "12px" }}>data/competitions.ts</code></p>
        </div>

        <div style={{ background: "#111", border: "1px solid #1a1a1a", borderRadius: "10px", overflow: "hidden" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "#0d0d0d" }}>
                {["Winner", "Competition", "Prize Value", "Announced"].map((h) => (
                  <th key={h} style={{ padding: "12px 16px", textAlign: "left", color: "#666", fontSize: "12px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.5px" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {winners.map((w) => (
                <tr key={w.id} style={{ borderTop: "1px solid #1a1a1a" }}>
                  <td style={{ padding: "14px 16px", color: "#f5f0e8", fontSize: "14px", fontWeight: 600 }}>{w.winnerName}</td>
                  <td style={{ padding: "14px 16px", color: "#888", fontSize: "13px" }}>{w.competitionTitle}</td>
                  <td style={{ padding: "14px 16px", color: "#c9a84c", fontSize: "14px", fontWeight: 700 }}>£{w.prizeValue.toLocaleString()}</td>
                  <td style={{ padding: "14px 16px", color: "#666", fontSize: "13px" }}>{new Date(w.announcedAt).toLocaleDateString("en-GB")}</td>
                </tr>
              ))}
              {winners.length === 0 && (
                <tr><td colSpan={4} style={{ padding: "40px", textAlign: "center", color: "#555" }}>
                  <Trophy size={32} style={{ color: "rgba(201,168,76,0.2)", margin: "0 auto 12px" }} />
                  No winners yet — add them to data/competitions.ts
                </td></tr>
              )}
            </tbody>
          </table>
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
  return { props: { winners: getWinners() } };
};
