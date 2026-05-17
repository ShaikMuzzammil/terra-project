"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Sprout, LayoutDashboard, CloudRain, Package, 
  TrendingUp, Calendar, Mail, Menu, X, ChevronRight 
} from "lucide-react";

const navLinks = [
  { href: "/", label: "Home", icon: Sprout },
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/field-monitor", label: "Fields", icon: Sprout },
  { href: "/weather", label: "Weather", icon: CloudRain },
  { href: "/inventory", label: "Inventory", icon: Package },
  { href: "/market", label: "Market", icon: TrendingUp },
  { href: "/calendar", label: "Calendar", icon: Calendar },
  { href: "/contact", label: "Contact", icon: Mail },
];

export default function Navigation() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-soil/90 backdrop-blur-lg border-b border-bark/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-8 h-8 rounded-full bg-moss flex items-center justify-center group-hover:bg-fern transition-colors">
                <Sprout className="w-5 h-5 text-parchment" />
              </div>
              <span className="font-display text-xl font-bold text-parchment tracking-wide">
                TERRA
              </span>
              <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded text-[10px] font-data bg-moss/20 text-fern border border-moss/30">
                v1.0
              </span>
            </Link>

            <div className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => {
                const Icon = link.icon;
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`relative px-3 py-2 rounded-md text-sm font-data transition-all ${
                      isActive 
                        ? "text-amber bg-amber/10" 
                        : "text-clay hover:text-parchment hover:bg-loam"
                    }`}
                  >
                    <span className="flex items-center gap-1.5">
                      <Icon className="w-4 h-4" />
                      {link.label}
                    </span>
                    {isActive && (
                      <motion.div
                        layoutId="activeNav"
                        className="absolute bottom-0 left-2 right-2 h-0.5 bg-amber"
                      />
                    )}
                  </Link>
                );
              })}
            </div>

            <Link
              href="/dashboard"
              className="hidden md:flex items-center gap-2 px-4 py-2 bg-moss hover:bg-fern text-parchment rounded-md font-display text-sm transition-all hover:scale-105"
            >
              Launch App
              <ChevronRight className="w-4 h-4" />
            </Link>

            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden p-2 text-parchment hover:bg-loam rounded-md"
            >
              {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </nav>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-40 bg-void/95 backdrop-blur-xl pt-20 md:hidden"
          >
            <div className="flex flex-col p-6 gap-2">
              {navLinks.map((link, i) => {
                const Icon = link.icon;
                return (
                  <motion.div
                    key={link.href}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                  >
                    <Link
                      href={link.href}
                      onClick={() => setMobileOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 rounded-lg text-parchment hover:bg-loam transition-colors"
                    >
                      <Icon className="w-5 h-5 text-amber" />
                      <span className="font-data">{link.label}</span>
                    </Link>
                  </motion.div>
                );
              })}
              <div className="mt-4 pt-4 border-t border-bark">
                <Link
                  href="/dashboard"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center justify-center gap-2 w-full py-3 bg-moss text-parchment rounded-lg font-display"
                >
                  Launch TERRA App
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
