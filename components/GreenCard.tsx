"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface GreenCardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  onClick?: () => void;
}

export default function GreenCard({ children, className, hover = true, onClick }: GreenCardProps) {
  return (
    <motion.div
      whileHover={hover ? { y: -6, borderColor: "#2D6A4F" } : undefined}
      className={cn(
        "glass-card p-6 transition-colors",
        hover && "cursor-pointer",
        className
      )}
      onClick={onClick}
    >
      {children}
    </motion.div>
  );
}
