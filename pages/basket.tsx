import Head from "next/head";
import Link from "next/link";
import Image from "next/image";
import { Minus, Plus, Trash2, ShoppingCart, ArrowRight, Ticket } from "lucide-react";
import Layout from "@/components/Layout";
import { useCart } from "@/context/CartContext";

export default function BasketPage() {
  const { items, updateQuantity, removeItem, total } = useCart();

  return (
    <>
      <Head>
        <title>Your Basket — LuxRaffle</title>
      </Head>
      <Layout>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h1 style={{ fontFamily: "var(--font-playfair), Georgia, serif", fontSize: "clamp(28px, 4vw, 42px)", fontWeight: 700, color: "#f5f0e8", marginBottom: "32px" }}>
            Your Basket
          </h1>

          {items.length === 0 ? (
            <div className="glass-card" style={{ padding: "80px 40px", textAlign: "center" }}>
              <ShoppingCart size={56} style={{ color: "rgba(201,168,76,0.3)", margin: "0 auto 20px" }} />
              <h2 style={{ fontFamily: "var(--font-playfair), Georgia, serif", fontSize: "24px", color: "#f5f0e8", marginBottom: "12px" }}>
                Your basket is empty
              </h2>
              <p style={{ color: "#888", marginBottom: "28px" }}>
                Browse our active competitions to enter.
              </p>
              <Link href="/#competitions">
                <button className="btn-gold">Browse Competitions</button>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Items */}
              <div className="lg:col-span-2 flex flex-col gap-4">
                {items.map((item) => {
                  const maxQty = Math.min(
                    item.maxPerOrder,
                    item.maxTickets - item.ticketsSold
                  );
                  return (
                    <div key={item.competitionId} className="glass-card" style={{ padding: "20px", display: "flex", gap: "16px", alignItems: "center" }}>
                      {/* Image */}
                      <div style={{ position: "relative", width: "80px", height: "80px", borderRadius: "8px", overflow: "hidden", flexShrink: 0, background: "#111" }}>
                        {item.imageUrl ? (
                          <Image src={item.imageUrl} alt={item.competitionTitle} fill style={{ objectFit: "cover" }} />
                        ) : (
                          <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                            <Ticket size={28} style={{ color: "rgba(201,168,76,0.3)" }} />
                          </div>
                        )}
                      </div>

                      {/* Info */}
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <Link href={`/competitions/${item.slug}`}>
                          <h3 style={{ color: "#f5f0e8", fontWeight: 600, fontSize: "15px", marginBottom: "4px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                            {item.competitionTitle}
                          </h3>
                        </Link>
                        <p style={{ color: "#888", fontSize: "13px" }}>
                          £{item.ticketPrice.toFixed(2)} per ticket
                        </p>
                      </div>

                      {/* Quantity controls */}
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => updateQuantity(item.competitionId, item.quantity - 1)}
                          style={{ width: "30px", height: "30px", background: "#1a1a1a", border: "1px solid #333", borderRadius: "6px", color: "#f5f0e8", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}
                        >
                          <Minus size={13} />
                        </button>
                        <span style={{ minWidth: "32px", textAlign: "center", fontWeight: 600, color: "#f5f0e8" }}>
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.competitionId, item.quantity + 1)}
                          disabled={item.quantity >= maxQty}
                          style={{ width: "30px", height: "30px", background: "#1a1a1a", border: "1px solid #333", borderRadius: "6px", color: "#f5f0e8", cursor: item.quantity >= maxQty ? "not-allowed" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", opacity: item.quantity >= maxQty ? 0.4 : 1 }}
                        >
                          <Plus size={13} />
                        </button>
                      </div>

                      {/* Subtotal */}
                      <div style={{ textAlign: "right", minWidth: "70px" }}>
                        <div style={{ color: "#c9a84c", fontWeight: 700, fontSize: "16px" }}>
                          £{(item.quantity * item.ticketPrice).toFixed(2)}
                        </div>
                      </div>

                      {/* Remove */}
                      <button
                        onClick={() => removeItem(item.competitionId)}
                        style={{ color: "#555", background: "none", border: "none", cursor: "pointer", padding: "4px", display: "flex", alignItems: "center", transition: "color 0.2s" }}
                        onMouseEnter={(e) => (e.currentTarget.style.color = "#e74c3c")}
                        onMouseLeave={(e) => (e.currentTarget.style.color = "#555")}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  );
                })}
              </div>

              {/* Summary */}
              <div>
                <div className="glass-card" style={{ padding: "24px" }}>
                  <h3 style={{ fontFamily: "var(--font-playfair), Georgia, serif", fontSize: "20px", fontWeight: 700, color: "#f5f0e8", marginBottom: "20px" }}>
                    Order Summary
                  </h3>

                  <div className="flex flex-col gap-3" style={{ marginBottom: "20px" }}>
                    {items.map((item) => (
                      <div key={item.competitionId} className="flex justify-between" style={{ fontSize: "14px" }}>
                        <span style={{ color: "#888" }}>{item.competitionTitle} ×{item.quantity}</span>
                        <span style={{ color: "#f5f0e8" }}>£{(item.quantity * item.ticketPrice).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>

                  <div style={{ borderTop: "1px solid #2a2a2a", paddingTop: "16px", marginBottom: "20px" }}>
                    <div className="flex justify-between">
                      <span style={{ color: "#f5f0e8", fontWeight: 600, fontSize: "16px" }}>Total</span>
                      <span style={{ color: "#c9a84c", fontWeight: 700, fontSize: "20px" }}>£{total.toFixed(2)}</span>
                    </div>
                  </div>

                  <Link href="/checkout">
                    <button className="btn-gold" style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}>
                      Proceed to Checkout <ArrowRight size={16} />
                    </button>
                  </Link>

                  <p style={{ color: "#555", fontSize: "12px", textAlign: "center", marginTop: "12px" }}>
                    Secure checkout powered by Stripe
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </Layout>
    </>
  );
}
