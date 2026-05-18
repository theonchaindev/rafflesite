import type { GetServerSideProps } from "next";
import Head from "next/head";
import { Medal } from "lucide-react";
import AdminLayout from "@/components/admin/AdminLayout";
import prisma from "@/lib/prisma";
import { verifyAdminToken } from "@/lib/auth";

interface WinnerRow {
  id: string;
  winnerName: string;
  winnerEmail: string;
  announcedAt: string;
  ticketId: string;
  competitionTitle: string;
  prizeValue: number;
}

export default function AdminWinnersPage({ winners }: { winners: WinnerRow[] }) {
  return (
    <>
      <Head><title>Winners — Admin</title></Head>
      <AdminLayout>
        <div style={{ marginBottom: "28px" }}>
          <h1 style={{ fontFamily: "var(--font-playfair), Georgia, serif", fontSize: "28px", fontWeight: 700, color: "#f5f0e8" }}>Winners</h1>
          <p style={{ color: "#666", fontSize: "14px", marginTop: "4px" }}>{winners.length} winners drawn</p>
        </div>

        <div style={{ background: "#111", border: "1px solid #1a1a1a", borderRadius: "10px", overflow: "hidden" }}>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ background: "#0d0d0d" }}>
                  {["Competition", "Prize Value", "Winner Name", "Winner Email", "Ticket ID", "Announced"].map((h) => (
                    <th key={h} style={{ padding: "12px 16px", textAlign: "left", color: "#666", fontSize: "12px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.5px", whiteSpace: "nowrap" }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {winners.map((w) => (
                  <tr key={w.id} style={{ borderTop: "1px solid #1a1a1a" }}>
                    <td style={{ padding: "14px 16px", color: "#f5f0e8", fontSize: "14px" }}>{w.competitionTitle}</td>
                    <td style={{ padding: "14px 16px", color: "#c9a84c", fontSize: "14px", fontWeight: 600 }}>£{w.prizeValue.toLocaleString()}</td>
                    <td style={{ padding: "14px 16px", color: "#f5f0e8", fontSize: "14px", fontWeight: 600 }}>{w.winnerName}</td>
                    <td style={{ padding: "14px 16px", color: "#888", fontSize: "13px" }}>{w.winnerEmail}</td>
                    <td style={{ padding: "14px 16px", color: "#666", fontSize: "12px" }}>{w.ticketId.slice(-8)}</td>
                    <td style={{ padding: "14px 16px", color: "#666", fontSize: "13px", whiteSpace: "nowrap" }}>
                      {new Date(w.announcedAt).toLocaleDateString("en-GB")}
                    </td>
                  </tr>
                ))}
                {winners.length === 0 && (
                  <tr>
                    <td colSpan={6} style={{ padding: "40px", textAlign: "center", color: "#555" }}>
                      <Medal size={32} style={{ color: "rgba(201,168,76,0.2)", margin: "0 auto 12px" }} />
                      No winners drawn yet
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
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

  const winners = await prisma.winner.findMany({
    orderBy: { announcedAt: "desc" },
    include: { competition: { select: { title: true, prizeValue: true } } },
  });

  return {
    props: {
      winners: winners.map((w) => ({
        id: w.id,
        winnerName: w.winnerName,
        winnerEmail: w.winnerEmail,
        announcedAt: w.announcedAt.toISOString(),
        ticketId: w.ticketId,
        competitionTitle: w.competition.title,
        prizeValue: w.competition.prizeValue,
      })),
    },
  };
};
