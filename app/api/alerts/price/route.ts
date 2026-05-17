import { NextResponse } from "next/server";
import { Resend } from "resend";
const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const { commodity, alertType, threshold, email } = await req.json();
    await resend.emails.send({
      from: `TERRA Alerts <${process.env.RESEND_FROM || "onboarding@resend.dev"}>`,
      to: email,
      subject: `[TERRA] Price Alert Activated — ${commodity}`,
      html: `<div style="background:#1A0E05;color:#F5E6C8;font-family:monospace;padding:32px;max-width:600px;margin:0 auto">
        <h2 style="color:#E9A319">📈 Price Alert Confirmed</h2>
        <p>Your price alert has been activated:</p>
        <ul style="line-height:2"><li><strong>Commodity:</strong> ${commodity}</li><li><strong>Trigger:</strong> ${alertType} ₹${threshold}</li><li><strong>Email:</strong> ${email}</li></ul>
      </div>`,
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to set alert" }, { status: 500 });
  }
}