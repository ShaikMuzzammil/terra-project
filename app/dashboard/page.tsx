"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Droplets, Thermometer, Activity, AlertTriangle, TrendingUp, CloudRain, X, ChevronRight, Sprout, Zap, RefreshCcw, Plus, Play, Pause } from "lucide-react";
import { useFarmStore } from "@/lib/store";
import GreenCard from "@/components/GreenCard";
import { getHealthColor, getMoistureStatus, formatCurrency } from "@/lib/utils";
import {
  BarChart, Bar, LineChart, Line, AreaChart, Area,
  RadarChart, Radar, PolarGrid, PolarAngleAxis,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine
} from "recharts";

const rainfallData = [
  { day:"Mon", rain:12, avg:8 }, { day:"Tue", rain:0, avg:8 }, { day:"Wed", rain:45, avg:8 },
  { day:"Thu", rain:8, avg:8 }, { day:"Fri", rain:0, avg:8 }, { day:"Sat", rain:22, avg:8 }, { day:"Sun", rain:5, avg:8 },
];

const tooltipStyle = { backgroundColor:"#0A0600", border:"1px solid #3D2410", borderRadius:"6px", fontFamily:"Space Mono", fontSize:"11px", color:"#F5E6C8" };

export default function Dashboard() {
  const { plots, alerts, dismissAlert, activities, addActivity, irrigatePlot, irrigateAll, toggleAutoIrrigate, farmName, location } = useFarmStore();
  const [selectedPlot, setSelectedPlot] = useState<string|null>(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [tempData, setTempData] = useState(
    ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"].map((d,i) => ({ day:d, max:33+i*0.5+(Math.random()*2), min:23+i*0.3 }))
  );
  const [irrigating, setIrrigating] = useState<string|null>(null);

  useEffect(() => {
    const clock = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(clock);
  }, []);

  // Simulate live moisture changes
  useEffect(() => {
    const iv = setInterval(() => {
      plots.forEach(p => {
        const delta = (Math.random()-0.5)*2;
        useFarmStore.getState().updatePlotMoisture(p.id, Math.max(10, Math.min(95, p.moisture+delta)));
      });
    }, 15000);
    return () => clearInterval(iv);
  }, [plots]);

  const activeAlerts = alerts.filter(a => !a.dismissed);
  const selectedPlotData = plots.find(p => p.id === selectedPlot);

  const handleIrrigate = async (id: string) => {
    setIrrigating(id);
    irrigatePlot(id);
    setTimeout(() => setIrrigating(null), 2000);
  };

  const handleIrrigateAll = () => {
    irrigateAll();
    setIrrigating("all");
    setTimeout(() => setIrrigating(null), 2500);
  };

  const totalAcres = plots.reduce((s,p) => s+p.size, 0);
  const avgHealth = Math.round(plots.reduce((s,p) => s+p.health, 0)/plots.length);
  const lowMoisture = plots.filter(p => p.moisture < 40).length;
  const criticalAlerts = activeAlerts.filter(a => a.severity==="critical").length;

  const healthData = [
    { subject:"Moisture", A: Math.round(plots.reduce((s,p)=>s+p.moisture,0)/plots.length) },
    { subject:"Nutrition", A:75 }, { subject:"Sunlight", A:90 },
    { subject:"Pest Risk", A:85 }, { subject:"Growth", A:88 },
    { subject:"Yield", A:avgHealth },
  ];

  return (
    <div className="pt-24 min-h-screen bg-void">
      {/* Status bar */}
      <div className="fixed top-[72px] left-0 right-0 z-30 bg-soil/95 backdrop-blur border-b border-bark/50 h-10 flex items-center px-4 justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5"><span className="status-dot"/><span className="font-data text-[10px] text-fern tracking-widest">ALL SYSTEMS ACTIVE</span></div>
          <span className="hidden sm:block font-data text-[10px] text-clay">🌾 {farmName} // KHARIF 2026 — Day 47</span>
        </div>
        <div className="flex items-center gap-4">
          {criticalAlerts > 0 && <span className="font-data text-[10px] text-rust animate-pulse">{criticalAlerts} CRITICAL ALERTS</span>}
          <span className="font-data text-[10px] text-parchment tabular-nums">{currentTime.toLocaleTimeString("en-IN")}</span>
        </div>
      </div>

      <div className="pt-10 px-4 max-w-[1600px] mx-auto">
        {/* Summary cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 py-6">
          {[
            { label:"Total Acreage", value:`${totalAcres.toFixed(1)} ac`, icon:Sprout, color:"text-fern" },
            { label:"Avg Plot Health", value:`${avgHealth}%`, icon:Activity, color:avgHealth>80?"text-leaf":avgHealth>60?"text-amber":"text-rust" },
            { label:"Low Moisture Plots", value:`${lowMoisture}`, icon:Droplets, color:lowMoisture>0?"text-rust":"text-fern" },
            { label:"Active Alerts", value:`${activeAlerts.length}`, icon:AlertTriangle, color:activeAlerts.length>2?"text-rust":activeAlerts.length>0?"text-amber":"text-fern" },
          ].map((stat, i) => (
            <motion.div key={stat.label} initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{delay:i*0.08}}>
              <GreenCard className="flex items-center gap-3 p-4">
                <div className="w-10 h-10 rounded-lg bg-loam border border-bark flex items-center justify-center flex-shrink-0">
                  <stat.icon className={`w-5 h-5 ${stat.color}`} />
                </div>
                <div>
                  <div className={`font-accent text-2xl ${stat.color}`}>{stat.value}</div>
                  <div className="font-data text-[10px] text-clay">{stat.label}</div>
                </div>
              </GreenCard>
            </motion.div>
          ))}
        </div>

        {/* Main grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 pb-8">
          {/* Plot sidebar */}
          <div className="lg:col-span-3 space-y-2">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-display text-lg text-parchment">Farm Plots</h3>
              <button onClick={handleIrrigateAll}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-data text-[10px] tracking-wide transition-all ${irrigating==="all" ? "bg-fern text-parchment" : "border border-moss/40 text-moss hover:bg-moss/10"}`}>
                {irrigating==="all" ? <><RefreshCcw className="w-3 h-3 animate-spin"/>IRRIGATING</> : <><Droplets className="w-3 h-3"/>IRRIGATE ALL</>}
              </button>
            </div>

            {plots.map((plot, i) => {
              const ms = getMoistureStatus(plot.moisture);
              return (
                <motion.div key={plot.id} initial={{opacity:0,x:-20}} animate={{opacity:1,x:0}} transition={{delay:i*0.08}}
                  onClick={() => setSelectedPlot(plot.id === selectedPlot ? null : plot.id)}
                  className={`glass-card p-4 cursor-pointer transition-all duration-200 ${selectedPlot===plot.id ? "border-moss/60 bg-loam/60 shadow-lg shadow-moss/10" : "hover:border-bark/80"}`}>
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h4 className="font-display text-sm text-parchment">{plot.name}</h4>
                      <span className="font-data text-[10px] text-clay">{plot.crop} · {plot.size} ac · {plot.phase}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className={`px-2 py-0.5 rounded font-data text-[9px] ${plot.health>80?"bg-leaf/15 text-leaf":plot.health>60?"bg-amber/15 text-amber":"bg-rust/15 text-rust"}`}>
                        {plot.health}%
                      </span>
                    </div>
                  </div>

                  {/* Stats bars */}
                  <div className="space-y-2">
                    {[
                      { label:"Moisture", value:plot.moisture, max:100, color:ms.color },
                      { label:"Health",   value:plot.health,   max:100, color:getHealthColor(plot.health) },
                      { label:"Temp",     value:plot.temperature, max:45, color:"#E9A319" },
                    ].map(s => (
                      <div key={s.label} className="flex items-center gap-2">
                        <span className="font-data text-[9px] text-clay w-12">{s.label}</span>
                        <div className="flex-1 prog-bar">
                          <motion.div className="prog-bar-fill" animate={{width:`${(s.value/s.max)*100}%`}} style={{background:s.color}} />
                        </div>
                        <span className="font-data text-[9px] text-parchment w-8 text-right">
                          {Math.round(s.value)}{s.label==="Temp"?"°":""}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Auto-irrigate + pest risk */}
                  <div className="flex items-center justify-between mt-3 pt-3 border-t border-bark/30">
                    <div className="flex items-center gap-1.5">
                      <span className={`text-[8px] px-1.5 py-0.5 rounded font-data ${plot.pestRisk==="high"?"bg-rust/20 text-rust":plot.pestRisk==="medium"?"bg-amber/20 text-amber":"bg-fern/20 text-fern"}`}>
                        {plot.pestRisk.toUpperCase()} PEST
                      </span>
                    </div>
                    <button onClick={e => {e.stopPropagation(); toggleAutoIrrigate(plot.id);}}
                      className={`flex items-center gap-1 font-data text-[9px] transition-colors ${plot.autoIrrigate?"text-fern":"text-clay"}`}>
                      {plot.autoIrrigate ? <Play className="w-2.5 h-2.5"/> : <Pause className="w-2.5 h-2.5"/>}
                      AUTO
                    </button>
                  </div>
                </motion.div>
              );
            })}
            <Link href="/field-monitor" className="flex items-center justify-center gap-2 w-full py-3 border border-dashed border-moss/30 text-moss/70 hover:text-moss hover:border-moss/60 rounded-lg font-data text-xs transition-all">
              <Plus className="w-3.5 h-3.5" /> ADD PLOT
            </Link>
          </div>

          {/* Center */}
          <div className="lg:col-span-6 space-y-4">
            {/* Farm map */}
            <GreenCard className="overflow-hidden" hover={false}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-display text-lg text-parchment">Farm Layout Monitor</h3>
                <span className="font-data text-[10px] text-clay">Click plot to select</span>
              </div>
              <svg viewBox="0 0 600 280" className="w-full" style={{height:"280px"}}>
                {plots.map((plot, i) => {
                  const positions = [
                    {x:10,y:10,w:175,h:120},{x:200,y:10,w:195,h:120},{x:410,y:10,w:175,h:120},
                    {x:10,y:145,w:175,h:120},{x:200,y:145,w:195,h:120},{x:410,y:145,w:175,h:120}
                  ];
                  const pos = positions[i];
                  const c = getHealthColor(plot.moisture);
                  const isSelected = selectedPlot===plot.id;
                  return (
                    <g key={plot.id} className="cursor-pointer" onClick={() => setSelectedPlot(plot.id===selectedPlot?null:plot.id)}>
                      <rect x={pos.x} y={pos.y} width={pos.w} height={pos.h} rx={8}
                        fill={c} fillOpacity={isSelected?"0.22":"0.10"}
                        stroke={c} strokeWidth={isSelected?2.5:1.5} strokeOpacity={isSelected?1:0.5}
                        className="transition-all duration-500">
                        {!isSelected && <animate attributeName="stroke-opacity" values="0.3;0.7;0.3" dur={`${3+i*0.5}s`} repeatCount="indefinite" />}
                      </rect>
                      {/* Plot label */}
                      <text x={pos.x+pos.w/2} y={pos.y+30} textAnchor="middle" fill="#F5E6C8" fontSize="13" fontFamily="Fraunces" fontWeight="600">{plot.name.split("—")[0].trim()}</text>
                      <text x={pos.x+pos.w/2} y={pos.y+50} textAnchor="middle" fill="#8B5E3C" fontSize="10" fontFamily="Space Mono">{plot.crop}</text>
                      {/* Moisture bar */}
                      <rect x={pos.x+10} y={pos.y+65} width={pos.w-20} height={6} rx={3} fill="#1A0E05" />
                      <motion.rect x={pos.x+10} y={pos.y+65} width={((plot.moisture/100)*(pos.w-20))} height={6} rx={3} fill={c}
                        initial={{width:0}} animate={{width:((plot.moisture/100)*(pos.w-20))}} transition={{duration:1}} />
                      <text x={pos.x+pos.w/2} y={pos.y+85} textAnchor="middle" fill={c} fontSize="11" fontFamily="Space Mono">{Math.round(plot.moisture)}% moisture</text>
                      <text x={pos.x+pos.w/2} y={pos.y+102} textAnchor="middle" fill="#8B5E3C" fontSize="9" fontFamily="Space Mono">{plot.phase} · pH {plot.soilPH}</text>
                      {/* Selected indicator */}
                      {isSelected && <rect x={pos.x+2} y={pos.y+2} width={4} height={pos.h-4} rx={2} fill={c} />}
                    </g>
                  );
                })}
              </svg>
            </GreenCard>

            {/* Alerts strip */}
            {activeAlerts.length > 0 && (
              <div className="flex gap-2 overflow-x-auto pb-1">
                {activeAlerts.slice(0,4).map(alert => (
                  <motion.div key={alert.id} initial={{opacity:0,scale:0.9}} animate={{opacity:1,scale:1}}
                    className={`flex items-center gap-2 px-3 py-2 rounded-full whitespace-nowrap text-xs font-data flex-shrink-0 alert-${alert.severity}`}>
                    <span>{alert.type==="weather"?"🌧":alert.type==="pest"?"🐛":alert.type==="price"?"📈":alert.type==="irrigation"?"💧":"⚠️"}</span>
                    <span>{alert.message}</span>
                    <button onClick={() => dismissAlert(alert.id)} className="opacity-60 hover:opacity-100"><X className="w-3 h-3" /></button>
                  </motion.div>
                ))}
              </div>
            )}

            {/* Selected plot detail */}
            <AnimatePresence>
              {selectedPlotData && (
                <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-10}}>
                  <GreenCard className="border-moss/30" hover={false}>
                    <div className="flex justify-between items-start mb-5">
                      <div>
                        <h3 className="font-display text-xl text-parchment">{selectedPlotData.name}</h3>
                        <p className="font-data text-xs text-clay">{selectedPlotData.crop} · {selectedPlotData.size} acres · {selectedPlotData.phase}</p>
                      </div>
                      <button onClick={() => setSelectedPlot(null)} className="text-clay hover:text-parchment p-1"><X className="w-4 h-4" /></button>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
                      {[
                        { label:"Moisture",  value:`${Math.round(selectedPlotData.moisture)}%`, color:getMoistureStatus(selectedPlotData.moisture).color },
                        { label:"Health",    value:`${selectedPlotData.health}%`, color:getHealthColor(selectedPlotData.health) },
                        { label:"NPK",       value:`${selectedPlotData.npk.n}/${selectedPlotData.npk.p}/${selectedPlotData.npk.k}`, color:"#E9A319" },
                        { label:"Soil pH",   value:selectedPlotData.soilPH.toString(), color:"#52B788" },
                      ].map(s => (
                        <div key={s.label} className="bg-void/50 p-3 rounded-lg border border-bark/30">
                          <div className="font-data text-[9px] text-clay uppercase mb-1">{s.label}</div>
                          <div className="font-accent text-xl" style={{color:s.color}}>{s.value}</div>
                        </div>
                      ))}
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <button onClick={() => handleIrrigate(selectedPlotData.id)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg font-data text-xs transition-all ${irrigating===selectedPlotData.id?"bg-fern text-parchment":"bg-moss hover:bg-fern text-parchment"}`}>
                        {irrigating===selectedPlotData.id ? <RefreshCcw className="w-3.5 h-3.5 animate-spin"/> : <Droplets className="w-3.5 h-3.5"/>}
                        {irrigating===selectedPlotData.id ? "IRRIGATING..." : "IRRIGATE NOW"}
                      </button>
                      <button onClick={() => toggleAutoIrrigate(selectedPlotData.id)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg font-data text-xs border transition-all ${selectedPlotData.autoIrrigate?"border-fern/40 text-fern bg-fern/10":"border-bark/60 text-clay hover:border-amber/40 hover:text-amber"}`}>
                        {selectedPlotData.autoIrrigate ? <Play className="w-3.5 h-3.5"/>:<Pause className="w-3.5 h-3.5"/>}
                        AUTO IRRIGATE: {selectedPlotData.autoIrrigate?"ON":"OFF"}
                      </button>
                      <Link href="/field-monitor" className="flex items-center gap-2 px-4 py-2 rounded-lg border border-bark/60 text-clay hover:border-moss/40 hover:text-parchment font-data text-xs transition-all">
                        FULL REPORT <ChevronRight className="w-3.5 h-3.5"/>
                      </Link>
                    </div>
                  </GreenCard>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Right sidebar */}
          <div className="lg:col-span-3 space-y-4">
            {/* Activity feed */}
            <GreenCard hover={false} className="h-[320px] flex flex-col">
              <h3 className="font-display text-sm text-parchment mb-3 flex items-center gap-2"><Activity className="w-4 h-4 text-amber"/>ACTIVITY FEED</h3>
              <div className="flex-1 overflow-y-auto space-y-2 pr-1">
                {activities.slice(0,15).map(a => (
                  <div key={a.id} className="flex items-start gap-2 text-[10px] font-data p-2.5 rounded-lg bg-void/40 border border-bark/20">
                    <span className="text-clay shrink-0 tabular-nums">{a.timestamp}</span>
                    <div className="flex-1 min-w-0">
                      <span className={`text-[9px] px-1.5 py-0.5 rounded mr-1.5 ${a.type==="Irrigation"?"bg-fern/20 text-fern":a.type==="Treatment"?"bg-rust/20 text-rust":a.type==="Fertilizer"?"bg-amber/20 text-amber":"bg-clay/20 text-clay"}`}>{a.type}</span>
                      <span className="text-parchment/80 text-[10px]">{a.description}</span>
                    </div>
                  </div>
                ))}
              </div>
            </GreenCard>

            {/* Quick actions */}
            <GreenCard hover={false}>
              <h3 className="font-display text-sm text-parchment mb-3">Quick Actions</h3>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { label:"Irrigate All",   icon:Droplets,      action:handleIrrigateAll,    color:"text-fern" },
                  { label:"Log Activity",   icon:Activity,       href:"/calendar",            color:"text-amber" },
                  { label:"Market Prices",  icon:TrendingUp,     href:"/market",              color:"text-leaf" },
                  { label:"Field Monitor",  icon:Sprout,         href:"/field-monitor",       color:"text-clay" },
                  { label:"Weather",        icon:CloudRain,      href:"/weather",             color:"text-fern" },
                  { label:"Inventory",      icon:AlertTriangle,  href:"/inventory",           color:"text-amber" },
                ].map(action => (
                  action.href ? (
                    <Link key={action.label} href={action.href}
                      className="flex flex-col items-center gap-1.5 p-3 glass-card hover:border-moss/40 transition-all text-center group">
                      <action.icon className={`w-4 h-4 ${action.color} group-hover:scale-110 transition-transform`} />
                      <span className="font-data text-[9px] text-clay group-hover:text-parchment transition-colors">{action.label}</span>
                    </Link>
                  ) : (
                    <button key={action.label} onClick={action.action}
                      className="flex flex-col items-center gap-1.5 p-3 glass-card hover:border-moss/40 transition-all text-center group">
                      <action.icon className={`w-4 h-4 ${action.color} group-hover:scale-110 transition-transform`} />
                      <span className="font-data text-[9px] text-clay group-hover:text-parchment transition-colors">{action.label}</span>
                    </button>
                  )
                ))}
              </div>
            </GreenCard>
          </div>
        </div>

        {/* Charts row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pb-10">
          <GreenCard hover={false}>
            <h4 className="font-data text-xs text-clay mb-4">7-DAY RAINFALL (mm)</h4>
            <ResponsiveContainer width="100%" height={160}>
              <BarChart data={rainfallData} barSize={18}>
                <CartesianGrid strokeDasharray="3 3" stroke="#3D2410" vertical={false}/>
                <XAxis dataKey="day" tick={{fill:"#8B5E3C",fontSize:9,fontFamily:"Space Mono"}} axisLine={false} tickLine={false}/>
                <Tooltip contentStyle={tooltipStyle} cursor={{fill:"rgba(45,106,79,0.05)"}}/>
                <Bar dataKey="rain" fill="#2D6A4F" radius={[4,4,0,0]} />
                <ReferenceLine y={8} stroke="#E9A319" strokeDasharray="4 4" strokeWidth={1.5}/>
              </BarChart>
            </ResponsiveContainer>
          </GreenCard>

          <GreenCard hover={false}>
            <h4 className="font-data text-xs text-clay mb-4">TEMPERATURE TREND (°C)</h4>
            <ResponsiveContainer width="100%" height={160}>
              <AreaChart data={tempData}>
                <defs>
                  <linearGradient id="tg" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#E9A319" stopOpacity={0.25}/>
                    <stop offset="95%" stopColor="#E9A319" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#3D2410" vertical={false}/>
                <XAxis dataKey="day" tick={{fill:"#8B5E3C",fontSize:9,fontFamily:"Space Mono"}} axisLine={false} tickLine={false}/>
                <YAxis tick={{fill:"#8B5E3C",fontSize:9,fontFamily:"Space Mono"}} axisLine={false} tickLine={false} domain={[20,42]}/>
                <Tooltip contentStyle={tooltipStyle}/>
                <Area type="monotone" dataKey="max" stroke="#E9A319" fill="url(#tg)" strokeWidth={2}/>
                <Line type="monotone" dataKey="min" stroke="#52B788" dot={false} strokeWidth={1.5} strokeDasharray="4 4"/>
              </AreaChart>
            </ResponsiveContainer>
          </GreenCard>

          <GreenCard hover={false}>
            <h4 className="font-data text-xs text-clay mb-4">CROP HEALTH RADAR</h4>
            <ResponsiveContainer width="100%" height={160}>
              <RadarChart data={healthData} outerRadius={60}>
                <PolarGrid stroke="#3D2410"/>
                <PolarAngleAxis dataKey="subject" tick={{fill:"#8B5E3C",fontSize:8,fontFamily:"Space Mono"}}/>
                <Radar name="Health" dataKey="A" stroke="#2D6A4F" fill="#2D6A4F" fillOpacity={0.3}/>
              </RadarChart>
            </ResponsiveContainer>
          </GreenCard>
        </div>
      </div>
    </div>
  );
}
