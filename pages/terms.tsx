import Head from "next/head";
import Link from "next/link";
import Layout from "@/components/Layout";

const sections = [
  {
    title: "1. The Promoter",
    content: `These competitions are promoted by LuxRaffle ("the Promoter"), registered in England and Wales. Address: [YOUR BUSINESS ADDRESS]. Email: hello@luxraffle.co.uk.`,
  },
  {
    title: "2. Eligibility",
    content: `These competitions are open to UK residents aged 18 years or over only, excluding employees of the Promoter and their immediate families. The Promoter reserves the right to verify the eligibility of any entrant and to refuse entry or disqualify entries at its absolute discretion.`,
  },
  {
    title: "3. How to Enter — Online",
    content: `To enter online, visit www.luxraffle.co.uk, select a competition, choose the number of tickets you wish to purchase, and complete the secure checkout process. Payment is required to complete online entry. Each ticket purchased constitutes one entry into the relevant draw. Maximum tickets per person per competition may apply and will be stated on the competition page.`,
  },
  {
    title: "4. How to Enter — Free Postal Entry",
    content: `No purchase is necessary to enter. To enter for free by post, write your full name, email address, phone number, and the name of the competition you wish to enter on a postcard or piece of paper. Send it to: LuxRaffle, [YOUR BUSINESS ADDRESS], [POSTCODE]. One postal entry is permitted per person per competition. Postal entries must be received before the competition closing date. Entries must be legible and include all required information. The Promoter accepts no responsibility for entries lost or delayed in the post. Postal entrants have an equal chance of winning as online ticket purchasers.`,
  },
  {
    title: "5. Ticket Allocation",
    content: `Each ticket purchased online is assigned a unique ticket number immediately upon payment confirmation. Postal entries are processed within 5 working days of receipt and are assigned ticket numbers at that time. All ticket numbers are included in the final draw.`,
  },
  {
    title: "6. The Draw",
    content: `The winner will be selected at random using a random number generator from all valid ticket entries once the draw date has been reached or all tickets have been sold (whichever is sooner). The draw is conducted by an independent third party or under supervision to ensure fairness and transparency. The draw result is final and binding.`,
  },
  {
    title: "7. Winner Notification",
    content: `The winner will be notified by email within 24 hours of the draw. The winner's first name and county will be published on our website and social media channels. If a winner cannot be contacted or does not respond within 28 days of notification, the prize may be forfeited and a new winner selected.`,
  },
  {
    title: "8. Prizes",
    content: `Prizes are as described on each individual competition page. No cash alternative will be offered. The Promoter reserves the right to substitute a prize of equal or greater value should the advertised prize become unavailable for any reason. Prizes are non-transferable. The Promoter accepts no responsibility for any damage, loss, or disappointment suffered by any winner or entrant as a result of accepting a prize.`,
  },
  {
    title: "9. Refunds",
    content: `All ticket sales are final. No refunds will be issued once tickets have been purchased, except where required by law (e.g., if the competition is cancelled by the Promoter). If a competition is cancelled, all ticket holders will be refunded in full.`,
  },
  {
    title: "10. Data Protection",
    content: `Personal data provided by entrants will be used by the Promoter solely for the purpose of administering the competition, communicating with entrants, and fulfilling prizes. Data will not be shared with third parties except where necessary to fulfil a prize. By entering, you consent to the Promoter processing your personal data in accordance with our Privacy Policy and the UK GDPR.`,
  },
  {
    title: "11. Limitation of Liability",
    content: `The Promoter's maximum liability to any entrant shall not exceed the ticket price paid by that entrant. The Promoter is not responsible for any indirect, special, or consequential loss arising from participation in any competition. Nothing in these Terms shall exclude or limit liability for death or personal injury caused by negligence.`,
  },
  {
    title: "12. General",
    content: `The Promoter reserves the right to amend these terms and conditions or cancel any competition at any time without notice. These terms are governed by the laws of England and Wales. Any disputes shall be subject to the exclusive jurisdiction of the courts of England and Wales. By entering a competition, you agree to be bound by these terms and conditions.`,
  },
  {
    title: "13. Responsible Gambling",
    content: `Our competitions are skill-free prize draws and are not classified as gambling under UK law. However, if you feel you are spending more than you can afford, please contact GamCare on 0808 8020 133 or visit www.gamcare.org.uk.`,
  },
];

export default function TermsPage() {
  return (
    <>
      <Head>
        <title>Terms & Conditions — LuxRaffle</title>
        <meta name="description" content="LuxRaffle competition terms and conditions. UK law compliant." />
      </Head>
      <Layout>
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16">
          <h1 style={{ fontFamily: "var(--font-playfair), Georgia, serif", fontSize: "clamp(32px, 4vw, 48px)", fontWeight: 700, color: "#f5f0e8", marginBottom: "8px" }}>
            Terms & Conditions
          </h1>
          <p style={{ color: "#666", fontSize: "14px", marginBottom: "40px" }}>
            Last updated: {new Date().toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}
          </p>

          <div className="flex flex-col gap-8">
            {sections.map((section) => (
              <div key={section.title}>
                <h2 style={{ fontFamily: "var(--font-playfair), Georgia, serif", fontSize: "18px", fontWeight: 700, color: "#c9a84c", marginBottom: "12px" }}>
                  {section.title}
                </h2>
                <p style={{ color: "#aaa", fontSize: "15px", lineHeight: "1.8" }}>
                  {section.content}
                </p>
              </div>
            ))}
          </div>

          <div style={{ marginTop: "48px", padding: "20px 24px", background: "rgba(201,168,76,0.05)", border: "1px solid rgba(201,168,76,0.15)", borderRadius: "10px" }}>
            <p style={{ color: "#888", fontSize: "14px", lineHeight: "1.6" }}>
              For questions about these terms, contact us at{" "}
              <a href="mailto:hello@luxraffle.co.uk" style={{ color: "#c9a84c" }}>hello@luxraffle.co.uk</a>.
              For free postal entry information, see our{" "}
              <Link href="/postal-entry" style={{ color: "#c9a84c" }}>postal entry page</Link>.
            </p>
          </div>
        </div>
      </Layout>
    </>
  );
}
