import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const body = await request.json();
  const { name, email, message, subject } = body;

  if (!name || !email || !message) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  // In production: send email via Resend, SendGrid, etc.
  console.log("Contact form submission:", { name, email, subject, message });

  return NextResponse.json({ success: true, message: `Message received from ${name}. We'll be in touch!` });
}
