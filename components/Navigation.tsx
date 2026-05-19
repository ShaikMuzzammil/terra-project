"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Sprout, LayoutDashboard, CloudRain, Package, TrendingUp, Calendar, Mail, Menu, X, ChevronRight, Home, Activity, Bell } from "lucide-react";
import { useFarmStore } from "@/lib/store";

const navLinks = [
  { href:"/",              label:"Home",      icon:Home,           section:"hero" },
  { href:"/dashboard",     label:"Dashboard", icon:LayoutDashboard },
  { href:"/field-monitor", label:"Fields",    icon:Sprout },
  { href:"/weather",       label:"Weather",   icon:CloudRain },
  { href:"/market",        label:"Market",    icon:TrendingUp },
  { href:"/inventory",     label:"Inventory", icon:Package },
  { href:"/calendar",      label:"Calendar",  icon:Calendar },
  { href:"/contact",       label:"Contact",   icon:Mail },
];

export default function Navigation() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("");
  const [showAlerts, setShowAlerts] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { alerts, dismissAlert } = useFarmStore();

  const activeAlerts = alerts.filter(a => !a.dismissed);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
      if (pathname === "/") {
        const sections = ["hero","features","how-it-works","market-preview","testimonials","cta"];
        for (const id of sections) {
          const el = document.getElementById(id);
          if (el) {
            const rect = el.getBoundingClientRect();
            if (rect.top <= 80 && rect.bottom >= 80) { setActiveSection(id); break; }
          }
        }
      }
    };
    window.addEventListener("scroll", handleScroll, { passive:true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [pathname]);

  const homeNavSections = [
    { id:"hero",           label:"Home" },
    { id:"features",       label:"Features" },
    { id:"how-it-works",   label:"How It Works" },
    { id:"market-preview", label:"Markets" },
    { id:"testimonials",   label:"Stories" },
  ];

  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior:"smooth", block:"start" });
    setMobileOpen(false);
  };

  const handleHome = () => { router.push("/"); setMobileOpen(false); };

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? "bg-soil/95 backdrop-blur-xl border-b border-bark/60 shadow-lg shadow-void/50" : "bg-soil/80 backdrop-blur-md border-b border-bark/30"}`}>
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16">

            {/* Logo */}
            <Link href="/" className="flex items-center gap-2.5 group flex-shrink-0">
              <div className="relative w-9 h-9 rounded-lg bg-gradient-to-br from-moss to-fern flex items-center justify-center shadow-lg group-hover:shadow-moss/40 transition-all duration-300">
                <Sprout className="w-5 h-5 text-parchment" />
                <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-moss to-fern opacity-0 group-hover:opacity-100 blur-sm transition-opacity" />
              </div>
              <div>
                <span className="font-display text-xl font-bold text-parchment tracking-widest block leading-none">TERRA</span>
                <span className="font-data text-[8px] text-clay tracking-[0.2em]">FARM INTELLIGENCE</span>
              </div>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden lg:flex items-center gap-0.5">
              {pathname === "/" ? (
                // Home page: section nav
                homeNavSections.map(sec => (
                  <button key={sec.id} onClick={() => scrollToSection(sec.id)}
                    className={`relative px-3 py-2 rounded-md font-data text-xs tracking-wide transition-all ${activeSection === sec.id ? "text-amber" : "text-clay hover:text-parchment"}`}>
                    {sec.label}
                    {activeSection === sec.id && (
                      <motion.div layoutId="navHighlight" className="absolute bottom-0 left-2 right-2 h-[2px] bg-amber rounded-full" />
                    )}
                  </button>
                ))
              ) : (
                navLinks.map(link => {
                  const Icon = link.icon;
                  const isActive = pathname === link.href || (link.href !== "/" && pathname.startsWith(link.href));
                  return (
                    <Link key={link.href} href={link.href}
                      className={`relative flex items-center gap-1.5 px-3 py-2 rounded-md font-data text-xs tracking-wide transition-all duration-200 ${isActive ? "text-amber bg-amber/8" : "text-clay hover:text-parchment hover:bg-loam/60"}`}>
                      <Icon className="w-3.5 h-3.5" />
                      {link.label}
                      {isActive && <motion.div layoutId="activeNav" className="absolute bottom-0 left-2 right-2 h-[2px] bg-amber rounded-full" />}
                    </Link>
                  );
                })
              )}
            </div>

            {/* Right side */}
            <div className="flex items-center gap-2">
              {/* Alert bell */}
              <div className="relative">
                <button onClick={() => setShowAlerts(!showAlerts)}
                  className="relative p-2 rounded-lg text-clay hover:text-amber hover:bg-loam/60 transition-all">
                  <Bell className="w-4 h-4" />
                  {activeAlerts.length > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-rust text-white text-[9px] rounded-full flex items-center justify-center font-data animate-pulse">
                      {activeAlerts.length}
                    </span>
                  )}
                </button>

                <AnimatePresence>
                  {showAlerts && (
                    <motion.div initial={{ opacity:0, y:8, scale:0.95 }} animate={{ opacity:1, y:0, scale:1 }} exit={{ opacity:0, y:8, scale:0.95 }}
                      className="absolute right-0 top-full mt-2 w-80 glass-card border-bark/80 overflow-hidden z-50"
                      style={{ background:"rgba(16,10,2,0.97)" }}>
                      <div className="flex items-center justify-between px-4 py-3 border-b border-bark/60">
                        <span className="font-display text-sm text-parchment">Farm Alerts</span>
                        <button onClick={() => { useFarmStore.getState().clearAllAlerts(); setShowAlerts(false); }}
                          className="font-data text-[10px] text-clay hover:text-amber transition-colors">CLEAR ALL</button>
                      </div>
                      <div className="max-h-72 overflow-y-auto">
                        {activeAlerts.length === 0 ? (
                          <div className="py-6 text-center font-data text-xs text-clay">No active alerts</div>
                        ) : activeAlerts.map(a => (
                          <div key={a.id} className={`flex items-start gap-3 px-4 py-3 border-b border-bark/30 alert-${a.severity}`}>
                            <span className="text-sm mt-0.5">{a.type==="weather"?"🌧":a.type==="pest"?"🐛":a.type==="price"?"📈":a.type==="irrigation"?"💧":"⚠️"}</span>
                            <div className="flex-1 min-w-0">
                              <p className="font-data text-xs text-parchment leading-relaxed">{a.message}</p>
                            </div>
                            <button onClick={() => dismissAlert(a.id)} className="text-clay hover:text-parchment mt-0.5 flex-shrink-0">
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Home button (visible on non-home pages) */}
              {pathname !== "/" && (
                <button onClick={handleHome}
                  className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-bark/60 text-clay hover:text-parchment hover:border-moss/50 font-data text-xs tracking-wide transition-all">
                  <Home className="w-3.5 h-3.5" />
                  Home
                </button>
              )}

              <Link href="/dashboard"
                className="hidden md:flex items-center gap-1.5 px-4 py-2 bg-moss hover:bg-fern text-parchment rounded-lg font-display text-xs tracking-[0.1em] transition-all hover:scale-105 hover:shadow-lg hover:shadow-moss/30">
                LAUNCH APP
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>

              {/* Mobile hamburger */}
              <button onClick={() => setMobileOpen(!mobileOpen)}
                className="lg:hidden p-2 rounded-lg text-clay hover:text-parchment hover:bg-loam/60 transition-all">
                {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Live status bar */}
        <div className="hidden sm:flex border-t border-bark/20 bg-void/50 px-6 py-1 items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5">
              <span className="status-dot" style={{background:"#95D5B2"}} />
              <span className="font-data text-[10px] text-fern tracking-widest">ALL SYSTEMS ACTIVE</span>
            </div>
            <span className="font-data text-[10px] text-bark">|</span>
            <span className="font-data text-[10px] text-clay">🌾 KHARIF 2026 // Day 47 of 120</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="font-data text-[10px] text-clay">6 PLOTS MONITORED</span>
            <span className="font-data text-[10px] text-amber">{activeAlerts.length} ACTIVE ALERTS</span>
          </div>
        </div>
      </nav>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
              className="fixed inset-0 z-40 bg-void/80 backdrop-blur-sm lg:hidden"
              onClick={() => setMobileOpen(false)} />
            <motion.div initial={{ x:"100%" }} animate={{ x:0 }} exit={{ x:"100%" }} transition={{ type:"spring", damping:25, stiffness:200 }}
              className="fixed top-0 right-0 bottom-0 z-50 w-72 bg-soil border-l border-bark lg:hidden overflow-y-auto">
              <div className="flex items-center justify-between p-4 border-b border-bark/60">
                <span className="font-display text-lg text-parchment">TERRA Menu</span>
                <button onClick={() => setMobileOpen(false)} className="text-clay hover:text-parchment">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="p-4 space-y-1">
                {navLinks.map(link => {
                  const Icon = link.icon;
                  const isActive = pathname === link.href;
                  return (
                    <Link key={link.href} href={link.href} onClick={() => setMobileOpen(false)}
                      className={`flex items-center gap-3 px-4 py-3 rounded-lg font-data text-sm transition-all ${isActive ? "bg-moss/20 text-amber border border-moss/30" : "text-clay hover:text-parchment hover:bg-loam/60"}`}>
                      <Icon className="w-4 h-4" />
                      {link.label}
                    </Link>
                  );
                })}
                <div className="pt-4 border-t border-bark/60">
                  <Link href="/dashboard" onClick={() => setMobileOpen(false)}
                    className="flex items-center justify-center gap-2 w-full py-3 bg-moss hover:bg-fern text-parchment rounded-lg font-display text-sm tracking-wider transition-all">
                    LAUNCH APP <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Click outside to close alerts */}
      {showAlerts && <div className="fixed inset-0 z-40" onClick={() => setShowAlerts(false)} />}
    </>
  );
}
