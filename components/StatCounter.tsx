"use client";
import { useEffect, useRef, useState } from "react";

interface Props { end: number; prefix?: string; suffix?: string; decimals?: number; label: string; }

export default function StatCounter({ end, prefix="", suffix="", decimals=0, label }: Props) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !started.current) {
        started.current = true;
        const duration = 2000;
        const steps = 60;
        const step = end / steps;
        let current = 0;
        const timer = setInterval(() => {
          current = Math.min(current + step, end);
          setCount(current);
          if (current >= end) clearInterval(timer);
        }, duration / steps);
      }
    }, { threshold: 0.3 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [end]);

  const fmt = (n: number) => {
    if (n >= 1_000_000) return (n/1_000_000).toFixed(decimals ? decimals : 1)+"M";
    if (n >= 1_000) return (n/1_000).toFixed(decimals ? decimals : 0)+"K";
    return n.toFixed(decimals);
  };

  return (
    <div ref={ref} className="text-center px-4">
      <div className="font-accent text-3xl md:text-4xl text-amber mb-1 text-glow-amber">
        {prefix}{fmt(count)}{suffix}
      </div>
      <div className="font-data text-[10px] text-clay tracking-[0.2em] uppercase">{label}</div>
    </div>
  );
}
