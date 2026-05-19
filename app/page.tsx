"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { ChevronDown, ArrowRight, TrendingUp, Sprout, Droplets, Sun, Bug, BarChart3, CloudRain, Tractor, Zap, Shield, Globe, CheckCircle2, Star } from "lucide-react";
import PriceTicker from "@/components/PriceTicker";
import StatCounter from "@/components/StatCounter";
import GreenCard from "@/components/GreenCard";
import { getLivePrices, CROPS } from "@/lib/utils";

const features = [
  { icon:Droplets,   title:"SOIL INTELLIGENCE",   desc:"Live NPK + moisture across all plots. Automated irrigation triggers.", tag:"Real-time", size:"large", color:"from-[#2D6A4F20]" },
  { icon:Sun,        title:"7-DAY FORECAST",       desc:"Hyper-local farm weather predictions with rainfall probability.",          tag:"AI Powered", size:"small", color:"from-[#E9A31920]" },
  { icon:Bug,        title:"PEST DETECTION",       desc:"AI-assisted early warning system. Identifies 40+ common pests.",          tag:"ML Model",   size:"small", color:"from-[#C0392B20]" },
  { icon:TrendingUp, title:"LIVE MARKET PRICES",   desc:"MSP + mandi rates updated every hour across 600 mandis.",                tag:"Live",       size:"small", color:"from-[#E9A31920]" },
  { icon:Sprout,     title:"GROWTH TRACKER",       desc:"Stage-by-stage lifecycle monitoring with yield predictions.",             tag:"Smart",      size:"small", color:"from-[#52B78820]" },
  { icon:BarChart3,  title:"YIELD ANALYTICS",      desc:"Forecast vs actual harvest comparison with 94% accuracy.",                tag:"Analytics",  size:"large", color:"from-[#95D5B220]" },
];

const testimonials = [
  { quote:"TERRA helped me increase my wheat yield by 23% in one season. The soil alerts saved my crop during the dry spell.", name:"Ramesh Kumar",   location:"Maharashtra",     crop:"Wheat Farmer",    rating:5, img:"RK" },
  { quote:"I no longer guess when to irrigate. The moisture gauges tell me exactly when each plot needs water.",               name:"Lakshmi Devi",   location:"Telangana",       crop:"Rice Farmer",     rating:5, img:"LD" },
  { quote:"The market price alerts helped me sell soybean at the perfect time. Earned ₹18,000 more than last season.",         name:"Harpreet Singh", location:"Punjab",           crop:"Soybean Farmer",  rating:5, img:"HS" },
];

const seasonCrops = [
  { name:"Rice",       type:"Kharif", start:5,  end:10, color:"#E9A319" },
  { name:"Cotton",     type:"Kharif", start:5,  end:11, color:"#E9A319" },
  { name:"Soybean",    type:"Kharif", start:6,  end:10, color:"#F4D03F" },
  { name:"Wheat",      type:"Rabi",   start:10, end:3,  color:"#52B788" },
  { name:"Barley",     type:"Rabi",   start:10, end:3,  color:"#52B788" },
  { name:"Mustard",    type:"Rabi",   start:10, end:2,  color:"#95D5B2" },
  { name:"Watermelon", type:"Zaid",   start:2,  end:5,  color:"#8B5E3C" },
  { name:"Cucumber",   type:"Zaid",   start:2,  end:5,  color:"#8B5E3C" },
];

const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

const steps = [
  { n:"01", title:"CONNECT YOUR FARM",      desc:"Add your plots, crops, and sensor readings. No hardware required — start manually, scale to IoT.", icon:Tractor },
  { n:"02", title:"MONITOR IN REAL-TIME",   desc:"Weather, soil, pest alerts — all live on one screen. Get notified before problems become disasters.", icon:CloudRain },
  { n:"03", title:"MAXIMIZE YOUR YIELD",    desc:"Data-driven decisions from planting to sale. Know exactly when to irrigate, fertilize, and harvest.", icon:Sprout },
];

export default function LandingPage() {
  const [prices, setPrices] = useState<Record<string,any>>({});
  const [currentTime, setCurrentTime] = useState(new Date());
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target:heroRef, offset:["start start","end start"] });
  const heroOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 80]);

  useEffect(() => {
    setPrices(getLivePrices());
    const tick = setInterval(() => { setPrices(getLivePrices()); setCurrentTime(new Date()); }, 60000);
    const clock = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => { clearInterval(tick); clearInterval(clock); };
  }, []);

  useEffect(() => {
    const iv = setInterval(() => setActiveTestimonial(p => (p+1)%testimonials.length), 5000);
    return () => clearInterval(iv);
  }, []);

  const cropBarWidth = (start: number, end: number) => {
    const len = end >= start ? end - start + 1 : (12 - start + 1) + end;
    return (len/12)*100;
  };
  const cropBarLeft = (start: number) => ((start-1)/12)*100;

  return (
    <div className="relative">
      {/* HERO */}
      <motion.section id="hero" ref={heroRef} style={{ opacity:heroOpacity, y:heroY }}
        className="relative min-h-screen flex items-center justify-center pt-24 overflow-hidden">

        {/* Background art */}
        <div className="absolute inset-0 overflow-hidden">
          {/* Animated field grid */}
          <svg className="absolute inset-0 w-full h-full" viewBox="0 0 1200 700" preserveAspectRatio="xMidYMid slice">
            <defs>
              <radialGradient id="fieldGlow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#2D6A4F" stopOpacity="0.15" />
                <stop offset="100%" stopColor="#2D6A4F" stopOpacity="0" />
              </radialGradient>
            </defs>
            {/* Crop field squares */}
            {Array.from({length:32}, (_,i) => {
              const row = Math.floor(i/8), col = i%8;
              const x = col*150+10, y = row*170+10;
              const colors = ["#2D6A4F","#3D7A5F","#1A4A35","#4D8A6F"];
              const c = colors[i%4];
              return (
                <motion.rect key={i} x={x} y={y} width={130} height={150} rx={6}
                  fill={c} fillOpacity={0.08} stroke={c} strokeOpacity={0.15} strokeWidth={1}
                  initial={{opacity:0,scale:0.8}} animate={{opacity:1,scale:1}}
                  transition={{delay:i*0.03, duration:0.8, type:"spring"}}>
                  <animate attributeName="fill-opacity" values="0.06;0.12;0.06" dur={`${3+i*0.2}s`} repeatCount="indefinite" />
                </motion.rect>
              );
            })}
            {/* Crop dots */}
            {Array.from({length:32}, (_,i) => {
              const row=Math.floor(i/8), col=i%8;
              const cx=col*150+75, cy=row*170+85;
              const cs=["#95D5B2","#E9A319","#F5E6C8","#52B788","#F4D03F"];
              return (
                <motion.circle key={`d${i}`} cx={cx} cy={cy} r={0} fill={cs[i%5]} fillOpacity={0.5}
                  initial={{r:0}} animate={{r:20}} transition={{delay:0.5+i*0.03, duration:0.8, type:"spring"}} />
              );
            })}
            <rect x="0" y="0" width="1200" height="700" fill="url(#fieldGlow)" />
          </svg>
          {/* Gradient overlays */}
          <div className="absolute inset-0 bg-gradient-to-t from-void via-void/70 to-void/20" />
          <div className="absolute inset-0 bg-gradient-to-r from-void/60 via-transparent to-void/60" />
        </div>

        {/* Hero content */}
        <div className="relative z-10 max-w-5xl mx-auto px-4 text-center">
          {/* Badge */}
          <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{delay:0.2}}
            className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-moss/15 border border-moss/40 mb-10 backdrop-blur-sm">
            <span className="status-dot" />
            <span className="font-data text-[11px] tracking-[0.25em] text-fern uppercase">TERRA v2.0 // KHARIF SEASON 2026</span>
          </motion.div>

          {/* Headline */}
          <div className="mb-6 overflow-hidden">
            {["INTELLIGENT","FARMING","STARTS HERE"].map((word,i) => (
              <motion.h1 key={word}
                initial={{y:80,opacity:0}} animate={{y:0,opacity:1}}
                transition={{delay:0.3+i*0.15, duration:0.8, type:"spring", damping:20}}
                className={`block font-display font-bold leading-none ${i===1?"text-amber text-glow-amber":"text-parchment"}`}
                style={{fontSize:"clamp(48px,8vw,100px)"}}>
                {word}
              </motion.h1>
            ))}
          </div>

          <motion.p initial={{opacity:0}} animate={{opacity:1}} transition={{delay:0.8}}
            className="font-data text-sm md:text-base text-clay max-w-xl mx-auto mb-8 leading-relaxed">
            Real-time soil intelligence · Predictive weather · Live mandi prices<br />
            <span className="text-parchment/60">From Soil to Sale — Every Seed, Every Season, Every Decision.</span>
          </motion.p>

          {/* Live time display */}
          <motion.div initial={{opacity:0}} animate={{opacity:1}} transition={{delay:1.0}}
            className="inline-flex items-center gap-4 px-6 py-3 rounded-xl glass-card mb-10 border-moss/20">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-fern animate-pulse" />
              <span className="font-data text-xs text-clay">LIVE</span>
            </div>
            <div className="w-px h-6 bg-bark" />
            <div className="font-data text-sm text-parchment tabular-nums">
              {currentTime.toLocaleTimeString("en-IN", { hour:"2-digit", minute:"2-digit", second:"2-digit" })}
            </div>
            <div className="w-px h-6 bg-bark" />
            <div className="font-data text-xs text-clay">
              {currentTime.toLocaleDateString("en-IN", { day:"numeric", month:"short", year:"numeric" })}
            </div>
          </motion.div>

          {/* CTAs */}
          <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{delay:1.1}}
            className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/dashboard"
              className="group relative flex items-center gap-3 px-8 py-4 bg-moss hover:bg-fern text-parchment rounded-xl font-display text-sm tracking-[0.12em] transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-moss/30 overflow-hidden">
              <span className="relative z-10 flex items-center gap-2">ENTER FARM COMMAND <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" /></span>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent to-fern/20 opacity-0 group-hover:opacity-100 transition-opacity" />
            </Link>
            <Link href="/market"
              className="flex items-center gap-2 px-8 py-4 border border-moss/50 hover:border-amber text-fern hover:text-amber rounded-xl font-display text-sm tracking-[0.12em] transition-all duration-300 backdrop-blur-sm">
              <TrendingUp className="w-4 h-4" /> LIVE MARKET PRICES
            </Link>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div initial={{opacity:0}} animate={{opacity:1}} transition={{delay:1.5}}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
          <span className="font-data text-[10px] tracking-[0.25em] text-clay uppercase">Scroll to Explore</span>
          <ChevronDown className="w-4 h-4 text-clay animate-bounce" />
        </motion.div>
      </motion.section>

      {/* STATS BAR */}
      <section className="relative z-10 bg-loam/60 border-y border-bark/50 py-10">
        <div className="max-w-5xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 divide-x divide-bark/30">
            <StatCounter end={24000000} prefix="₹" label="Revenue Tracked" />
            <StatCounter end={12}       label="Districts Active" />
            <StatCounter end={99.2}     suffix="%" decimals={1} label="Forecast Accuracy" />
            <StatCounter end={47}       label="Commodities Monitored" />
          </div>
        </div>
      </section>

      {/* PRICE TICKER */}
      <PriceTicker />

      {/* FEATURES BENTO GRID */}
      <section id="features" className="relative z-10 py-28 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div initial={{opacity:0,y:20}} whileInView={{opacity:1,y:0}} viewport={{once:true}}
            className="mb-16">
            <div className="section-line" />
            <h2 className="font-display text-4xl md:text-6xl text-parchment mb-4 leading-none">Platform<br /><span className="text-amber">Intelligence</span></h2>
            <p className="font-data text-sm text-clay max-w-md">Every tool you need, unified in one command center. No subscriptions. No hardware required.</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4" style={{gridAutoRows:"minmax(180px,auto)"}}>
            {features.map((f, i) => {
              const Icon = f.icon;
              const isLarge = i === 0 || i === 5;
              return (
                <motion.div key={f.title} initial={{opacity:0,y:30}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{delay:i*0.08}}
                  className={isLarge ? "md:col-span-2 md:row-span-2" : ""}>
                  <GreenCard className={`h-full bg-gradient-to-br ${f.color} to-transparent flex flex-col justify-between group cursor-pointer`}>
                    <div>
                      <div className="flex items-start justify-between mb-4">
                        <div className="w-11 h-11 rounded-xl bg-void/60 flex items-center justify-center group-hover:bg-moss/20 transition-colors border border-bark/40">
                          <Icon className="w-5 h-5 text-amber" />
                        </div>
                        <span className="font-data text-[10px] tracking-widest text-clay border border-bark/60 px-2 py-1 rounded-full">{f.tag}</span>
                      </div>
                      <h3 className={`font-display text-parchment mb-2 ${isLarge ? "text-2xl" : "text-lg"}`}>{f.title}</h3>
                      <p className="font-data text-xs text-clay leading-relaxed">{f.desc}</p>
                    </div>
                    <div className="mt-4 flex items-center gap-1 text-amber font-data text-xs opacity-0 group-hover:opacity-100 transition-opacity">
                      <Link href={i<2?"/dashboard":i<4?"/market":"/field-monitor"}>Explore feature</Link>
                      <ArrowRight className="w-3 h-3" />
                    </div>
                  </GreenCard>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how-it-works" className="relative z-10 py-28 px-4 bg-loam/20">
        <div className="max-w-5xl mx-auto">
          <motion.div initial={{opacity:0}} whileInView={{opacity:1}} viewport={{once:true}} className="text-center mb-20">
            <div className="section-line mx-auto" />
            <h2 className="font-display text-4xl md:text-5xl text-parchment mb-4">How TERRA Works</h2>
            <p className="font-data text-sm text-clay">Three steps to data-driven farming</p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 relative">
            {steps.map((s, i) => (
              <motion.div key={s.n} initial={{opacity:0,y:30}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{delay:i*0.2}}
                className="relative text-center">
                {i < 2 && (
                  <div className="hidden md:block absolute top-12 left-[65%] w-[70%] overflow-hidden">
                    <motion.div initial={{width:0}} whileInView={{width:"100%"}} viewport={{once:true}} transition={{delay:0.5+i*0.3, duration:0.8}}
                      className="h-px bg-gradient-to-r from-moss to-transparent" />
                  </div>
                )}
                <div className="relative inline-flex items-center justify-center w-24 h-24 mb-6">
                  <div className="absolute inset-0 rounded-full border-2 border-moss/40 animate-pulse-glow" />
                  <div className="absolute inset-2 rounded-full bg-void/80 border border-bark flex items-center justify-center">
                    <span className="font-accent text-3xl text-amber">{s.n}</span>
                  </div>
                </div>
                <div className="w-14 h-14 rounded-xl bg-moss/10 border border-moss/20 flex items-center justify-center mx-auto mb-5">
                  <s.icon className="w-7 h-7 text-fern" />
                </div>
                <h3 className="font-display text-lg text-parchment mb-3">{s.title}</h3>
                <p className="font-data text-xs text-clay leading-relaxed">{s.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* LIVE PRICES PREVIEW */}
      <section id="market-preview" className="relative z-10 py-28 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div initial={{opacity:0}} whileInView={{opacity:1}} viewport={{once:true}} className="flex flex-col md:flex-row items-start md:items-end justify-between mb-12 gap-6">
            <div>
              <div className="section-line" />
              <h2 className="font-display text-4xl md:text-5xl text-parchment mb-3">Live Market <span className="text-amber">Rates</span></h2>
              <p className="font-data text-xs text-clay">MSP + mandi rates updated every 60 seconds</p>
            </div>
            <Link href="/market" className="flex items-center gap-2 font-data text-xs text-fern hover:text-amber transition-colors">
              Full market analysis <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {Object.entries(CROPS).slice(0,8).map(([key, data], i) => {
              const p = prices[key];
              const isUp = (p?.change || 0) >= 0;
              return (
                <motion.div key={key} initial={{opacity:0,y:20}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{delay:i*0.06}}>
                  <GreenCard className="p-4 cursor-pointer hover:border-amber/50 transition-all" hover>
                    <div className="flex justify-between items-start mb-3">
                      <span className="text-2xl">{data.emoji}</span>
                      <span className={`font-data text-[10px] px-1.5 py-0.5 rounded ${isUp ? "bg-fern/10 text-fern" : "bg-rust/10 text-rust"}`}>
                        {isUp?"▲":"▼"} {Math.abs(p?.changePercent||0).toFixed(1)}%
                      </span>
                    </div>
                    <div className="font-display text-sm text-parchment uppercase mb-1">{key}</div>
                    <div className="font-accent text-2xl text-amber">₹{(p?.current||data.base).toLocaleString("en-IN")}</div>
                    {data.msp > 0 && (
                      <div className="font-data text-[10px] text-clay mt-1">MSP ₹{data.msp.toLocaleString("en-IN")}</div>
                    )}
                  </GreenCard>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CROP CALENDAR */}
      <section className="relative z-10 py-24 px-4 bg-loam/20">
        <div className="max-w-5xl mx-auto">
          <motion.div initial={{opacity:0}} whileInView={{opacity:1}} viewport={{once:true}} className="text-center mb-12">
            <h2 className="font-display text-4xl text-parchment mb-3">Crop Calendar 2026</h2>
            <p className="font-data text-xs text-clay">Indian agricultural seasons at a glance</p>
          </motion.div>
          <GreenCard className="overflow-x-auto" hover={false}>
            <div className="min-w-[700px]">
              {/* Month headers */}
              <div className="grid grid-cols-12 gap-1 mb-4">
                {months.map(m => (
                  <div key={m} className="text-center font-data text-[10px] text-clay py-2 border-b border-bark/30">{m}</div>
                ))}
              </div>
              <div className="space-y-3">
                {seasonCrops.map((crop, ci) => (
                  <motion.div key={crop.name} initial={{opacity:0,x:-20}} whileInView={{opacity:1,x:0}} viewport={{once:true}} transition={{delay:ci*0.08}}
                    className="grid grid-cols-12 gap-1 items-center group">
                    <div className="col-span-1" />
                    <div className="absolute -translate-x-20 font-data text-xs text-parchment w-16 text-right hidden" />
                    <div className="col-span-12 relative h-8 rounded overflow-hidden bg-void/40">
                      <div className="absolute left-0 top-0 bottom-0 flex items-center pl-3 z-10">
                        <span className="font-data text-[10px] text-parchment/60 group-hover:text-parchment transition-colors">{crop.name}</span>
                      </div>
                      <motion.div initial={{width:0}} whileInView={{width:`${cropBarWidth(crop.start,crop.end)}%`}} viewport={{once:true}} transition={{duration:1, delay:0.3+ci*0.06}}
                        className="absolute top-1 bottom-1 rounded-sm opacity-70 group-hover:opacity-90 transition-opacity flex items-center justify-end pr-2"
                        style={{ left:`${cropBarLeft(crop.start)}%`, background:`${crop.color}55`, border:`1px solid ${crop.color}60` }}>
                        <span className="font-data text-[9px] opacity-0 group-hover:opacity-100 transition-opacity" style={{color:crop.color}}>
                          {crop.type} • {months[crop.start-1]}–{months[(crop.end-1+12)%12]}
                        </span>
                      </motion.div>
                    </div>
                  </motion.div>
                ))}
              </div>
              <div className="flex items-center gap-6 mt-6 justify-center">
                {[{c:"#E9A319",l:"Kharif (Jun–Nov)"},{c:"#52B788",l:"Rabi (Nov–Apr)"},{c:"#8B5E3C",l:"Zaid (Mar–Jun)"}].map(x => (
                  <span key={x.l} className="flex items-center gap-2 font-data text-[10px] text-clay">
                    <span className="w-3 h-3 rounded" style={{background:x.c}} /> {x.l}
                  </span>
                ))}
              </div>
            </div>
          </GreenCard>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section id="testimonials" className="relative z-10 py-28 px-4">
        <div className="max-w-5xl mx-auto">
          <motion.div initial={{opacity:0}} whileInView={{opacity:1}} viewport={{once:true}} className="text-center mb-16">
            <div className="section-line mx-auto" />
            <h2 className="font-display text-4xl md:text-5xl text-parchment mb-3">Farmer Stories</h2>
            <p className="font-data text-xs text-clay">Real results from real farmers across India</p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <motion.div key={i} initial={{opacity:0,y:20}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{delay:i*0.12}}>
                <GreenCard className={`p-8 border-l-4 transition-all duration-300 ${activeTestimonial===i ? "border-l-amber shadow-lg shadow-amber/10" : "border-l-bark hover:border-l-moss"}`}>
                  <div className="flex gap-1 mb-4">
                    {[1,2,3,4,5].map(s => <Star key={s} className="w-3.5 h-3.5 fill-amber text-amber" />)}
                  </div>
                  <p className="font-display text-base text-parchment/90 italic mb-6 leading-relaxed">"{t.quote}"</p>
                  <div className="flex items-center gap-3 border-t border-bark/40 pt-4">
                    <div className="w-10 h-10 rounded-full bg-moss/20 border border-moss/40 flex items-center justify-center font-display text-sm text-amber">{t.img}</div>
                    <div>
                      <p className="font-data text-xs text-parchment font-bold">{t.name}</p>
                      <p className="font-data text-[10px] text-clay">{t.location} · {t.crop}</p>
                    </div>
                  </div>
                </GreenCard>
              </motion.div>
            ))}
          </div>

          {/* Dots */}
          <div className="flex justify-center gap-2 mt-8">
            {testimonials.map((_,i) => (
              <button key={i} onClick={() => setActiveTestimonial(i)}
                className={`w-2 h-2 rounded-full transition-all ${activeTestimonial===i ? "bg-amber w-6" : "bg-bark hover:bg-clay"}`} />
            ))}
          </div>
        </div>
      </section>

      {/* FEATURES CHECKLIST */}
      <section className="relative z-10 py-20 px-4 bg-loam/20">
        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div initial={{opacity:0,x:-30}} whileInView={{opacity:1,x:0}} viewport={{once:true}}>
              <div className="section-line" />
              <h2 className="font-display text-3xl md:text-4xl text-parchment mb-6">Everything your farm needs.<br /><span className="text-amber">Nothing you don't.</span></h2>
              <p className="font-data text-xs text-clay leading-relaxed mb-6">
                TERRA was built by agronomists and engineers specifically for Indian farming conditions. No generic dashboards. No irrelevant data.
              </p>
              <Link href="/dashboard" className="btn-primary">Start Farming Smart <ArrowRight className="w-4 h-4" /></Link>
            </motion.div>

            <motion.div initial={{opacity:0,x:30}} whileInView={{opacity:1,x:0}} viewport={{once:true}} className="space-y-3">
              {[
                "Real-time soil moisture & NPK monitoring",
                "7-day hyper-local weather forecasts",
                "Live MSP + mandi price alerts",
                "AI-powered pest early warning",
                "Automated irrigation scheduling",
                "Yield forecasting & profit calculator",
                "Full inventory management",
                "Farm activity calendar & reminders",
                "No login required — direct app access",
              ].map((item, i) => (
                <motion.div key={item} initial={{opacity:0,x:20}} whileInView={{opacity:1,x:0}} viewport={{once:true}} transition={{delay:i*0.05}}
                  className="flex items-center gap-3">
                  <CheckCircle2 className="w-4 h-4 text-fern flex-shrink-0" />
                  <span className="font-data text-xs text-parchment/80">{item}</span>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section id="cta" className="relative z-10 py-28 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div initial={{opacity:0,scale:0.95}} whileInView={{opacity:1,scale:1}} viewport={{once:true}}
            className="glass-card p-14 border border-moss/20 relative overflow-hidden">
            <div className="absolute inset-0 bg-mesh-1 opacity-50 pointer-events-none" />
            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber/10 border border-amber/30 mb-6">
                <Zap className="w-3.5 h-3.5 text-amber" />
                <span className="font-data text-[11px] text-amber tracking-wider">NO LOGIN REQUIRED</span>
              </div>
              <h2 className="font-display text-4xl md:text-6xl text-parchment mb-6 leading-tight">
                Ready to Transform<br />Your <span className="text-amber">Farm</span>?
              </h2>
              <p className="font-data text-sm text-clay mb-10 max-w-lg mx-auto leading-relaxed">
                Join thousands of farmers already using TERRA to increase yields, reduce costs, and sell at the right price. Open and grow — instantly.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/dashboard"
                  className="group flex items-center justify-center gap-2 px-10 py-4 bg-moss hover:bg-fern text-parchment rounded-xl font-display tracking-[0.1em] transition-all hover:scale-105 hover:shadow-xl hover:shadow-moss/30">
                  LAUNCH TERRA NOW <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link href="/contact"
                  className="flex items-center justify-center gap-2 px-10 py-4 border border-bark hover:border-amber text-clay hover:text-amber rounded-xl font-display tracking-[0.1em] transition-all">
                  TALK TO OUR TEAM
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
