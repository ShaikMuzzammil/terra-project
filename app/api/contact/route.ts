import { NextResponse } from "next/server";
export async function POST(req: Request) {
  const { name, email, message } = await req.json();
  if (!name||!email||!message) return NextResponse.json({error:"Missing fields"},{status:400});
  return NextResponse.json({success:true,msg:`Thanks ${name}, we'll reply to ${email} within 24h.`});
}
