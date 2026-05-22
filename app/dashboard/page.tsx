"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Droplets, Activity, AlertTriangle, TrendingUp, CloudRain,
  Sprout, Plus, X, RefreshCw, ChevronRight, Play, Pause, Zap
} from "lucide-react";
import { useStore } from "@/lib/store";
import Card from "@/components/Card";
import { getHealthColor, getMoistureColor, getMoistureLabel, FORECAST } from "@/lib/utils";
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer, RadarChart,
  Radar, PolarGrid, PolarAngleAxis
} from "recharts";

const TT = { contentStyle:{background:"#fff",border:"1px solid #E2E8F0",borderRadius:"10px",fontFamily:"DM Sans",fontSize:"12px"} };

const RAIN = [
  {d:"Mon",r:12},{d:"Tue",r:0},{d:"Wed",r:45},{d:"Thu",r:8},{d:"Fri",r:0},{d:"Sat",r:22},{d:"Sun",r:5}
];
const TEMP = [
  {d:"Mon",hi:33,lo:23},{d:"Tue",hi:34,lo:23},{d:"Wed",hi:32,lo:22},{d:"Thu",hi:33,lo:23},
  {d:"Fri",hi:35,lo:24},{d:"Sat",hi:37,lo:25},{d:"Sun",hi:38,lo:27}
];

export default function Dashboard() {
  const { plots, notifications, irrigate, irrigateAll, toggleAutoIrr, farmName } = useStore();
  const [sel, setSel] = useState<string|null>(null);
  const [irr, setIrr] = useState<string|null>(null);
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const cl = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(cl);
  },[]);

  // Simulate live moisture drift
  useEffect(() => {
    const iv = setInterval(() => {
      plots.forEach(p => {
        useStore.getState().updateMoisture(p.id, Math.max(10, Math.min(92, p.moisture + (Math.random()-.5)*1.5)));
      });
    }, 20000);
    return () => clearInterval(iv);
  },[plots]);

  const selPlot = plots.find(p=>p.id===sel);
  const activeAlerts = notifications.filter(n=>!n.read).length;
  const lowMoisture = plots.filter(p=>p.moisture<40).length;
  const avgHealth = Math.round(plots.reduce((s,p)=>s+p.health,0)/plots.length);
  const totalAcres = plots.reduce((s,p)=>s+p.size,0).toFixed(1);

  const radarData = [
    {s:"Moisture", v:Math.round(plots.reduce((a,p)=>a+p.moisture,0)/plots.length)},
    {s:"Health",   v:avgHealth},
    {s:"Nutrition",v:78},
    {s:"Sunlight", v:88},
    {s:"Growth",   v:83},
    {s:"Yield Est",v:79},
  ];

  const doIrrigate = async (id:string) => {
    setIrr(id); irrigate(id); setTimeout(()=>setIrr(null),2000);
  };
  const doIrrigateAll = () => {
    setIrr("all"); irrigateAll(); setTimeout(()=>setIrr(null),2500);
  };

  return (
    <div className="pt-[88px] min-h-screen bg-slate-50">
      {/* Top status bar */}
      <div className="bg-brand-600 text-white px-6 py-2 flex items-center justify-between text-sm">
        <div className="flex items-center gap-3">
          <span className="dot-live" style={{background:"#A7F3D0"}}/>
          <span className="font-semibold">{farmName}</span>
          <span className="text-brand-200">·</span>
          <span className="text-brand-100">KHARIF 2026 · Day 47 of 120</span>
        </div>
        <div className="flex items-center gap-4 font-mono text-sm">
          {activeAlerts>0 && <span className="text-yellow-300 font-semibold">{activeAlerts} active alerts</span>}
          <span className="text-brand-200">{now.toLocaleTimeString("en-IN")}</span>
        </div>
      </div>

      <div className="container py-6 max-w-[1400px]">
        {/* Summary row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {[
            { label:"Total Acreage",  val:totalAcres+" ac",       icon:Sprout,        color:"text-brand-600 bg-brand-50 border-brand-100" },
            { label:"Avg Health",     val:avgHealth+"%",           icon:Activity,      color:`${avgHealth>75?"text-brand-600 bg-brand-50 border-brand-100":avgHealth>55?"text-amber-600 bg-amber-50 border-amber-100":"text-rose-600 bg-rose-50 border-rose-100"}` },
            { label:"Low Moisture",   val:lowMoisture+" plots",    icon:Droplets,      color:lowMoisture>0?"text-rose-600 bg-rose-50 border-rose-100":"text-brand-600 bg-brand-50 border-brand-100" },
            { label:"Unread Alerts",  val:activeAlerts+"",         icon:AlertTriangle, color:activeAlerts>2?"text-rose-600 bg-rose-50 border-rose-100":activeAlerts>0?"text-amber-600 bg-amber-50 border-amber-100":"text-brand-600 bg-brand-50 border-brand-100" },
          ].map((s,i) => (
            <motion.div key={s.label} initial={{opacity:0,y:16}} animate={{opacity:1,y:0}} transition={{delay:i*0.08}}>
              <div className={`card flex items-center gap-3 p-4 border ${s.color}`}>
                <s.icon className="w-6 h-6"/>
                <div>
                  <div className="text-2xl font-bold">{s.val}</div>
                  <div className="text-xs font-medium opacity-70">{s.label}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* Plot cards */}
          <div className="lg:col-span-3 space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="font-bold text-slate-800">Field Overview</h2>
              <button onClick={doIrrigateAll}
                className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-xl transition-all ${irr==="all"?"bg-brand-600 text-white":"bg-brand-50 text-brand-700 border border-brand-200 hover:bg-brand-100"}`}>
                {irr==="all" ? <><RefreshCw className="w-3 h-3 animate-spin"/>Irrigating…</> : <><Droplets className="w-3 h-3"/>Irrigate All</>}
              </button>
            </div>

            {plots.map((p, i) => {
              const mc = getMoistureColor(p.moisture);
              const hc = getHealthColor(p.health);
              return (
                <motion.div key={p.id} initial={{opacity:0,x:-16}} animate={{opacity:1,x:0}} transition={{delay:i*0.07}}
                  onClick={() => setSel(p.id===sel?null:p.id)}
                  className={`card cursor-pointer p-4 transition-all ${sel===p.id?"border-brand-300 shadow-soft ring-1 ring-brand-200":""}`}>
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <p className="font-bold text-slate-800 text-sm">{p.name}</p>
                      <p className="text-xs text-slate-400">{p.crop} · {p.size}ac · {p.phase}</p>
                    </div>
                    <span className={`badge ${p.health>80?"badge-green":p.health>60?"badge-amber":"badge-red"}`}>{p.health}%</span>
                  </div>

                  <div className="flex items-center gap-3 mb-3">
                    {/* Circular gauge */}
                    <div className="relative w-12 h-12 flex-shrink-0">
                      <svg viewBox="0 0 48 48" className="w-full h-full -rotate-90">
                        <circle cx="24" cy="24" r="18" fill="none" stroke="#F1F5F9" strokeWidth="5"/>
                        <circle cx="24" cy="24" r="18" fill="none" strokeWidth="5"
                          stroke={mc} strokeDasharray={`${(p.moisture/100)*113} 113`}
                          strokeLinecap="round" style={{transition:"stroke-dasharray 1s ease"}}/>
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-[9px] font-bold text-slate-700">{Math.round(p.moisture)}%</span>
                      </div>
                    </div>
                    <div className="flex-1 space-y-1.5">
                      {[{l:"Soil pH",v:p.ph,max:14,c:"#10B981"},{l:"Health",v:p.health,max:100,c:hc},{l:"Temp",v:p.temp,max:45,c:"#F59E0B"}].map(s => (
                        <div key={s.l} className="flex items-center gap-1.5">
                          <span className="text-[9px] text-slate-400 w-10">{s.l}</span>
                          <div className="flex-1 progress"><div className="progress-fill" style={{width:`${(s.v/s.max)*100}%`,background:s.c}}/></div>
                          <span className="text-[9px] text-slate-600 w-7 text-right font-mono">{s.v}{s.l==="Temp"?"°":s.l==="Soil pH"?"":""}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex gap-1.5">
                      <span className={`badge text-[9px] ${p.pestRisk==="high"?"badge-red":p.pestRisk==="medium"?"badge-amber":"badge-green"}`}>{p.pestRisk} pest</span>
                      <span className={`badge text-[9px] ${getMoistureLabel(p.moisture)==="Critical"?"badge-red":getMoistureLabel(p.moisture)==="Low"?"badge-amber":"badge-green"}`}>{getMoistureLabel(p.moisture)}</span>
                    </div>
                    <button onClick={e=>{e.stopPropagation();toggleAutoIrr(p.id);}}
                      className={`flex items-center gap-1 text-[9px] font-semibold transition-colors ${p.autoIrr?"text-brand-600":"text-slate-400"}`}>
                      {p.autoIrr?<Play className="w-2.5 h-2.5"/>:<Pause className="w-2.5 h-2.5"/>} AUTO
                    </button>
                  </div>
                </motion.div>
              );
            })}

            <Link href="/field-monitor" className="flex items-center justify-center gap-2 w-full py-3 border-2 border-dashed border-slate-200 text-slate-400 hover:border-brand-300 hover:text-brand-600 rounded-xl text-sm font-medium transition-all">
              <Plus className="w-4 h-4"/> Add Plot
            </Link>
          </div>

          {/* Center */}
          <div className="lg:col-span-6 space-y-4">
            {/* Farm map */}
            <Card hover={false}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-slate-800">Live Farm Map</h3>
                <span className="text-xs text-slate-400">Click plot for details</span>
              </div>
              <svg viewBox="0 0 600 280" className="w-full rounded-xl overflow-hidden" style={{height:260}}>
                <rect width="600" height="280" fill="#F8FAFC" rx="12"/>
                {plots.map((p, i) => {
                  const positions = [
                    {x:10,y:10,w:175,h:118},{x:200,y:10,w:195,h:118},{x:410,y:10,w:178,h:118},
                    {x:10,y:142,w:175,h:118},{x:200,y:142,w:195,h:118},{x:410,y:142,w:178,h:118}
                  ];
                  const pos = positions[i];
                  const c = getMoistureColor(p.moisture);
                  const isSel = sel===p.id;
                  return (
                    <g key={p.id} className="cursor-pointer" onClick={() => setSel(p.id===sel?null:p.id)}>
                      <rect x={pos.x} y={pos.y} width={pos.w} height={pos.h} rx={10}
                        fill={c} fillOpacity={isSel?.2:.07}
                        stroke={c} strokeWidth={isSel?2.5:1.5} strokeOpacity={isSel?1:.5}/>
                      <text x={pos.x+pos.w/2} y={pos.y+28} textAnchor="middle" fill="#1E293B" fontSize="13" fontWeight="700" fontFamily="DM Sans">{p.name}</text>
                      <text x={pos.x+pos.w/2} y={pos.y+46} textAnchor="middle" fill="#64748B" fontSize="10" fontFamily="DM Sans">{p.crop} · {p.phase}</text>
                      <rect x={pos.x+12} y={pos.y+58} width={pos.w-24} height={6} rx={3} fill="#E2E8F0"/>
                      <rect x={pos.x+12} y={pos.y+58} width={Math.max(4,(p.moisture/100)*(pos.w-24))} height={6} rx={3} fill={c}/>
                      <text x={pos.x+pos.w/2} y={pos.y+80} textAnchor="middle" fill={c} fontSize="12" fontWeight="600" fontFamily="DM Sans">{Math.round(p.moisture)}% moisture</text>
                      <text x={pos.x+pos.w/2} y={pos.y+96} textAnchor="middle" fill="#94A3B8" fontSize="9" fontFamily="DM Sans">pH {p.ph} · NPK {p.npk.n}/{p.npk.p}/{p.npk.k}</text>
                      {isSel && <rect x={pos.x+2} y={pos.y+2} width={4} height={pos.h-4} rx={2} fill={c}/>}
                    </g>
                  );
                })}
              </svg>
            </Card>

            {/* Selected plot detail */}
            <AnimatePresence>
              {selPlot && (
                <motion.div initial={{opacity:0,y:16}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-8}}>
                  <Card hover={false} className="border-brand-200 bg-brand-50/30">
                    <div className="flex justify-between mb-4">
                      <div>
                        <h3 className="font-bold text-slate-800 text-lg">{selPlot.name}</h3>
                        <p className="text-slate-500 text-sm">{selPlot.crop} · {selPlot.size} acres · {selPlot.phase}</p>
                      </div>
                      <button onClick={()=>setSel(null)} className="p-1.5 rounded-xl hover:bg-slate-100 text-slate-400"><X className="w-4 h-4"/></button>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                      {[
                        {l:"Moisture",  v:`${Math.round(selPlot.moisture)}%`, c:getMoistureColor(selPlot.moisture)},
                        {l:"Health",    v:`${selPlot.health}%`,               c:getHealthColor(selPlot.health)},
                        {l:"Soil pH",   v:selPlot.ph,                         c:"#10B981"},
                        {l:"NPK Ratio", v:`${selPlot.npk.n}/${selPlot.npk.p}/${selPlot.npk.k}`,c:"#3B82F6"},
                      ].map(s => (
                        <div key={s.l} className="bg-white rounded-xl p-3 border border-slate-100">
                          <div className="text-xs text-slate-400 mb-1">{s.l}</div>
                          <div className="text-xl font-bold" style={{color:s.c}}>{s.v}</div>
                        </div>
                      ))}
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <button onClick={()=>doIrrigate(selPlot.id)}
                        className={`btn text-sm px-4 py-2 ${irr===selPlot.id?"btn-ghost":"btn-primary"}`}>
                        {irr===selPlot.id?<><RefreshCw className="w-4 h-4 animate-spin"/>Irrigating…</>:<><Droplets className="w-4 h-4"/>Irrigate Now</>}
                      </button>
                      <button onClick={()=>toggleAutoIrr(selPlot.id)}
                        className={`btn btn-outline text-sm px-4 py-2 ${selPlot.autoIrr?"border-brand-400 text-brand-700":""}`}>
                        {selPlot.autoIrr?<Play className="w-4 h-4"/>:<Pause className="w-4 h-4"/>}
                        Auto-Irrigate {selPlot.autoIrr?"ON":"OFF"}
                      </button>
                      <Link href="/field-monitor" className="btn btn-ghost text-sm px-4 py-2">
                        Full Report <ChevronRight className="w-4 h-4"/>
                      </Link>
                    </div>
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Charts row */}
            <div className="grid grid-cols-2 gap-4">
              <Card hover={false}>
                <p className="text-xs font-semibold text-slate-400 mb-3">RAINFALL THIS WEEK (mm)</p>
                <ResponsiveContainer width="100%" height={130}>
                  <BarChart data={RAIN} barSize={14}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9"/>
                    <XAxis dataKey="d" tick={{fill:"#94A3B8",fontSize:10}} axisLine={false} tickLine={false}/>
                    <Tooltip {...TT}/>
                    <Bar dataKey="r" fill="#10B981" radius={[4,4,0,0]} name="Rain (mm)"/>
                  </BarChart>
                </ResponsiveContainer>
              </Card>
              <Card hover={false}>
                <p className="text-xs font-semibold text-slate-400 mb-3">TEMPERATURE (°C)</p>
                <ResponsiveContainer width="100%" height={130}>
                  <AreaChart data={TEMP}>
                    <defs>
                      <linearGradient id="tg" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.2}/>
                        <stop offset="95%" stopColor="#F59E0B" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9"/>
                    <XAxis dataKey="d" tick={{fill:"#94A3B8",fontSize:10}} axisLine={false} tickLine={false}/>
                    <Tooltip {...TT}/>
                    <Area type="monotone" dataKey="hi" stroke="#F59E0B" fill="url(#tg)" strokeWidth={2} name="High °C"/>
                    <Area type="monotone" dataKey="lo" stroke="#10B981" fill="none" strokeWidth={1.5} strokeDasharray="4 4" name="Low °C"/>
                  </AreaChart>
                </ResponsiveContainer>
              </Card>
            </div>
          </div>

          {/* Right sidebar */}
          <div className="lg:col-span-3 space-y-4">
            {/* Radar */}
            <Card hover={false}>
              <p className="text-xs font-semibold text-slate-400 mb-2">FARM HEALTH RADAR</p>
              <ResponsiveContainer width="100%" height={180}>
                <RadarChart data={radarData} outerRadius={65}>
                  <PolarGrid stroke="#E2E8F0"/>
                  <PolarAngleAxis dataKey="s" tick={{fill:"#94A3B8",fontSize:9}}/>
                  <Radar dataKey="v" stroke="#10B981" fill="#10B981" fillOpacity={0.15}/>
                </RadarChart>
              </ResponsiveContainer>
            </Card>

            {/* Weather strip */}
            <Card hover={false}>
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs font-semibold text-slate-400">7-DAY FORECAST</p>
                <Link href="/weather" className="text-xs text-brand-600 font-semibold hover:underline">Details</Link>
              </div>
              <div className="space-y-2">
                {FORECAST.slice(0,5).map((d,i) => (
                  <div key={i} className="flex items-center justify-between py-1.5 border-b border-slate-50 last:border-0">
                    <span className="text-xs text-slate-500 w-8">{d.day}</span>
                    <span className="text-base">{d.icon}</span>
                    <div className="flex-1 text-center">
                      <div className="h-1 bg-slate-100 rounded-full mx-2 overflow-hidden">
                        <div className="h-full bg-brand-400 rounded-full" style={{width:`${d.rain}%`}}/>
                      </div>
                      <span className="text-[9px] text-slate-400">{d.rain}% rain</span>
                    </div>
                    <span className="text-xs font-semibold text-slate-700 w-16 text-right">{d.lo}°–{d.hi}°C</span>
                  </div>
                ))}
              </div>
            </Card>

            {/* Quick actions */}
            <Card hover={false}>
              <p className="text-xs font-semibold text-slate-400 mb-3">QUICK ACTIONS</p>
              <div className="grid grid-cols-2 gap-2">
                {[
                  {l:"Irrigate All", icon:Droplets,    fn:doIrrigateAll, color:"bg-brand-50 text-brand-700 hover:bg-brand-100" },
                  {l:"Market Rates", icon:TrendingUp,  href:"/market",   color:"bg-amber-50 text-amber-700 hover:bg-amber-100" },
                  {l:"Weather",      icon:CloudRain,   href:"/weather",  color:"bg-sky-50 text-sky-700 hover:bg-sky-100" },
                  {l:"Inventory",    icon:Zap,         href:"/inventory",color:"bg-violet-50 text-violet-700 hover:bg-violet-100" },
                ].map(a => a.href ? (
                  <Link key={a.l} href={a.href} className={`flex flex-col items-center gap-1.5 p-3 rounded-xl text-xs font-semibold transition-all ${a.color}`}>
                    <a.icon className="w-4 h-4"/> {a.l}
                  </Link>
                ) : (
                  <button key={a.l} onClick={a.fn} className={`flex flex-col items-center gap-1.5 p-3 rounded-xl text-xs font-semibold transition-all ${a.color}`}>
                    <a.icon className="w-4 h-4"/> {a.l}
                  </button>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
