"use client";

import { useEffect, useState } from "react";
import { ArrowUp, ArrowDown } from "lucide-react";

const commodities = [
  { name: "WHEAT", price: 2150, change: 2.3, emoji: "🌾" },
  { name: "RICE", price: 1940, change: 0.8, emoji: "🍚" },
  { name: "MAIZE", price: 1890, change: -1.2, emoji: "🌽" },
  { name: "SOYBEAN", price: 4200, change: 3.1, emoji: "🫘" },
  { name: "ONION", price: 840, change: -4.5, emoji: "🧅" },
  { name: "TOMATO", price: 1200, change: 12.4, emoji: "🍅" },
  { name: "COTTON", price: 6620, change: 1.5, emoji: "🧶" },
  { name: "POTATO", price: 950, change: -0.8, emoji: "🥔" },
];

export default function PriceTicker() {
  const [prices, setPrices] = useState(commodities);

  useEffect(() => {
    const interval = setInterval(() => {
      setPrices((prev) =>
        prev.map((c) => {
          const drift = (Math.random() - 0.5) * 0.02;
          const newPrice = Math.round(c.price * (1 + drift));
          const change = ((newPrice - c.price) / c.price) * 100;
          return { ...c, price: newPrice, change: parseFloat(change.toFixed(1)) };
        })
      );
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  const tickerContent = [...prices, ...prices].map((c, i) => (
    <span key={i} className="inline-flex items-center gap-2 mx-6 whitespace-nowrap">
      <span>{c.emoji}</span>
      <span className="text-parchment font-data">{c.name}</span>
      <span className="font-data font-bold">₹{c.price.toLocaleString("en-IN")}/qtl</span>
      <span className={`flex items-center gap-0.5 font-data text-sm ${c.change >= 0 ? "text-leaf" : "text-rust"}`}>
        {c.change >= 0 ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />}
        {Math.abs(c.change)}%
      </span>
      <span className="text-bark">•</span>
    </span>
  ));

  return (
    <div className="w-full bg-[#0D0800] border-y border-bark overflow-hidden py-3">
      <div className="animate-ticker flex whitespace-nowrap hover:[animation-play-state:paused]">
        {tickerContent}
      </div>
    </div>
  );
}
