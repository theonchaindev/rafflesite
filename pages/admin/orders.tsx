import type { GetServerSideProps } from "next";
import Head from "next/head";
import { ExternalLink } from "lucide-react";
import AdminLayout from "@/components/admin/AdminLayout";
import { verifyAdminToken } from "@/lib/auth";

export default function AdminOrdersPage() {
  return (
    <>
      <Head><title>Orders — Admin</title></Head>
      <AdminLayout>
        <div style={{ marginBottom: "28px" }}>
          <h1 style={{ fontFamily: "var(--font-playfair), Georgia, serif", fontSize: "28px", fontWeight: 700, color: "#f5f0e8" }}>Orders</h1>
        </div>

        <div className="glass-card" style={{ padding: "40px", textAlign: "center" }}>
          <div style={{ marginBottom: "20px" }}>
            <ExternalLink size={40} style={{ color: "rgba(201,168,76,0.4)", margin: "0 auto 16px" }} />
            <h2 style={{ fontFamily: "var(--font-playfair), Georgia, serif", fontSize: "22px", color: "#f5f0e8", marginBottom: "12px" }}>
              Orders are in Stripe
            </h2>
            <p style={{ color: "#888", fontSize: "15px", lineHeight: "1.7", maxWidth: "480px", margin: "0 auto 24px" }}>
              In database-free mode, all order and customer data is stored directly in Stripe payment intents (including customer details and ticket numbers in the metadata).
            </p>
            <a href="https://dashboard.stripe.com/payments" target="_blank" rel="noopener noreferrer">
              <button className="btn-gold" style={{ display: "inline-flex", alignItems: "center", gap: "8px" }}>
                <ExternalLink size={16} /> View Orders in Stripe Dashboard
              </button>
            </a>
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
  return { props: {} };
};
