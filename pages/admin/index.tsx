import type { GetServerSideProps } from "next";
import Head from "next/head";
import { DollarSign, Trophy, ShoppingBag, Users } from "lucide-react";
import AdminLayout from "@/components/admin/AdminLayout";
import prisma from "@/lib/prisma";
import { verifyAdminToken } from "@/lib/auth";

interface DashboardProps {
  totalRevenue: number;
  activeCompetitions: number;
  totalOrders: number;
  recentOrders: Array<{
    id: string;
    customerName: string;
    email: string;
    total: number;
    status: string;
    createdAt: string;
    competitionTitles: string[];
  }>;
}

export default function AdminDashboard({ totalRevenue, activeCompetitions, totalOrders, recentOrders }: DashboardProps) {
  const stats = [
    { label: "Total Revenue", value: `£${totalRevenue.toFixed(2)}`, icon: DollarSign, color: "#27ae60" },
    { label: "Active Competitions", value: activeCompetitions, icon: Trophy, color: "#c9a84c" },
    { label: "Total Orders", value: totalOrders, icon: ShoppingBag, color: "#3498db" },
    { label: "Paid Orders", value: recentOrders.filter((o) => o.status === "paid").length, icon: Users, color: "#9b59b6" },
  ];

  return (
    <>
      <Head><title>Dashboard — Admin</title></Head>
      <AdminLayout>
        <div style={{ marginBottom: "28px" }}>
          <h1 style={{ fontFamily: "var(--font-playfair), Georgia, serif", fontSize: "28px", fontWeight: 700, color: "#f5f0e8" }}>
            Dashboard
          </h1>
          <p style={{ color: "#666", fontSize: "14px", marginTop: "4px" }}>Overview of your competition platform</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5" style={{ marginBottom: "32px" }}>
          {stats.map(({ label, value, icon: Icon, color }) => (
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

        {/* Recent orders */}
        <div style={{ background: "#111", border: "1px solid #1a1a1a", borderRadius: "10px", overflow: "hidden" }}>
          <div style={{ padding: "20px 24px", borderBottom: "1px solid #1a1a1a" }}>
            <h2 style={{ color: "#f5f0e8", fontSize: "16px", fontWeight: 600 }}>Recent Orders</h2>
          </div>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ background: "#0d0d0d" }}>
                  {["Order", "Customer", "Competitions", "Amount", "Status", "Date"].map((h) => (
                    <th key={h} style={{ padding: "12px 16px", textAlign: "left", color: "#666", fontSize: "12px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.5px" }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order) => (
                  <tr key={order.id} style={{ borderTop: "1px solid #1a1a1a" }}>
                    <td style={{ padding: "14px 16px", color: "#c9a84c", fontSize: "13px", fontWeight: 600 }}>
                      #{order.id.slice(-6).toUpperCase()}
                    </td>
                    <td style={{ padding: "14px 16px" }}>
                      <div style={{ color: "#f5f0e8", fontSize: "14px" }}>{order.customerName}</div>
                      <div style={{ color: "#666", fontSize: "12px" }}>{order.email}</div>
                    </td>
                    <td style={{ padding: "14px 16px", color: "#888", fontSize: "13px", maxWidth: "200px" }}>
                      {order.competitionTitles.join(", ")}
                    </td>
                    <td style={{ padding: "14px 16px", color: "#f5f0e8", fontSize: "14px", fontWeight: 600 }}>
                      £{order.total.toFixed(2)}
                    </td>
                    <td style={{ padding: "14px 16px" }}>
                      <span style={{ padding: "3px 10px", borderRadius: "100px", fontSize: "12px", fontWeight: 600, background: order.status === "paid" ? "rgba(39,174,96,0.15)" : "rgba(231,76,60,0.15)", color: order.status === "paid" ? "#27ae60" : "#e74c3c", border: `1px solid ${order.status === "paid" ? "rgba(39,174,96,0.3)" : "rgba(231,76,60,0.3)"}` }}>
                        {order.status}
                      </span>
                    </td>
                    <td style={{ padding: "14px 16px", color: "#666", fontSize: "13px" }}>
                      {new Date(order.createdAt).toLocaleDateString("en-GB")}
                    </td>
                  </tr>
                ))}
                {recentOrders.length === 0 && (
                  <tr>
                    <td colSpan={6} style={{ padding: "40px", textAlign: "center", color: "#555" }}>No orders yet</td>
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

  const [orders, competitionCount, revenue] = await Promise.all([
    prisma.order.findMany({
      take: 20,
      orderBy: { createdAt: "desc" },
      include: { tickets: { include: { competition: { select: { title: true } } } } },
    }),
    prisma.competition.count({ where: { status: "active" } }),
    prisma.order.aggregate({ where: { status: "paid" }, _sum: { total: true } }),
  ]);

  return {
    props: {
      totalRevenue: revenue._sum.total ?? 0,
      activeCompetitions: competitionCount,
      totalOrders: await prisma.order.count(),
      recentOrders: orders.map((o) => ({
        id: o.id,
        customerName: o.customerName,
        email: o.email,
        total: o.total,
        status: o.status,
        createdAt: o.createdAt.toISOString(),
        competitionTitles: [...new Set(o.tickets.map((t) => t.competition.title))],
      })),
    },
  };
};
