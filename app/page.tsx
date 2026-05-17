"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { ChevronDown, ArrowRight, TrendingUp, Sprout, Droplets, Sun, Bug, BarChart3, CloudRain, Tractor } from "lucide-react";
import LeafParticles from "@/components/LeafParticles";
import StatCounter from "@/components/StatCounter";
import GreenCard from "@/components/GreenCard";
import PriceTicker from "@/components/PriceTicker";

const features = [
  { icon: Droplets, title: "SOIL INTELLIGENCE", description: "Live NPK + moisture across all plots", size: "large", color: "from-moss/20 to-transparent" },
  { icon: Sun, title: "7-DAY FORECAST", description: "Hyper-local farm weather predictions", size: "small", color: "from-amber/20 to-transparent" },
  { icon: Bug, title: "PEST DETECTION", description: "AI-assisted early warning system", size: "small", color: "from-rust/20 to-transparent" },
  { icon: TrendingUp, title: "LIVE MARKET PRICES", description: "MSP + mandi rates updated every hour", size: "small", color: "from-amber/20 to-transparent" },
  { icon: Sprout, title: "GROWTH TRACKER", description: "Stage-by-stage lifecycle monitoring", size: "small", color: "from-fern/20 to-transparent" },
  { icon: BarChart3, title: "YIELD ANALYTICS", description: "Forecast vs actual harvest comparison", size: "large", color: "from-leaf/20 to-transparent" },
];

const testimonials = [
  { quote: "TERRA helped me increase my wheat yield by 23% in one season. The soil alerts saved my crop during the dry spell.", name: "Ramesh Kumar", location: "Maharashtra", crop: "Wheat Farmer" },
  { quote: "I no longer guess when to irrigate. The moisture gauges tell me exactly when each plot needs water.", name: "Lakshmi Devi", location: "Telangana", crop: "Rice Farmer" },
  { quote: "The market price alerts helped me sell my soybean at the perfect time. Earned ₹18,000 more than last season.", name: "Harpreet Singh", location: "Punjab", crop: "Soybean Farmer" },
];

const seasonCrops = [
  { name: "Rice", type: "Kharif", start: 5, end: 10, color: "bg-amber" },
  { name: "Cotton", type: "Kharif", start: 5, end: 11, color: "bg-amber" },
  { name: "Soybean", type: "Kharif", start: 6, end: 10, color: "bg-amber" },
  { name: "Wheat", type: "Rabi", start: 10, end: 3, color: "bg-leaf" },
  { name: "Barley", type: "Rabi", start: 10, end: 3, color: "bg-leaf" },
  { name: "Mustard", type: "Rabi", start: 10, end: 2, color: "bg-leaf" },
  { name: "Watermelon", type: "Zaid", start: 2, end: 5, color: "bg-wheat" },
  { name: "Cucumber", type: "Zaid", start: 2, end: 5, color: "bg-wheat" },
];

export default function LandingPage() {
  const [weather, setWeather] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 0.5], [1, 0.95]);

  useEffect(() => {
    fetch("/api/weather?type=current").then((r) => r.json()).then((data) => { setWeather(data); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  return (
    <div className="relative overflow-hidden">
      <LeafParticles />
      <motion.section ref={heroRef} style={{ opacity: heroOpacity, scale: heroScale }} className="relative min-h-screen flex items-center justify-center pt-16">
        <div className="absolute inset-0 overflow-hidden">
          <svg className="absolute inset-0 w-full h-full opacity-20" viewBox="0 0 800 500">
            {Array.from({ length: 40 }, (_, i) => {
              const row = Math.floor(i / 8), col = i % 8, x = col * 100 + 10, y = row * 100 + 10, delay = row * 200;
              return (
                <motion.rect key={i} x={x} y={y} width="80" height="80" rx="4" fill="#2C1A0A" stroke="#3D2410" strokeWidth="2"
                  initial={{ opacity: 0, scale: 0.1 }} animate={{ opacity: 0.8, scale: 1 }} transition={{ delay: delay / 1000, duration: 0.6, type: "spring" }}>
                  <animate attributeName="opacity" values="0.8;1;0.8" dur="3s" repeatCount="indefinite" />
                </motion.rect>
              );
            })}
            {Array.from({ length: 40 }, (_, i) => {
              const row = Math.floor(i / 8), col = i % 8, x = col * 100 + 50, y = row * 100 + 50, delay = row * 200 + 300;
              const colors = ["#95D5B2", "#E9A319", "#F5E6C8", "#F4D03F"];
              return (
                <motion.circle key={`crop-${i}`} cx={x} cy={y} r="0" fill={colors[i % 4]}
                  initial={{ r: 0 }} animate={{ r: 25 }} transition={{ delay: delay / 1000, duration: 0.8, type: "spring" }} />
              );
            })}
          </svg>
          <div className="absolute inset-0 bg-gradient-to-t from-void via-transparent to-transparent" />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto px-4 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-moss/20 border border-moss/50 mb-8">
            <span className="w-2 h-2 rounded-full bg-leaf animate-pulse" />
            <span className="font-data text-[11px] tracking-[0.2em] text-fern uppercase">TERRA v1.0 // SEASON: KHARIF 2026</span>
          </motion.div>

          <div className="space-y-2 mb-6">
            <motion.h1 initial={{ x: -100, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ duration: 0.8 }}
              className="font-display text-5xl md:text-7xl lg:text-8xl font-bold text-parchment">INTELLIGENT</motion.h1>
            <motion.h1 initial={{ x: 100, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ duration: 0.8, delay: 0.15 }}
              className="font-display text-5xl md:text-7xl lg:text-8xl font-bold text-amber" style={{ textShadow: "0 4px 30px rgba(45,106,79,0.5)" }}>FARMING</motion.h1>
            <motion.h1 initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.8, delay: 0.3 }}
              className="font-display text-5xl md:text-7xl lg:text-8xl font-bold text-parchment">STARTS HERE</motion.h1>
          </div>

          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
            className="font-data text-sm md:text-base text-clay max-w-2xl mx-auto mb-8">
            Real-time soil intelligence. Predictive weather. Live market prices.<br className="hidden md:block" />
            From Soil to Sale. Every Seed. Every Season. Every Decision.
          </motion.p>

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}
            className="inline-flex items-center gap-4 px-6 py-3 rounded-full glass-card mb-10">
            {loading ? (
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 border-2 border-amber border-t-transparent rounded-full animate-spin" />
                <span className="font-data text-sm text-clay">Loading weather...</span>
              </div>
            ) : weather ? (
              <>
                <img src={`https://openweathermap.org/img/wn/${weather.weather?.[0]?.icon}@2x.png`} alt="weather" className="w-10 h-10" />
                <div className="text-left">
                  <div className="font-accent text-2xl text-amber">{Math.round(weather.main?.temp)}°C</div>
                  <div className="font-data text-[10px] text-clay uppercase">{weather.weather?.[0]?.description} • FARM WEATHER</div>
                </div>
              </>
            ) : (
              <span className="font-data text-sm text-clay">Weather data unavailable</span>
            )}
          </motion.div>

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9 }} className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/dashboard" className="group flex items-center gap-2 px-8 py-4 bg-moss hover:bg-fern text-parchment rounded-md font-display text-sm tracking-[0.15em] transition-all hover:scale-105">
              ENTER FARM COMMAND<ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link href="/market" className="flex items-center gap-2 px-8 py-4 border border-moss text-fern hover:bg-moss hover:text-parchment rounded-md font-display text-sm tracking-[0.15em] transition-all">
              <TrendingUp className="w-4 h-4" />LIVE MARKET
            </Link>
          </motion.div>
        </div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2, repeat: Infinity, repeatType: "reverse", duration: 1.5 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
          <span className="font-data text-[10px] tracking-widest text-clay">SCROLL TO EXPLORE</span>
          <ChevronDown className="w-5 h-5 text-clay animate-bounce" />
        </motion.div>
      </motion.section>

      <section className="relative z-10 bg-[#1A1000] border-y border-bark py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 divide-x divide-bark/50">
            <StatCounter end={24000000} prefix="₹" label="REVENUE TRACKED" />
            <StatCounter end={12} label="DISTRICTS" />
            <StatCounter end={99.2} suffix="%" decimals={1} label="FORECAST ACCURACY" />
            <StatCounter end={47} label="COMMODITIES MONITORED" />
          </div>
        </div>
      </section>

      <section className="relative z-10 py-24 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
            <h2 className="font-display text-3xl md:text-5xl text-parchment mb-4">Platform Intelligence</h2>
            <p className="font-data text-clay">Every tool you need, unified in one command center</p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 auto-rows-[200px]">
            {features.map((feature, i) => (
              <motion.div key={feature.title} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                className={i === 0 || i === 5 ? "md:col-span-2 md:row-span-2" : ""}>
                <GreenCard className={`h-full bg-gradient-to-br ${feature.color} flex flex-col justify-between group`}>
                  <div>
                    <div className="w-12 h-12 rounded-lg bg-void/50 flex items-center justify-center mb-4 group-hover:bg-moss/20 transition-colors">
                      <feature.icon className="w-6 h-6 text-amber" />
                    </div>
                    <h3 className="font-display text-xl md:text-2xl text-parchment mb-2">{feature.title}</h3>
                    <p className="font-data text-sm text-clay">{feature.description}</p>
                  </div>
                  <div className="mt-4">
                    <Link href={feature.title.includes("SOIL") ? "/field-monitor" : feature.title.includes("FORECAST") ? "/weather" : feature.title.includes("PEST") ? "/field-monitor" : feature.title.includes("MARKET") ? "/market" : feature.title.includes("GROWTH") ? "/field-monitor" : "/dashboard"}
                      className="inline-flex items-center gap-1 text-amber font-data text-sm hover:underline">Explore <ArrowRight className="w-3 h-3" /></Link>
                  </div>
                </GreenCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="relative z-10 py-24 px-4 bg-soil/50">
        <div className="max-w-6xl mx-auto">
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="text-center mb-16">
            <h2 className="font-display text-3xl md:text-5xl text-parchment mb-4">How TERRA Works</h2>
            <p className="font-data text-clay">Three steps to data-driven farming</p>
          </motion.div>
          <div className="grid md:grid-cols-3 gap-8 relative">
            {[
              { step: "01", title: "CONNECT YOUR FARM", desc: "Add your plots, crops, and sensor data. No hardware required — start with manual entry or connect IoT sensors.", icon: Tractor },
              { step: "02", title: "MONITOR IN REAL-TIME", desc: "Weather, soil, pests — all live on one screen. Get alerts before problems become disasters.", icon: CloudRain },
              { step: "03", title: "MAXIMIZE YIELD", desc: "Data-driven decisions from planting to sale. Know exactly when to irrigate, fertilize, and harvest.", icon: Sprout },
            ].map((item, i) => (
              <motion.div key={item.step} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.2 }} className="relative">
                <div className="flex flex-col items-center text-center">
                  <div className="w-20 h-20 rounded-full border-2 border-moss flex items-center justify-center mb-6 relative bg-void">
                    <span className="font-accent text-3xl text-amber">{item.step}</span>
                    <div className="absolute inset-0 rounded-full border border-moss animate-pulse-glow" />
                  </div>
                  <div className="w-16 h-16 rounded-xl bg-moss/10 flex items-center justify-center mb-4">
                    <item.icon className="w-8 h-8 text-fern" />
                  </div>
                  <h3 className="font-display text-xl text-parchment mb-3">{item.title}</h3>
                  <p className="font-data text-sm text-clay leading-relaxed">{item.desc}</p>
                </div>
                {i < 2 && (
                  <div className="hidden md:block absolute top-10 left-[60%] w-[80%] h-[2px]">
                    <svg className="w-full h-2" viewBox="0 0 200 2">
                      <motion.line x1="0" y1="1" x2="200" y2="1" stroke="#2D6A4F" strokeWidth="2" strokeDasharray="8 4"
                        initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true }} transition={{ duration: 1, delay: 0.5 }} />
                    </svg>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <PriceTicker />

      <section className="relative z-10 py-24 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="text-center mb-12">
            <h2 className="font-display text-3xl md:text-4xl text-parchment mb-4">Crop Calendar 2026</h2>
            <p className="font-data text-clay">Indian agricultural seasons at a glance</p>
          </motion.div>
          <div className="glass-card p-6 overflow-x-auto">
            <div className="min-w-[800px]">
              <div className="grid grid-cols-12 gap-1 mb-4">
                {["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"].map((m) => (
                  <div key={m} className="text-center font-data text-xs text-clay py-2">{m}</div>
                ))}
              </div>
              <div className="space-y-3">
                {seasonCrops.map((crop) => (
                  <div key={crop.name} className="grid grid-cols-12 gap-1 items-center group">
                    <div className="col-span-2 font-data text-sm text-parchment">{crop.name}</div>
                    <div className="col-span-10 relative h-8 bg-void/50 rounded overflow-hidden">
                      <motion.div initial={{ width: 0 }} whileInView={{ width: `${((crop.end - crop.start + 1) / 12) * 100}%` }} viewport={{ once: true }} transition={{ duration: 1, delay: 0.3 }}
                        className={`absolute h-full ${crop.color} rounded opacity-80 group-hover:opacity-100 transition-opacity`}
                        style={{ left: `${((crop.start - 1) / 12) * 100}%` }} />
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <span className="font-data text-[10px] bg-void px-2 py-1 rounded text-parchment">{crop.type} • Sow: {crop.start} • Harvest: {crop.end}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex items-center gap-6 mt-6 justify-center font-data text-xs">
              <span className="flex items-center gap-2"><span className="w-3 h-3 rounded bg-amber" /> Kharif (Jun–Nov)</span>
              <span className="flex items-center gap-2"><span className="w-3 h-3 rounded bg-leaf" /> Rabi (Nov–Apr)</span>
              <span className="flex items-center gap-2"><span className="w-3 h-3 rounded bg-wheat" /> Zaid (Mar–Jun)</span>
            </div>
          </div>
        </div>
      </section>

      <section className="relative z-10 py-24 px-4 bg-soil/30">
        <div className="max-w-7xl mx-auto">
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="text-center mb-16">
            <h2 className="font-display text-3xl md:text-4xl text-parchment mb-4">Farmer Stories</h2>
          </motion.div>
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.15 }}
                className="glass-card p-8 border-l-4 border-l-amber relative">
                <div className="text-amber text-4xl font-accent mb-4">"</div>
                <p className="font-display text-lg text-parchment/90 italic mb-6 leading-relaxed">{t.quote}</p>
                <div className="border-t border-bark pt-4">
                  <p className="font-data text-sm text-parchment font-bold">{t.name}</p>
                  <p className="font-data text-xs text-clay">{t.location} • {t.crop}</p>
                </div>
                <div className="flex gap-1 mt-3">
                  {[1, 2, 3, 4, 5].map((star) => <div key={star} className="w-2 h-2 rounded-full bg-amber" />)}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="relative z-10 py-24 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} className="glass-card p-12 border border-moss/30">
            <h2 className="font-display text-3xl md:text-5xl text-parchment mb-6">Ready to Transform Your Farm?</h2>
            <p className="font-data text-clay mb-8 max-w-xl mx-auto">
              Join thousands of farmers already using TERRA to increase yields, reduce costs, and sell at the right price.
              No credit card. No login. Just open and grow.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/dashboard" className="px-8 py-4 bg-moss hover:bg-fern text-parchment rounded-md font-display tracking-wider transition-all hover:scale-105">LAUNCH TERRA NOW</Link>
              <Link href="/contact" className="px-8 py-4 border border-bark hover:border-amber text-clay hover:text-amber rounded-md font-display tracking-wider transition-all">TALK TO TEAM</Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}