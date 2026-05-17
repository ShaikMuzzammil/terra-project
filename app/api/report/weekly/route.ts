import { NextResponse } from "next/server";
import { Resend } from "resend";
const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const { email, farmData } = await req.json();
    await resend.emails.send({
      from: `TERRA Reports <${process.env.RESEND_FROM || "onboarding@resend.dev"}>`,
      to: email,
      subject: `[TERRA] Weekly Farm Report — ${new Date().toLocaleDateString("en-IN")}`,
      html: `<div style="background:#1A0E05;color:#F5E6C8;font-family:monospace;padding:32px;max-width:700px;margin:0 auto">
        <h1 style="color:#E9A319;font-family:serif">🌿 TERRA Weekly Farm Report</h1>
        <p style="color:#8B5E3C">Week of ${new Date().toLocaleDateString("en-IN")}</p>
        <div style="background:#2C1A0A;padding:20px;border-radius:8px;margin:20px 0;border-left:4px solid #2D6A4F">
          <h3 style="color:#95D5B2">Farm Summary</h3>
          <p>Active Plots: ${farmData?.plots || 6}</p>
          <p>Average Health: ${farmData?.health || 82}%</p>
          <p>Irrigation Events: ${farmData?.irrigation || 12}</p>
        </div>
      </div>`,
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to send report" }, { status: 500 });
  }
}