import { NextResponse } from "next/server";
import { getCurrentWeather, getForecast, getMockWeather, getMockForecast } from "@/lib/weather";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const lat = searchParams.get("lat") || process.env.FARM_LAT || "17.3850";
  const lon = searchParams.get("lon") || process.env.FARM_LON || "78.4867";
  const type = searchParams.get("type") || "current";
  const apiKey = process.env.OPENWEATHERMAP_API_KEY;
  if (!apiKey) {
    return NextResponse.json(type === "current" ? getMockWeather() : getMockForecast());
  }
  const data = type === "current" 
    ? await getCurrentWeather(parseFloat(lat), parseFloat(lon), apiKey)
    : await getForecast(parseFloat(lat), parseFloat(lon), apiKey);
  if (!data) {
    return NextResponse.json(type === "current" ? getMockWeather() : getMockForecast());
  }
  return NextResponse.json(data);
}