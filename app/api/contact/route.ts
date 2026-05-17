import { NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const { name, email, subject, message } = await req.json();
    if (!name || !email || !subject || !message) {
      return NextResponse.json({ error: "All fields required" }, { status: 400 });
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: "Invalid email format" }, { status: 400 });
    }
    await resend.emails.send({
      from: `TERRA Farm Platform <${process.env.RESEND_FROM || "onboarding@resend.dev"}>`,
      to: email,
      subject: `[TERRA] We received your message — ${subject}`,
      html: `<div style="background:#1A0E05;color:#F5E6C8;font-family:monospace;padding:32px;border-radius:8px;max-width:600px;margin:0 auto">
        <h1 style="color:#E9A319;font-size:24px;font-family:serif">🌿 TERRA</h1>
        <p>Hi ${name},</p><p>We've received your message about <strong>${subject}</strong>.</p>
        <p>Our farm intelligence team will respond within 24 hours.</p>
        <hr style="border-color:#3D2410;margin:24px 0"/>
        <p style="color:#8B5E3C;font-size:12px">Your message:</p>
        <p style="background:#2C1A0A;padding:16px;border-radius:6px;border-left:3px solid #2D6A4F">${message.replace(/\n/g, "<br/>")}</p>
      </div>`,
    });
    await resend.emails.send({
      from: `TERRA Alerts <${process.env.RESEND_FROM || "onboarding@resend.dev"}>`,
      to: process.env.TEAM_EMAIL || "team@terra.farm",
      subject: `[TERRA CONTACT] ${subject} — from ${name}`,
      html: `<div style="background:#1A0E05;color:#F5E6C8;font-family:monospace;padding:32px">
        <h2 style="color:#E9A319">New Contact Submission</h2>
        <p><strong>Name:</strong> ${name}</p><p><strong>Email:</strong> ${email}</p>
        <p><strong>Subject:</strong> ${subject}</p>
        <p><strong>Received:</strong> ${new Date().toLocaleString("en-IN")}</p>
        <hr style="border-color:#3D2410;margin:16px 0"/>
        <p><strong>Message:</strong></p><p style="background:#2C1A0A;padding:16px;border-radius:6px">${message.replace(/\n/g, "<br/>")}</p>
      </div>`,
    });
    return NextResponse.json({ success: true, message: "Emails sent successfully" });
  } catch (error) {
    return NextResponse.json({ error: "Failed to send message. Please try again." }, { status: 500 });
  }
}