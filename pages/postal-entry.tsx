import Head from "next/head";
import Link from "next/link";
import { Mail, CheckCircle, AlertCircle } from "lucide-react";
import Layout from "@/components/Layout";

export default function PostalEntryPage() {
  return (
    <>
      <Head>
        <title>Free Postal Entry — LuxRaffle</title>
        <meta name="description" content="Learn how to enter LuxRaffle competitions for free by post. No purchase necessary." />
      </Head>
      <Layout>
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16">
          {/* Header */}
          <div style={{ textAlign: "center", marginBottom: "48px" }}>
            <div style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: "64px", height: "64px", background: "rgba(201,168,76,0.1)", border: "1px solid rgba(201,168,76,0.3)", borderRadius: "50%", marginBottom: "20px" }}>
              <Mail size={28} style={{ color: "#c9a84c" }} />
            </div>
            <h1 style={{ fontFamily: "var(--font-playfair), Georgia, serif", fontSize: "clamp(32px, 4vw, 48px)", fontWeight: 700, color: "#f5f0e8", marginBottom: "16px" }}>
              Free Postal Entry
            </h1>
            <p style={{ color: "#aaa", fontSize: "17px", lineHeight: "1.7", maxWidth: "560px", margin: "0 auto" }}>
              No purchase necessary. You can enter any of our competitions completely free of charge by sending a postal entry.
            </p>
          </div>

          {/* Key notice */}
          <div style={{ background: "rgba(201,168,76,0.08)", border: "1px solid rgba(201,168,76,0.3)", borderRadius: "12px", padding: "20px 24px", marginBottom: "36px" }}>
            <div className="flex items-start gap-3">
              <AlertCircle size={20} style={{ color: "#c9a84c", flexShrink: 0, marginTop: "2px" }} />
              <p style={{ color: "#f5f0e8", fontSize: "15px", lineHeight: "1.6" }}>
                <strong>Important:</strong> Postal entrants have an <strong style={{ color: "#c9a84c" }}>equal chance</strong> of winning as paid ticket holders. Every valid postal entry is included in the draw on the same terms.
              </p>
            </div>
          </div>

          {/* How to enter */}
          <div className="glass-card" style={{ padding: "32px", marginBottom: "24px" }}>
            <h2 style={{ fontFamily: "var(--font-playfair), Georgia, serif", fontSize: "24px", fontWeight: 700, color: "#f5f0e8", marginBottom: "24px" }}>
              How to Enter by Post
            </h2>

            <div className="flex flex-col gap-5">
              {[
                {
                  step: "1",
                  title: "Write your details on a postcard or piece of paper",
                  detail: "Include the following on a postcard (or plain piece of paper/envelope insert):",
                  list: ["Your full name", "Your email address", "Your phone number", "The exact name of the competition you wish to enter"],
                },
                {
                  step: "2",
                  title: "Send it to our address",
                  detail: "Post your entry to:",
                  address: true,
                },
                {
                  step: "3",
                  title: "Wait for processing",
                  detail: "Postal entries are processed within 5 working days of receipt. You will receive an email confirmation once your entry has been registered.",
                  list: null,
                },
              ].map(({ step, title, detail, list, address }) => (
                <div key={step} className="flex gap-4">
                  <div style={{ flexShrink: 0, width: "32px", height: "32px", borderRadius: "50%", background: "rgba(201,168,76,0.12)", border: "1px solid rgba(201,168,76,0.3)", display: "flex", alignItems: "center", justifyContent: "center", color: "#c9a84c", fontSize: "14px", fontWeight: 700 }}>
                    {step}
                  </div>
                  <div>
                    <h3 style={{ color: "#f5f0e8", fontWeight: 600, fontSize: "15px", marginBottom: "8px" }}>{title}</h3>
                    <p style={{ color: "#888", fontSize: "14px", lineHeight: "1.6", marginBottom: list ? "10px" : "0" }}>{detail}</p>
                    {list && (
                      <ul style={{ color: "#aaa", fontSize: "14px", lineHeight: "1.8", paddingLeft: "20px" }}>
                        {list.map((item) => <li key={item}>{item}</li>)}
                      </ul>
                    )}
                    {address && (
                      <div style={{ background: "#111", border: "1px solid #2a2a2a", borderRadius: "8px", padding: "14px 18px", marginTop: "10px", fontStyle: "italic" }}>
                        <p style={{ color: "#f5f0e8", fontSize: "14px", lineHeight: "1.8" }}>
                          LuxRaffle Competitions<br />
                          [YOUR BUSINESS ADDRESS]<br />
                          [TOWN], [COUNTY]<br />
                          [POSTCODE]<br />
                          United Kingdom
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Rules */}
          <div className="glass-card" style={{ padding: "32px", marginBottom: "24px" }}>
            <h2 style={{ fontFamily: "var(--font-playfair), Georgia, serif", fontSize: "24px", fontWeight: 700, color: "#f5f0e8", marginBottom: "20px" }}>
              Postal Entry Rules
            </h2>

            <div className="flex flex-col gap-3">
              {[
                "One postal entry per person per competition.",
                "Entries must be received before the closing date of the competition.",
                "Entries must include all required information (name, email, phone, competition name) to be valid.",
                "Illegible or incomplete entries will not be entered into the draw.",
                "Postal entries are entered into the same prize draw as online ticket purchases.",
                "LuxRaffle is not responsible for entries lost, delayed or damaged in the post.",
                "Bulk entries from the same address may be disqualified.",
                "Open to UK residents aged 18 and over only.",
              ].map((rule, i) => (
                <div key={i} className="flex items-start gap-3">
                  <CheckCircle size={16} style={{ color: "#c9a84c", flexShrink: 0, marginTop: "2px" }} />
                  <span style={{ color: "#aaa", fontSize: "14px", lineHeight: "1.5" }}>{rule}</span>
                </div>
              ))}
            </div>
          </div>

          {/* CTA */}
          <div style={{ textAlign: "center" }}>
            <p style={{ color: "#888", fontSize: "14px", marginBottom: "20px" }}>
              Want to enter online instead for instant ticket assignment?
            </p>
            <Link href="/#competitions">
              <button className="btn-gold">Browse Competitions</button>
            </Link>
          </div>
        </div>
      </Layout>
    </>
  );
}
