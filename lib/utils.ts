import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-IN", { style:"currency", currency:"INR", maximumFractionDigits:0 }).format(amount);
}

export function formatNumber(num: number, decimals = 0): string {
  return new Intl.NumberFormat("en-IN", { minimumFractionDigits:decimals, maximumFractionDigits:decimals }).format(num);
}

export const CROPS = {
  wheat:   { base:2150, msp:2015, unit:"qtl", emoji:"🌾", color:"#F4D03F" },
  rice:    { base:1940, msp:1815, unit:"qtl", emoji:"🍚", color:"#95D5B2" },
  maize:   { base:1890, msp:1760, unit:"qtl", emoji:"🌽", color:"#E9A319" },
  soybean: { base:4200, msp:3950, unit:"qtl", emoji:"🫘", color:"#52B788" },
  onion:   { base:840,  msp:0,    unit:"qtl", emoji:"🧅", color:"#C0392B" },
  cotton:  { base:6620, msp:6080, unit:"qtl", emoji:"🧶", color:"#8B5E3C" },
  tomato:  { base:1200, msp:0,    unit:"qtl", emoji:"🍅", color:"#e57373" },
  potato:  { base:950,  msp:0,    unit:"qtl", emoji:"🥔", color:"#D4A76A" },
} as const;

export type CropKey = keyof typeof CROPS;

let _priceCache: Record<string, any> = {};
let _lastFetch = 0;

export function getLivePrices(): Record<string, any> {
  const now = Date.now();
  if (now - _lastFetch < 60000 && Object.keys(_priceCache).length > 0) return _priceCache;
  _lastFetch = now;
  _priceCache = Object.entries(CROPS).reduce((acc, [crop, data]) => {
    const drift = (Math.random() - 0.5) * 0.025;
    const current = Math.round(data.base * (1 + drift));
    const change = current - data.base;
    return { ...acc, [crop]: { ...data, current, change, changePercent: parseFloat(((change/data.base)*100).toFixed(1)), prevClose: data.base } };
  }, {} as Record<string,any>);
  return _priceCache;
}

export const DISTRICT_AVERAGES: Record<string, number> = {
  wheat:42, rice:55, maize:48, soybean:18, cotton:15, onion:180, tomato:220, potato:200
};

export function generateSparkline(base: number, days = 14) {
  return Array.from({ length:days }, (_, i) => ({
    day: i+1,
    value: Math.round(base * (1 + (Math.random()-0.5)*0.06))
  }));
}

export const WEATHER_CODES: Record<number, { label:string; icon:string }> = {
  800: { label:"Clear Sky",       icon:"☀️" },
  801: { label:"Few Clouds",      icon:"🌤️" },
  802: { label:"Partly Cloudy",   icon:"⛅" },
  803: { label:"Mostly Cloudy",   icon:"🌥️" },
  804: { label:"Overcast",        icon:"☁️" },
  500: { label:"Light Rain",      icon:"🌧️" },
  501: { label:"Moderate Rain",   icon:"🌧️" },
  502: { label:"Heavy Rain",      icon:"⛈️" },
  200: { label:"Thunderstorm",    icon:"⛈️" },
  600: { label:"Light Snow",      icon:"🌨️" },
  741: { label:"Foggy",           icon:"🌫️" },
};

export function getHealthColor(value: number): string {
  if (value >= 80) return "#95D5B2";
  if (value >= 60) return "#E9A319";
  if (value >= 40) return "#F4A460";
  return "#C0392B";
}

export function getMoistureStatus(moisture: number): { label:string; color:string } {
  if (moisture >= 70) return { label:"Optimal",  color:"#95D5B2" };
  if (moisture >= 50) return { label:"Good",      color:"#52B788" };
  if (moisture >= 30) return { label:"Low",       color:"#E9A319" };
  return                     { label:"Critical",  color:"#C0392B" };
}

export const MANDI_DATA = [
  { name:"Azadpur APMC",    location:"Delhi",          crops:["wheat","potato","onion"] },
  { name:"Vashi APMC",      location:"Mumbai",         crops:["rice","tomato","onion"] },
  { name:"Koyambedu",       location:"Chennai",        crops:["rice","cotton","tomato"] },
  { name:"Guntur Market",   location:"Andhra Pradesh", crops:["cotton","maize","onion"] },
  { name:"Ludhiana Mandi",  location:"Punjab",         crops:["wheat","maize","potato"] },
  { name:"Yeshwantpur",     location:"Bengaluru",      crops:["tomato","rice","maize"] },
];
