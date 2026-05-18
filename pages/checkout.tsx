import Head from "next/head";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/router";
import { Elements, PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { Shield, Lock, ArrowLeft } from "lucide-react";
import Layout from "@/components/Layout";
import { useCart } from "@/context/CartContext";
import { getStripeClient } from "@/lib/stripe";

const stripePromise = getStripeClient();

interface CustomerForm {
  fullName: string;
  email: string;
  phone: string;
}

function CheckoutForm({ clientSecret, total, onSuccess }: { clientSecret: string; total: number; onSuccess: (orderId: string) => void }) {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!stripe || !elements) return;

    setLoading(true);
    setError(null);

    const { error: submitErr } = await elements.submit();
    if (submitErr) {
      setError(submitErr.message ?? "Payment failed");
      setLoading(false);
      return;
    }

    const { error: confirmErr, paymentIntent } = await stripe.confirmPayment({
      elements,
      clientSecret,
      confirmParams: {
        return_url: `${window.location.origin}/order-confirmation/pending`,
      },
      redirect: "if_required",
    });

    if (confirmErr) {
      setError(confirmErr.message ?? "Payment failed");
      setLoading(false);
      return;
    }

    if (paymentIntent?.status === "succeeded") {
      // Fire-and-forget confirm (sends email, generates tickets)
      fetch("/api/payment/confirm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ paymentIntentId: paymentIntent.id }),
      }).catch(() => {});
      // orderId is pi_ ID without the prefix
      const orderId = paymentIntent.id.replace("pi_", "");
      onSuccess(orderId);
    }

    setLoading(false);
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="stripe-element-wrapper" style={{ marginBottom: "20px" }}>
        <PaymentElement
          options={{
            layout: "tabs",
            paymentMethodOrder: ["apple_pay", "google_pay", "card", "klarna"],
          }}
        />
      </div>

      {error && (
        <div style={{ background: "rgba(231,76,60,0.1)", border: "1px solid rgba(231,76,60,0.3)", borderRadius: "8px", padding: "12px 16px", marginBottom: "16px", color: "#e74c3c", fontSize: "14px" }}>
          {error}
        </div>
      )}

      <button
        type="submit"
        className="btn-gold"
        style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", fontSize: "16px", padding: "16px" }}
        disabled={loading || !stripe}
      >
        <Lock size={16} />
        {loading ? "Processing..." : `Pay £${total.toFixed(2)}`}
      </button>
    </form>
  );
}

export default function CheckoutPage() {
  const router = useRouter();
  const { items, total, clearCart } = useCart();
  const [form, setForm] = useState<CustomerForm>({ fullName: "", email: "", phone: "" });
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleFormSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.fullName || !form.email || !form.phone) {
      setFormError("Please fill in all fields.");
      return;
    }
    setFormError(null);
    setLoading(true);

    const res = await fetch("/api/payment/create-intent", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ items, customer: form }),
    });
    const data = await res.json();
    if (data.clientSecret) {
      setClientSecret(data.clientSecret);
      setFormSubmitted(true);
    } else {
      setFormError(data.error || "Failed to initialise payment.");
    }
    setLoading(false);
  }

  function handleSuccess(orderId: string) {
    clearCart();
    router.push(`/order-confirmation/${orderId}`);
  }

  if (items.length === 0) {
    return (
      <Layout>
        <div className="max-w-3xl mx-auto px-4 py-20 text-center">
          <p style={{ color: "#888", marginBottom: "20px" }}>Your basket is empty.</p>
          <Link href="/#competitions"><button className="btn-gold">Browse Competitions</button></Link>
        </div>
      </Layout>
    );
  }

  return (
    <>
      <Head>
        <title>Checkout — LuxRaffle</title>
      </Head>
      <Layout>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex items-center gap-3 mb-8">
            <Link href="/basket" style={{ color: "#888", display: "flex", alignItems: "center", gap: "4px", fontSize: "14px" }}>
              <ArrowLeft size={14} /> Back to basket
            </Link>
          </div>

          <h1 style={{ fontFamily: "var(--font-playfair), Georgia, serif", fontSize: "clamp(28px, 4vw, 42px)", fontWeight: 700, color: "#f5f0e8", marginBottom: "32px" }}>
            Checkout
          </h1>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            {/* Left: forms */}
            <div className="lg:col-span-2">
              {!formSubmitted ? (
                <div className="glass-card" style={{ padding: "32px" }}>
                  <h2 style={{ fontFamily: "var(--font-playfair), Georgia, serif", fontSize: "22px", fontWeight: 700, color: "#f5f0e8", marginBottom: "24px" }}>
                    Your Details
                  </h2>
                  <form onSubmit={handleFormSubmit} className="flex flex-col gap-4">
                    <div>
                      <label style={{ color: "#aaa", fontSize: "13px", display: "block", marginBottom: "6px" }}>Full Name *</label>
                      <input
                        className="input-gold"
                        type="text"
                        placeholder="John Smith"
                        value={form.fullName}
                        onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                        required
                      />
                    </div>
                    <div>
                      <label style={{ color: "#aaa", fontSize: "13px", display: "block", marginBottom: "6px" }}>Email Address *</label>
                      <input
                        className="input-gold"
                        type="email"
                        placeholder="john@example.com"
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                        required
                      />
                    </div>
                    <div>
                      <label style={{ color: "#aaa", fontSize: "13px", display: "block", marginBottom: "6px" }}>Phone Number *</label>
                      <input
                        className="input-gold"
                        type="tel"
                        placeholder="+44 7700 000000"
                        value={form.phone}
                        onChange={(e) => setForm({ ...form, phone: e.target.value })}
                        required
                      />
                    </div>

                    {formError && (
                      <div style={{ background: "rgba(231,76,60,0.1)", border: "1px solid rgba(231,76,60,0.3)", borderRadius: "8px", padding: "12px 16px", color: "#e74c3c", fontSize: "14px" }}>
                        {formError}
                      </div>
                    )}

                    <button type="submit" className="btn-gold" style={{ marginTop: "8px" }} disabled={loading}>
                      {loading ? "Please wait..." : "Continue to Payment"}
                    </button>
                  </form>
                </div>
              ) : (
                <div className="glass-card" style={{ padding: "32px" }}>
                  <div style={{ marginBottom: "20px", padding: "14px 18px", background: "#111", borderRadius: "8px" }}>
                    <p style={{ color: "#888", fontSize: "13px", marginBottom: "2px" }}>Paying as</p>
                    <p style={{ color: "#f5f0e8", fontWeight: 600 }}>{form.fullName}</p>
                    <p style={{ color: "#888", fontSize: "13px" }}>{form.email}</p>
                  </div>

                  <h2 style={{ fontFamily: "var(--font-playfair), Georgia, serif", fontSize: "22px", fontWeight: 700, color: "#f5f0e8", marginBottom: "24px" }}>
                    Payment
                  </h2>

                  {clientSecret && (
                    <Elements
                      stripe={stripePromise}
                      options={{
                        clientSecret,
                        appearance: {
                          theme: "night",
                          variables: {
                            colorPrimary: "#c9a84c",
                            colorBackground: "#111",
                            colorText: "#f5f0e8",
                            colorDanger: "#e74c3c",
                            fontFamily: "Inter, Arial, sans-serif",
                            borderRadius: "8px",
                          },
                        },
                      }}
                    >
                      <CheckoutForm
                        clientSecret={clientSecret}
                        total={total}
                        onSuccess={handleSuccess}
                      />
                    </Elements>
                  )}

                  <div className="flex items-center justify-center gap-2 mt-4" style={{ color: "#555", fontSize: "12px" }}>
                    <Shield size={12} />
                    <span>256-bit SSL encryption · Powered by Stripe</span>
                  </div>
                </div>
              )}
            </div>

            {/* Right: order summary */}
            <div>
              <div className="glass-card" style={{ padding: "24px" }}>
                <h3 style={{ fontFamily: "var(--font-playfair), Georgia, serif", fontSize: "18px", fontWeight: 700, color: "#f5f0e8", marginBottom: "20px" }}>
                  Order Summary
                </h3>

                <div className="flex flex-col gap-3" style={{ marginBottom: "16px" }}>
                  {items.map((item) => (
                    <div key={item.competitionId}>
                      <div className="flex justify-between" style={{ marginBottom: "2px" }}>
                        <span style={{ color: "#f5f0e8", fontSize: "14px", fontWeight: 500 }}>{item.competitionTitle}</span>
                      </div>
                      <div className="flex justify-between">
                        <span style={{ color: "#888", fontSize: "13px" }}>{item.quantity} ticket{item.quantity > 1 ? "s" : ""} × £{item.ticketPrice.toFixed(2)}</span>
                        <span style={{ color: "#aaa", fontSize: "13px" }}>£{(item.quantity * item.ticketPrice).toFixed(2)}</span>
                      </div>
                    </div>
                  ))}
                </div>

                <div style={{ borderTop: "1px solid #2a2a2a", paddingTop: "16px" }}>
                  <div className="flex justify-between">
                    <span style={{ color: "#f5f0e8", fontWeight: 600 }}>Total</span>
                    <span style={{ color: "#c9a84c", fontWeight: 700, fontSize: "20px" }}>£{total.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    </>
  );
}
