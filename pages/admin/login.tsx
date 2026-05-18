import Head from "next/head";
import { useState } from "react";
import { useRouter } from "next/router";
import { Trophy, Lock } from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (res.ok) {
      router.push("/admin");
    } else {
      const data = await res.json();
      setError(data.error || "Invalid credentials");
    }
    setLoading(false);
  }

  return (
    <>
      <Head>
        <title>Admin Login — LuxRaffle</title>
      </Head>
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#0a0a0a" }}>
        <div style={{ width: "100%", maxWidth: "400px", padding: "0 24px" }}>
          <div className="glass-card" style={{ padding: "40px 36px" }}>
            <div style={{ textAlign: "center", marginBottom: "32px" }}>
              <div style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: "56px", height: "56px", background: "rgba(201,168,76,0.1)", border: "1px solid rgba(201,168,76,0.3)", borderRadius: "50%", marginBottom: "16px" }}>
                <Trophy size={24} style={{ color: "#c9a84c" }} />
              </div>
              <h1 style={{ fontFamily: "var(--font-playfair), Georgia, serif", fontSize: "24px", fontWeight: 700, color: "#f5f0e8", marginBottom: "4px" }}>
                Admin Panel
              </h1>
              <p style={{ color: "#666", fontSize: "14px" }}>Sign in to manage your competitions</p>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div>
                <label style={{ color: "#aaa", fontSize: "13px", display: "block", marginBottom: "6px" }}>Email</label>
                <input
                  className="input-gold"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@example.com"
                  required
                />
              </div>
              <div>
                <label style={{ color: "#aaa", fontSize: "13px", display: "block", marginBottom: "6px" }}>Password</label>
                <input
                  className="input-gold"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                />
              </div>

              {error && (
                <div style={{ background: "rgba(231,76,60,0.1)", border: "1px solid rgba(231,76,60,0.3)", borderRadius: "8px", padding: "10px 14px", color: "#e74c3c", fontSize: "14px" }}>
                  {error}
                </div>
              )}

              <button type="submit" className="btn-gold" style={{ marginTop: "8px", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }} disabled={loading}>
                <Lock size={15} />
                {loading ? "Signing in..." : "Sign In"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
