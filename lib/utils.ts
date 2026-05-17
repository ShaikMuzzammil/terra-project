import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatNumber(num: number, decimals = 0): string {
  return new Intl.NumberFormat("en-IN", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(num);
}

export const CROPS = {
  wheat: { base: 2150, msp: 2015, unit: "qtl", emoji: "🌾" },
  rice: { base: 1940, msp: 1815, unit: "qtl", emoji: "🍚" },
  maize: { base: 1890, msp: 1760, unit: "qtl", emoji: "🌽" },
  soybean: { base: 4200, msp: 3950, unit: "qtl", emoji: "🫘" },
  onion: { base: 840, msp: 0, unit: "qtl", emoji: "🧅" },
  cotton: { base: 6620, msp: 6080, unit: "qtl", emoji: "🧶" },
  tomato: { base: 1200, msp: 0, unit: "qtl", emoji: "🍅" },
  potato: { base: 950, msp: 0, unit: "qtl", emoji: "🥔" },
};

export function getLivePrices() {
  return Object.entries(CROPS).reduce((acc, [crop, data]) => {
    const drift = (Math.random() - 0.5) * 0.02;
    const prevPrice = data.base * (1 + (Math.random() - 0.5) * 0.05);
    const current = Math.round(prevPrice * (1 + drift));
    const change = current - data.base;
    const changePercent = ((change / data.base) * 100).toFixed(1);
    return {
      ...acc,
      [crop]: {
        ...data,
        current,
        change,
        changePercent: parseFloat(changePercent),
        prevClose: prevPrice,
      },
    };
  }, {} as Record<string, any>);
}

export const DISTRICT_AVERAGES: Record<string, number> = {
  wheat: 42, rice: 55, maize: 48, soybean: 18, cotton: 15, onion: 180, tomato: 220, potato: 200,
};