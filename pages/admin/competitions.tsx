import type { GetServerSideProps } from "next";
import Head from "next/head";
import { useState } from "react";
import { Plus, Edit2, Trash2, Trophy, X } from "lucide-react";
import AdminLayout from "@/components/admin/AdminLayout";
import prisma from "@/lib/prisma";
import { verifyAdminToken } from "@/lib/auth";

interface Competition {
  id: string;
  title: string;
  slug: string;
  description: string;
  prizeValue: number;
  ticketPrice: number;
  maxTickets: number;
  ticketsSold: number;
  drawDate: string;
  status: string;
  imageUrl: string | null;
  maxPerOrder: number;
}

const emptyForm = {
  title: "",
  slug: "",
  description: "",
  prizeValue: "",
  ticketPrice: "",
  maxTickets: "",
  drawDate: "",
  status: "active",
  imageUrl: "",
  maxPerOrder: "100",
};

export default function AdminCompetitionsPage({ initialCompetitions }: { initialCompetitions: Competition[] }) {
  const [competitions, setCompetitions] = useState(initialCompetitions);
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pickingWinner, setPickingWinner] = useState<string | null>(null);

  function openCreate() {
    setForm(emptyForm);
    setEditId(null);
    setShowModal(true);
    setError(null);
  }

  function openEdit(c: Competition) {
    setForm({
      title: c.title,
      slug: c.slug,
      description: c.description,
      prizeValue: String(c.prizeValue),
      ticketPrice: String(c.ticketPrice),
      maxTickets: String(c.maxTickets),
      drawDate: new Date(c.drawDate).toISOString().slice(0, 16),
      status: c.status,
      imageUrl: c.imageUrl || "",
      maxPerOrder: String(c.maxPerOrder),
    });
    setEditId(c.id);
    setShowModal(true);
    setError(null);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const url = editId ? `/api/admin/competitions/${editId}` : "/api/admin/competitions";
    const method = editId ? "PUT" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    const data = await res.json();
    if (!res.ok) {
      setError(data.error || "Failed to save");
      setLoading(false);
      return;
    }

    if (editId) {
      setCompetitions((prev) => prev.map((c) => (c.id === editId ? { ...data, drawDate: data.drawDate } : c)));
    } else {
      setCompetitions((prev) => [{ ...data, drawDate: data.drawDate }, ...prev]);
    }

    setShowModal(false);
    setLoading(false);
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this competition? This cannot be undone.")) return;
    const res = await fetch(`/api/admin/competitions/${id}`, { method: "DELETE" });
    if (res.ok) setCompetitions((prev) => prev.filter((c) => c.id !== id));
  }

  async function handlePickWinner(competitionId: string) {
    if (!confirm("Pick a winner now? This cannot be undone.")) return;
    setPickingWinner(competitionId);
    const res = await fetch("/api/admin/pick-winner", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ competitionId }),
    });
    const data = await res.json();
    setPickingWinner(null);
    if (res.ok) {
      alert(`Winner: ${data.winnerName} (Ticket #${data.ticketNumber})\nEmail: ${data.winnerEmail}`);
      setCompetitions((prev) => prev.map((c) => (c.id === competitionId ? { ...c, status: "drawn" } : c)));
    } else {
      alert(data.error || "Failed to pick winner");
    }
  }

  return (
    <>
      <Head><title>Competitions — Admin</title></Head>
      <AdminLayout>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "28px" }}>
          <div>
            <h1 style={{ fontFamily: "var(--font-playfair), Georgia, serif", fontSize: "28px", fontWeight: 700, color: "#f5f0e8" }}>
              Competitions
            </h1>
            <p style={{ color: "#666", fontSize: "14px", marginTop: "4px" }}>{competitions.length} competitions</p>
          </div>
          <button className="btn-gold" style={{ display: "flex", alignItems: "center", gap: "8px", padding: "10px 20px" }} onClick={openCreate}>
            <Plus size={16} /> New Competition
          </button>
        </div>

        {/* Table */}
        <div style={{ background: "#111", border: "1px solid #1a1a1a", borderRadius: "10px", overflow: "hidden" }}>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ background: "#0d0d0d" }}>
                  {["Title", "Price", "Tickets", "Draw Date", "Status", "Actions"].map((h) => (
                    <th key={h} style={{ padding: "12px 16px", textAlign: "left", color: "#666", fontSize: "12px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.5px" }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {competitions.map((c) => (
                  <tr key={c.id} style={{ borderTop: "1px solid #1a1a1a" }}>
                    <td style={{ padding: "14px 16px" }}>
                      <div style={{ color: "#f5f0e8", fontWeight: 500, fontSize: "14px" }}>{c.title}</div>
                      <div style={{ color: "#555", fontSize: "12px" }}>/{c.slug}</div>
                    </td>
                    <td style={{ padding: "14px 16px", color: "#c9a84c", fontSize: "14px", fontWeight: 600 }}>
                      £{c.ticketPrice.toFixed(2)}
                    </td>
                    <td style={{ padding: "14px 16px", color: "#888", fontSize: "13px" }}>
                      {c.ticketsSold}/{c.maxTickets}
                    </td>
                    <td style={{ padding: "14px 16px", color: "#888", fontSize: "13px" }}>
                      {new Date(c.drawDate).toLocaleDateString("en-GB")}
                    </td>
                    <td style={{ padding: "14px 16px" }}>
                      <span style={{ padding: "3px 10px", borderRadius: "100px", fontSize: "12px", fontWeight: 600, background: c.status === "active" ? "rgba(39,174,96,0.15)" : c.status === "drawn" ? "rgba(201,168,76,0.15)" : "rgba(231,76,60,0.15)", color: c.status === "active" ? "#27ae60" : c.status === "drawn" ? "#c9a84c" : "#e74c3c", border: `1px solid ${c.status === "active" ? "rgba(39,174,96,0.3)" : c.status === "drawn" ? "rgba(201,168,76,0.3)" : "rgba(231,76,60,0.3)"}` }}>
                        {c.status}
                      </span>
                    </td>
                    <td style={{ padding: "14px 16px" }}>
                      <div className="flex items-center gap-2">
                        <button onClick={() => openEdit(c)} style={{ color: "#888", background: "none", border: "none", cursor: "pointer", padding: "4px" }}
                          onMouseEnter={(e) => (e.currentTarget.style.color = "#c9a84c")}
                          onMouseLeave={(e) => (e.currentTarget.style.color = "#888")}>
                          <Edit2 size={15} />
                        </button>
                        {c.status === "active" && (
                          <button
                            onClick={() => handlePickWinner(c.id)}
                            disabled={pickingWinner === c.id}
                            style={{ color: "#888", background: "none", border: "1px solid #333", cursor: "pointer", padding: "4px 8px", borderRadius: "6px", fontSize: "11px" }}
                            onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.color = "#c9a84c"; (e.currentTarget as HTMLButtonElement).style.borderColor = "#c9a84c"; }}
                            onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.color = "#888"; (e.currentTarget as HTMLButtonElement).style.borderColor = "#333"; }}
                          >
                            {pickingWinner === c.id ? "..." : "Pick Winner"}
                          </button>
                        )}
                        <button onClick={() => handleDelete(c.id)} style={{ color: "#888", background: "none", border: "none", cursor: "pointer", padding: "4px" }}
                          onMouseEnter={(e) => (e.currentTarget.style.color = "#e74c3c")}
                          onMouseLeave={(e) => (e.currentTarget.style.color = "#888")}>
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {competitions.length === 0 && (
                  <tr><td colSpan={6} style={{ padding: "40px", textAlign: "center", color: "#555" }}>No competitions yet. Create your first one!</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modal */}
        {showModal && (
          <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.8)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 50, padding: "20px" }}>
            <div style={{ background: "#111", border: "1px solid #2a2a2a", borderRadius: "12px", width: "100%", maxWidth: "580px", maxHeight: "90vh", overflowY: "auto" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "20px 24px", borderBottom: "1px solid #1a1a1a" }}>
                <h2 style={{ color: "#f5f0e8", fontSize: "18px", fontWeight: 600 }}>
                  {editId ? "Edit Competition" : "New Competition"}
                </h2>
                <button onClick={() => setShowModal(false)} style={{ color: "#888", background: "none", border: "none", cursor: "pointer" }}>
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleSubmit} style={{ padding: "24px" }}>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <label style={{ color: "#aaa", fontSize: "13px", display: "block", marginBottom: "6px" }}>Title *</label>
                    <input className="input-gold" value={form.title} onChange={(e) => { setForm({ ...form, title: e.target.value, slug: editId ? form.slug : e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") })} } required />
                  </div>
                  <div className="sm:col-span-2">
                    <label style={{ color: "#aaa", fontSize: "13px", display: "block", marginBottom: "6px" }}>Slug *</label>
                    <input className="input-gold" value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} placeholder="url-friendly-slug" required />
                  </div>
                  <div className="sm:col-span-2">
                    <label style={{ color: "#aaa", fontSize: "13px", display: "block", marginBottom: "6px" }}>Description *</label>
                    <textarea className="input-gold" rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} style={{ resize: "vertical" }} required />
                  </div>
                  <div>
                    <label style={{ color: "#aaa", fontSize: "13px", display: "block", marginBottom: "6px" }}>Prize Value (£) *</label>
                    <input className="input-gold" type="number" step="0.01" value={form.prizeValue} onChange={(e) => setForm({ ...form, prizeValue: e.target.value })} required />
                  </div>
                  <div>
                    <label style={{ color: "#aaa", fontSize: "13px", display: "block", marginBottom: "6px" }}>Ticket Price (£) *</label>
                    <input className="input-gold" type="number" step="0.01" value={form.ticketPrice} onChange={(e) => setForm({ ...form, ticketPrice: e.target.value })} required />
                  </div>
                  <div>
                    <label style={{ color: "#aaa", fontSize: "13px", display: "block", marginBottom: "6px" }}>Max Tickets *</label>
                    <input className="input-gold" type="number" value={form.maxTickets} onChange={(e) => setForm({ ...form, maxTickets: e.target.value })} required />
                  </div>
                  <div>
                    <label style={{ color: "#aaa", fontSize: "13px", display: "block", marginBottom: "6px" }}>Max Per Order</label>
                    <input className="input-gold" type="number" value={form.maxPerOrder} onChange={(e) => setForm({ ...form, maxPerOrder: e.target.value })} />
                  </div>
                  <div>
                    <label style={{ color: "#aaa", fontSize: "13px", display: "block", marginBottom: "6px" }}>Draw Date *</label>
                    <input className="input-gold" type="datetime-local" value={form.drawDate} onChange={(e) => setForm({ ...form, drawDate: e.target.value })} required />
                  </div>
                  <div>
                    <label style={{ color: "#aaa", fontSize: "13px", display: "block", marginBottom: "6px" }}>Status</label>
                    <select className="input-gold" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
                      <option value="active">Active</option>
                      <option value="ended">Ended</option>
                      <option value="drawn">Drawn</option>
                    </select>
                  </div>
                  <div className="sm:col-span-2">
                    <label style={{ color: "#aaa", fontSize: "13px", display: "block", marginBottom: "6px" }}>Image URL</label>
                    <input className="input-gold" type="url" value={form.imageUrl} onChange={(e) => setForm({ ...form, imageUrl: e.target.value })} placeholder="https://..." />
                  </div>
                </div>

                {error && (
                  <div style={{ background: "rgba(231,76,60,0.1)", border: "1px solid rgba(231,76,60,0.3)", borderRadius: "8px", padding: "10px 14px", color: "#e74c3c", fontSize: "14px", marginTop: "16px" }}>
                    {error}
                  </div>
                )}

                <div className="flex gap-3 mt-6">
                  <button type="button" className="btn-outline-gold" style={{ flex: 1 }} onClick={() => setShowModal(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn-gold" style={{ flex: 2 }} disabled={loading}>
                    {loading ? "Saving..." : editId ? "Save Changes" : "Create Competition"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </AdminLayout>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  const token = (req as any).cookies?.admin_token;
  if (!token) return { redirect: { destination: "/admin/login", permanent: false } };
  const session = await verifyAdminToken(token);
  if (!session) return { redirect: { destination: "/admin/login", permanent: false } };

  const competitions = await prisma.competition.findMany({
    orderBy: { createdAt: "desc" },
  });

  return {
    props: {
      initialCompetitions: competitions.map((c) => ({
        ...c,
        drawDate: c.drawDate.toISOString(),
        createdAt: c.createdAt.toISOString(),
      })),
    },
  };
};
