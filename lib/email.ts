import { Resend } from "resend";

let resendInstance: Resend | null = null;

function getResend(): Resend {
  if (!resendInstance) {
    resendInstance = new Resend(process.env.RESEND_API_KEY);
  }
  return resendInstance;
}

interface OrderTicket {
  competitionTitle: string;
  ticketNumbers: number[];
  quantity: number;
}

export async function sendOrderConfirmationEmail(params: {
  to: string;
  customerName: string;
  orderId: string;
  tickets: OrderTicket[];
  total: number;
}) {
  const { to, customerName, orderId, tickets, total } = params;

  const ticketRows = tickets
    .map(
      (t) => `
    <tr>
      <td style="padding: 8px 12px; border-bottom: 1px solid #2a2a2a;">${t.competitionTitle}</td>
      <td style="padding: 8px 12px; border-bottom: 1px solid #2a2a2a; text-align: center;">${t.quantity}</td>
      <td style="padding: 8px 12px; border-bottom: 1px solid #2a2a2a;">${t.ticketNumbers.join(", ")}</td>
    </tr>`
    )
    .join("");

  const html = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="background:#0d0d0d; color:#f5f0e8; font-family: Arial, sans-serif; padding: 40px 20px; margin: 0;">
  <div style="max-width: 600px; margin: 0 auto; background: #1a1a1a; border: 1px solid #c9a84c; border-radius: 12px; overflow: hidden;">
    <div style="background: linear-gradient(135deg, #1a1a1a, #2a2010); padding: 32px; text-align: center; border-bottom: 1px solid #c9a84c;">
      <h1 style="color: #c9a84c; font-size: 28px; margin: 0 0 8px;">LuxRaffle</h1>
      <p style="color: #f5f0e8; margin: 0; font-size: 16px;">Order Confirmed!</p>
    </div>
    <div style="padding: 32px;">
      <p style="font-size: 18px; margin: 0 0 24px;">Hi ${customerName},</p>
      <p style="color: #aaa; margin: 0 0 24px;">Thank you for your entry. Your tickets have been registered and you're in the draw! Good luck!</p>

      <div style="background: #111; border: 1px solid #333; border-radius: 8px; padding: 16px; margin-bottom: 24px;">
        <p style="color: #c9a84c; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; margin: 0 0 8px;">Order Reference</p>
        <p style="font-size: 20px; font-weight: bold; margin: 0;">#${orderId.slice(-8).toUpperCase()}</p>
      </div>

      <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px;">
        <thead>
          <tr style="background: #111;">
            <th style="padding: 10px 12px; text-align: left; color: #c9a84c; font-size: 12px; text-transform: uppercase;">Competition</th>
            <th style="padding: 10px 12px; text-align: center; color: #c9a84c; font-size: 12px; text-transform: uppercase;">Qty</th>
            <th style="padding: 10px 12px; text-align: left; color: #c9a84c; font-size: 12px; text-transform: uppercase;">Ticket Numbers</th>
          </tr>
        </thead>
        <tbody>
          ${ticketRows}
        </tbody>
      </table>

      <div style="text-align: right; font-size: 18px; font-weight: bold; color: #c9a84c; border-top: 1px solid #333; padding-top: 16px;">
        Total: £${total.toFixed(2)}
      </div>
    </div>
    <div style="background: #111; padding: 20px 32px; border-top: 1px solid #333; text-align: center;">
      <p style="color: #666; font-size: 12px; margin: 0;">LuxRaffle · UK Competition Law Compliant · 18+ Only</p>
    </div>
  </div>
</body>
</html>`;

  try {
    await getResend().emails.send({
      from: "LuxRaffle <noreply@luxraffle.co.uk>",
      to,
      subject: `Order Confirmed - #${orderId.slice(-8).toUpperCase()}`,
      html,
    });
  } catch (err) {
    console.error("Failed to send order confirmation email:", err);
  }
}
