import { NextResponse } from "next/server";
import { Resend } from "resend";
const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const { alerts, email } = await req.json();
    await resend.emails.send({
      from: `TERRA Weather <${process.env.RESEND_FROM || "onboarding@resend.dev"}>`,
      to: email,
      subject: `[TERRA] Weather Alert Subscription Active`,
      html: `<div style="background:#1A0E05;color:#F5E6C8;font-family:monospace;padding:32px;max-width:600px;margin:0 auto">
        <h2 style="color:#52B788">🌦️ Weather Alerts Activated</h2>
        <p>You're now subscribed to:</p>
        <ul style="line-height:2">${alerts.map((a: string) => `<li>✓ ${a}</li>`).join("")}</ul>
      </div>`,
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to subscribe" }, { status: 500 });
  }
}