import type { GetServerSideProps } from "next";
import Head from "next/head";
import AdminLayout from "@/components/admin/AdminLayout";
import prisma from "@/lib/prisma";
import { verifyAdminToken } from "@/lib/auth";

interface Order {
  id: string;
  customerName: string;
  email: string;
  phone: string;
  total: number;
  status: string;
  createdAt: string;
  ticketCount: number;
  competitions: string[];
}

export default function AdminOrdersPage({ orders }: { orders: Order[] }) {
  return (
    <>
      <Head><title>Orders — Admin</title></Head>
      <AdminLayout>
        <div style={{ marginBottom: "28px" }}>
          <h1 style={{ fontFamily: "var(--font-playfair), Georgia, serif", fontSize: "28px", fontWeight: 700, color: "#f5f0e8" }}>Orders</h1>
          <p style={{ color: "#666", fontSize: "14px", marginTop: "4px" }}>{orders.length} orders</p>
        </div>

        <div style={{ background: "#111", border: "1px solid #1a1a1a", borderRadius: "10px", overflow: "hidden" }}>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ background: "#0d0d0d" }}>
                  {["Order", "Customer", "Contact", "Competitions", "Tickets", "Amount", "Status", "Date"].map((h) => (
                    <th key={h} style={{ padding: "12px 16px", textAlign: "left", color: "#666", fontSize: "12px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.5px", whiteSpace: "nowrap" }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {orders.map((o) => (
                  <tr key={o.id} style={{ borderTop: "1px solid #1a1a1a" }}>
                    <td style={{ padding: "14px 16px", color: "#c9a84c", fontSize: "13px", fontWeight: 600, whiteSpace: "nowrap" }}>
                      #{o.id.slice(-6).toUpperCase()}
                    </td>
                    <td style={{ padding: "14px 16px" }}>
                      <div style={{ color: "#f5f0e8", fontSize: "14px", whiteSpace: "nowrap" }}>{o.customerName}</div>
                    </td>
                    <td style={{ padding: "14px 16px" }}>
                      <div style={{ color: "#888", fontSize: "13px" }}>{o.email}</div>
                      <div style={{ color: "#666", fontSize: "12px" }}>{o.phone}</div>
                    </td>
                    <td style={{ padding: "14px 16px", color: "#888", fontSize: "13px", maxWidth: "180px" }}>
                      {o.competitions.join(", ")}
                    </td>
                    <td style={{ padding: "14px 16px", color: "#f5f0e8", fontSize: "14px", textAlign: "center" }}>
                      {o.ticketCount}
                    </td>
                    <td style={{ padding: "14px 16px", color: "#f5f0e8", fontSize: "14px", fontWeight: 600, whiteSpace: "nowrap" }}>
                      £{o.total.toFixed(2)}
                    </td>
                    <td style={{ padding: "14px 16px" }}>
                      <span style={{ padding: "3px 10px", borderRadius: "100px", fontSize: "12px", fontWeight: 600, whiteSpace: "nowrap", background: o.status === "paid" ? "rgba(39,174,96,0.15)" : o.status === "pending" ? "rgba(255,165,0,0.15)" : "rgba(231,76,60,0.15)", color: o.status === "paid" ? "#27ae60" : o.status === "pending" ? "orange" : "#e74c3c", border: `1px solid ${o.status === "paid" ? "rgba(39,174,96,0.3)" : o.status === "pending" ? "rgba(255,165,0,0.3)" : "rgba(231,76,60,0.3)"}` }}>
                        {o.status}
                      </span>
                    </td>
                    <td style={{ padding: "14px 16px", color: "#666", fontSize: "13px", whiteSpace: "nowrap" }}>
                      {new Date(o.createdAt).toLocaleDateString("en-GB")}
                    </td>
                  </tr>
                ))}
                {orders.length === 0 && (
                  <tr><td colSpan={8} style={{ padding: "40px", textAlign: "center", color: "#555" }}>No orders yet</td></tr>
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

  const orders = await prisma.order.findMany({
    orderBy: { createdAt: "desc" },
    include: { tickets: { include: { competition: { select: { title: true } } } } },
  });

  return {
    props: {
      orders: orders.map((o) => ({
        id: o.id,
        customerName: o.customerName,
        email: o.email,
        phone: o.phone,
        total: o.total,
        status: o.status,
        createdAt: o.createdAt.toISOString(),
        ticketCount: o.tickets.length,
        competitions: [...new Set(o.tickets.map((t) => t.competition.title))],
      })),
    },
  };
};
