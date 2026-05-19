import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get("type") || "current";

  // Simulated weather data for Telangana
  const weather = {
    current: {
      main: { temp: 33 + (Math.random()-0.5)*4, humidity: 65 + Math.round(Math.random()*20), pressure: 1010 + Math.round(Math.random()*5) },
      weather: [{ description:"partly cloudy", icon:"02d", id:802, main:"Clouds" }],
      wind: { speed: 12 + Math.random()*8 },
      visibility: 8000,
      name: "Hyderabad",
      dt: Date.now(),
    },
    forecast: Array.from({ length: 7 }, (_, i) => ({
      dt: Date.now() + i * 86400000,
      main: { temp_max: 35 + i*0.5 + (Math.random()-0.5)*3, temp_min: 23 + i*0.3 },
      weather: [{ description: ["clear sky","partly cloudy","light rain","thunderstorm","clear sky","sunny","sunny"][i], icon: ["01d","02d","10d","11d","01d","01d","01d"][i] }],
      pop: [0.1, 0.2, 0.6, 0.8, 0.3, 0.05, 0.05][i],
    })),
  };

  return NextResponse.json(type === "forecast" ? weather.forecast : weather.current);
}
