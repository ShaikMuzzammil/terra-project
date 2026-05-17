import { NextResponse } from "next/server";
import { getLivePrices } from "@/lib/utils";

export async function GET() {
  const prices = getLivePrices();
  return NextResponse.json(prices);
}