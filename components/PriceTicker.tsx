"use client";
import { useEffect, useState } from "react";
import { TrendingUp, TrendingDown } from "lucide-react";
import { CROPS, getLivePrices } from "@/lib/utils";

export default function PriceTicker() {
  const [prices, setPrices] = useState<Record<string,any>>({});

  useEffect(() => {
    setPrices(getLivePrices());
    const iv = setInterval(() => setPrices(getLivePrices()), 60000);
    return () => clearInterval(iv);
  }, []);

  const items = Object.entries(CROPS).map(([key, data]) => ({
    key, ...data, price: prices[key]?.current || data.base, change: prices[key]?.changePercent || 0
  }));

  const ticker = [...items, ...items];

  return (
    <div className="bg-loam/50 border-y border-bark/40 py-2 overflow-hidden relative">
      <div className="flex items-center gap-4 animate-ticker" style={{ width:"max-content" }}>
        {ticker.map((item, i) => (
          <div key={i} className="flex items-center gap-2 px-4 border-r border-bark/30 flex-shrink-0">
            <span className="text-base">{item.emoji}</span>
            <span className="font-display text-xs text-parchment tracking-wider">{item.key.toUpperCase()}</span>
            <span className="font-data text-sm text-amber">₹{item.price.toLocaleString("en-IN")}</span>
            <span className={`flex items-center gap-0.5 font-data text-[10px] ${item.change >= 0 ? "text-fern" : "text-rust"}`}>
              {item.change >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
              {Math.abs(item.change).toFixed(1)}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
