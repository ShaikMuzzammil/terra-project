"use client";

import { useEffect, useRef, useState } from "react";
import { useInView } from "framer-motion";

interface StatCounterProps {
  end: number;
  prefix?: string;
  suffix?: string;
  duration?: number;
  decimals?: number;
  label: string;
}

export default function StatCounter({ end, prefix = "", suffix = "", duration = 2000, decimals = 0, label }: StatCounterProps) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (!isInView) return;
    let startTime: number;
    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      setCount(Math.floor(progress * end));
      if (progress < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, [isInView, end, duration]);

  return (
    <div ref={ref} className="text-center">
      <div className="font-accent text-4xl md:text-5xl text-amber mb-1">
        {prefix}{count.toLocaleString("en-IN")}{suffix}
      </div>
      <div className="font-data text-[10px] tracking-[0.2em] text-clay uppercase">{label}</div>
    </div>
  );
}
