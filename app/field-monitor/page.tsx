"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Droplets, Plus, Thermometer, Activity, AlertTriangle, X, Save, Sprout, Bug } from "lucide-react";
import { useFarmStore } from "@/lib/store";
import GreenCard from "@/components/GreenCard";
import { getHealthColor, getMoistureStatus } from "@/lib/utils";
import { RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip } from "recharts";

const tooltipStyle = { backgroundColor:"#0A0600", border:"1px solid #3D2410", borderRadius:"6px", fontFamily:"Space Mono", fontSize:"11px", color:"#F5E6C8" };

export default function FieldMonitor() {
  const { plots, updatePlotMoisture, irrigatePlot, toggleAutoIrrigate, addPlot, deletePlot, updatePlotField, addActivity } = useFarmStore();
  const [selected, setSelected] = useState(plots[0]?.id || null);
  const [showAddPlot, setShowAddPlot] = useState(false);
  const [editNPK, setEditNPK] = useState(false);
  const [newNPK, setNewNPK] = useState({ n:0, p:0, k:0 });
  const [newPlot, setNewPlot] = useState({ id:"G", name:"New Plot", crop:"Wheat", size:2.0, moisture:60, health:80, temperature:32, npk:{n:120,p:40,k:160}, lastIrrigated:"Just added", autoIrrigate:false, phase:"Sowing", soilPH:6.5, pestRisk:"low" as "low"|"medium"|"high" });

  const selectedPlot = plots.find(p => p.id === selected);

  const pestRiskData = plots.map(p => ({
    name: p.id,
    risk: p.pestRisk === "high" ? 80 : p.pestRisk === "medium" ? 45 : 15,
    moisture: p.moisture,
    health: p.health,
  }));

  const historyData = Array.from({length:7}, (_,i) => ({
    day: ["Mon","Tue","Wed","Thu","Fri","Sat","Today"][i],
    moisture: selectedPlot ? Math.max(20, Math.min(95, selectedPlot.moisture + (Math.random()-0.5)*20)) : 60,
    health: selectedPlot ? Math.max(40, Math.min(98, selectedPlot.health + (Math.random()-0.5)*10)) : 80,
  }));

  const handleAddPlot = () => {
    addPlot({ ...newPlot, id: newPlot.id || String.fromCharCode(65 + plots.length) });
    setShowAddPlot(false);
  };

  const applyNPK = () => {
    if (!selectedPlot) return;
    updatePlotField(selectedPlot.id, "npk", newNPK);
    addActivity({ id:Date.now().toString(), type:"Fertilizer", plot:selectedPlot.name, description:`NPK updated: N${newNPK.n}/P${newNPK.p}/K${newNPK.k}`, timestamp:new Date().toLocaleTimeString("en-IN",{hour:"2-digit",minute:"2-digit"}) });
    setEditNPK(false);
  };

  return (
    <div className="pt-24 min-h-screen bg-void px-4">
      <div className="max-w-7xl mx-auto py-8">
        <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-display text-4xl md:text-5xl text-parchment mb-1">Field <span className="text-amber">Monitor</span></h1>
            <p className="font-data text-xs text-clay">Real-time soil intelligence across all plots</p>
          </div>
          <button onClick={() => setShowAddPlot(true)} className="flex items-center gap-2 px-5 py-2.5 bg-moss hover:bg-fern text-parchment rounded-xl font-display text-sm tracking-wider transition-all hover:scale-105">
            <Plus className="w-4 h-4"/> ADD PLOT
          </button>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          {/* Plot list */}
          <div className="lg:col-span-4 space-y-3">
            {plots.map((plot, i) => {
              const ms = getMoistureStatus(plot.moisture);
              return (
                <motion.div key={plot.id} initial={{opacity:0,x:-20}} animate={{opacity:1,x:0}} transition={{delay:i*0.07}}
                  onClick={() => setSelected(plot.id)}
                  className={`glass-card p-5 cursor-pointer transition-all duration-200 ${selected===plot.id?"border-moss/60 shadow-lg shadow-moss/10 bg-loam/60":""}`}>
                  <div className="flex justify-between mb-4">
                    <div>
                      <h3 className="font-display text-base text-parchment">{plot.name}</h3>
                      <span className="font-data text-[10px] text-clay">{plot.crop} · {plot.size} ac · {plot.phase}</span>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <span className={`font-data text-[9px] px-2 py-0.5 rounded ${plot.health>80?"bg-leaf/15 text-leaf":plot.health>60?"bg-amber/15 text-amber":"bg-rust/15 text-rust"}`}>{plot.health}% health</span>
                      <span className={`font-data text-[9px] px-2 py-0.5 rounded ${plot.pestRisk==="high"?"bg-rust/15 text-rust":plot.pestRisk==="medium"?"bg-amber/15 text-amber":"bg-fern/15 text-fern"}`}>{plot.pestRisk} pest</span>
                    </div>
                  </div>

                  {/* Circular moisture indicator */}
                  <div className="flex items-center gap-4">
                    <div className="relative w-16 h-16 flex-shrink-0">
                      <svg viewBox="0 0 64 64" className="w-full h-full -rotate-90">
                        <circle cx="32" cy="32" r="26" fill="none" stroke="#1A0E05" strokeWidth="6"/>
                        <circle cx="32" cy="32" r="26" fill="none" strokeWidth="6"
                          stroke={ms.color} strokeDasharray={`${(plot.moisture/100)*163.4} 163.4`}
                          strokeLinecap="round" style={{transition:"stroke-dasharray 1s ease"}}/>
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="font-data text-[10px] text-parchment">{Math.round(plot.moisture)}%</span>
                      </div>
                    </div>
                    <div className="flex-1 space-y-1.5">
                      <div className="flex justify-between font-data text-[10px]">
                        <span className="text-clay">NPK</span>
                        <span className="text-amber">{plot.npk.n}/{plot.npk.p}/{plot.npk.k}</span>
                      </div>
                      <div className="flex justify-between font-data text-[10px]">
                        <span className="text-clay">pH</span>
                        <span className="text-parchment">{plot.soilPH}</span>
                      </div>
                      <div className="flex justify-between font-data text-[10px]">
                        <span className="text-clay">Temp</span>
                        <span className="text-parchment">{plot.temperature}°C</span>
                      </div>
                      <div className="flex justify-between font-data text-[10px]">
                        <span className="text-clay">Irrigated</span>
                        <span className="text-parchment">{plot.lastIrrigated}</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Detail panel */}
          <div className="lg:col-span-8 space-y-4">
            {selectedPlot ? (
              <>
                <GreenCard hover={false}>
                  <div className="flex items-start justify-between mb-6">
                    <div>
                      <h2 className="font-display text-2xl text-parchment">{selectedPlot.name}</h2>
                      <p className="font-data text-xs text-clay">{selectedPlot.crop} · {selectedPlot.size} acres · {selectedPlot.phase}</p>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => irrigatePlot(selectedPlot.id)} className="flex items-center gap-1.5 px-3 py-2 bg-moss hover:bg-fern text-parchment rounded-lg font-data text-xs transition-all">
                        <Droplets className="w-3.5 h-3.5"/> IRRIGATE
                      </button>
                      <button onClick={() => deletePlot(selectedPlot.id)} className="p-2 border border-bark/60 hover:border-rust/60 text-clay hover:text-rust rounded-lg transition-all">
                        <X className="w-4 h-4"/>
                      </button>
                    </div>
                  </div>

                  {/* 8-stat grid */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
                    {[
                      { l:"Moisture",     v:`${Math.round(selectedPlot.moisture)}%`,  c:getMoistureStatus(selectedPlot.moisture).color },
                      { l:"Health Score", v:`${selectedPlot.health}%`,                 c:getHealthColor(selectedPlot.health) },
                      { l:"Temperature",  v:`${selectedPlot.temperature}°C`,           c:"#E9A319" },
                      { l:"Soil pH",      v:selectedPlot.soilPH.toFixed(1),           c:"#52B788" },
                      { l:"Nitrogen (N)", v:`${selectedPlot.npk.n} kg/ha`,            c:"#95D5B2" },
                      { l:"Phosphorus(P)",v:`${selectedPlot.npk.p} kg/ha`,            c:"#F4D03F" },
                      { l:"Potassium(K)", v:`${selectedPlot.npk.k} kg/ha`,            c:"#E9A319" },
                      { l:"Pest Risk",    v:selectedPlot.pestRisk.toUpperCase(),      c:selectedPlot.pestRisk==="high"?"#C0392B":selectedPlot.pestRisk==="medium"?"#E9A319":"#52B788" },
                    ].map(s => (
                      <div key={s.l} className="bg-void/50 p-3 rounded-lg border border-bark/20">
                        <div className="font-data text-[9px] text-clay uppercase mb-1">{s.l}</div>
                        <div className="font-accent text-xl" style={{color:s.c}}>{s.v}</div>
                      </div>
                    ))}
                  </div>

                  {/* Auto-irrigate toggle + NPK edit */}
                  <div className="flex flex-wrap gap-2 mb-5">
                    <button onClick={() => toggleAutoIrrigate(selectedPlot.id)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg border font-data text-xs transition-all ${selectedPlot.autoIrrigate?"border-fern/50 bg-fern/10 text-fern":"border-bark/60 text-clay hover:border-amber/40"}`}>
                      <Droplets className="w-3.5 h-3.5"/> AUTO IRRIGATE: {selectedPlot.autoIrrigate?"ON":"OFF"}
                    </button>
                    <button onClick={() => { setNewNPK(selectedPlot.npk); setEditNPK(!editNPK); }}
                      className="flex items-center gap-2 px-4 py-2 rounded-lg border border-bark/60 text-clay hover:border-amber/40 hover:text-amber font-data text-xs transition-all">
                      <Sprout className="w-3.5 h-3.5"/> UPDATE NPK
                    </button>
                    <button onClick={() => { updatePlotField(selectedPlot.id,"pestRisk", selectedPlot.pestRisk==="high"?"low":"high"); }}
                      className="flex items-center gap-2 px-4 py-2 rounded-lg border border-bark/60 text-clay hover:border-rust/40 hover:text-rust font-data text-xs transition-all">
                      <Bug className="w-3.5 h-3.5"/> TOGGLE PEST
                    </button>
                  </div>

                  {editNPK && (
                    <motion.div initial={{opacity:0,y:-10}} animate={{opacity:1,y:0}} className="p-4 bg-loam/40 rounded-xl border border-bark/40 mb-4">
                      <p className="font-data text-[10px] text-clay mb-3 tracking-widest">UPDATE NPK VALUES (kg/ha)</p>
                      <div className="flex gap-3 items-end">
                        {[{k:"n",l:"Nitrogen"},{k:"p",l:"Phosphorus"},{k:"k",l:"Potassium"}].map(({k,l}) => (
                          <div key={k} className="flex-1">
                            <label className="font-data text-[9px] text-clay block mb-1">{l} ({k.toUpperCase()})</label>
                            <input type="number" value={(newNPK as any)[k]} onChange={e => setNewNPK(p=>({...p,[k]:Number(e.target.value)}))}/>
                          </div>
                        ))}
                        <button onClick={applyNPK} className="flex items-center gap-1.5 px-4 py-2 bg-moss hover:bg-fern text-parchment rounded-lg font-data text-xs transition-all flex-shrink-0">
                          <Save className="w-3.5 h-3.5"/> SAVE
                        </button>
                      </div>
                    </motion.div>
                  )}

                  {/* Moisture slider */}
                  <div>
                    <label className="font-data text-[10px] text-clay block mb-2">MANUAL MOISTURE ADJUSTMENT</label>
                    <input type="range" min="10" max="95" value={selectedPlot.moisture}
                      onChange={e => updatePlotMoisture(selectedPlot.id, Number(e.target.value))}
                      className="w-full h-2 bg-loam rounded-full appearance-none cursor-pointer"
                      style={{accentColor:"#2D6A4F"}}/>
                    <div className="flex justify-between font-data text-[9px] text-clay mt-1"><span>10% (Dry)</span><span>95% (Optimal)</span></div>
                  </div>
                </GreenCard>

                {/* Charts */}
                <div className="grid md:grid-cols-2 gap-4">
                  <GreenCard hover={false}>
                    <h4 className="font-data text-xs text-clay mb-4">7-DAY MOISTURE & HEALTH HISTORY</h4>
                    <ResponsiveContainer width="100%" height={160}>
                      <LineChart data={historyData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#3D2410" vertical={false}/>
                        <XAxis dataKey="day" tick={{fill:"#8B5E3C",fontSize:9,fontFamily:"Space Mono"}} axisLine={false} tickLine={false}/>
                        <YAxis tick={{fill:"#8B5E3C",fontSize:9,fontFamily:"Space Mono"}} axisLine={false} tickLine={false} domain={[0,100]}/>
                        <Tooltip contentStyle={tooltipStyle}/>
                        <Line type="monotone" dataKey="moisture" stroke="#52B788" strokeWidth={2} dot={false} name="Moisture %"/>
                        <Line type="monotone" dataKey="health" stroke="#E9A319" strokeWidth={2} dot={false} name="Health %"/>
                      </LineChart>
                    </ResponsiveContainer>
                  </GreenCard>
                  <GreenCard hover={false}>
                    <h4 className="font-data text-xs text-clay mb-4">FARM-WIDE COMPARISON</h4>
                    <ResponsiveContainer width="100%" height={160}>
                      <RadarChart data={pestRiskData} outerRadius={60}>
                        <PolarGrid stroke="#3D2410"/>
                        <PolarAngleAxis dataKey="name" tick={{fill:"#8B5E3C",fontSize:9,fontFamily:"Space Mono"}}/>
                        <Radar name="Moisture" dataKey="moisture" stroke="#52B788" fill="#52B788" fillOpacity={0.2}/>
                        <Radar name="Health" dataKey="health" stroke="#E9A319" fill="#E9A319" fillOpacity={0.15}/>
                        <Tooltip contentStyle={tooltipStyle}/>
                      </RadarChart>
                    </ResponsiveContainer>
                  </GreenCard>
                </div>
              </>
            ) : (
              <GreenCard hover={false} className="flex items-center justify-center h-64">
                <p className="font-data text-sm text-clay">Select a plot to view details</p>
              </GreenCard>
            )}
          </div>
        </div>
      </div>

      {/* Add plot modal */}
      <AnimatePresence>
        {showAddPlot && (
          <>
            <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="fixed inset-0 bg-void/80 backdrop-blur-sm z-50" onClick={()=>setShowAddPlot(false)}/>
            <motion.div initial={{opacity:0,scale:0.95}} animate={{opacity:1,scale:1}} exit={{opacity:0,scale:0.95}}
              className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-lg">
              <GreenCard className="border-moss/30 shadow-2xl" hover={false}>
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-display text-xl text-parchment">Add New Plot</h3>
                  <button onClick={()=>setShowAddPlot(false)} className="text-clay hover:text-parchment"><X className="w-5 h-5"/></button>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    {l:"Plot ID",   k:"id",   t:"text" },
                    {l:"Name",      k:"name", t:"text" },
                    {l:"Crop",      k:"crop", t:"text" },
                    {l:"Size (ac)", k:"size", t:"number"},
                    {l:"Growth Phase", k:"phase", t:"text"},
                    {l:"Soil pH",   k:"soilPH", t:"number"},
                  ].map(({l,k,t}) => (
                    <div key={k}>
                      <label className="font-data text-[10px] text-clay block mb-1.5">{l.toUpperCase()}</label>
                      <input type={t} value={(newPlot as any)[k]} onChange={e=>setNewPlot(p=>({...p,[k]:t==="number"?Number(e.target.value):e.target.value}))}/>
                    </div>
                  ))}
                  <div>
                    <label className="font-data text-[10px] text-clay block mb-1.5">PEST RISK</label>
                    <select value={newPlot.pestRisk} onChange={e=>setNewPlot(p=>({...p,pestRisk:e.target.value as any}))}>
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                    </select>
                  </div>
                </div>
                <button onClick={handleAddPlot} className="mt-5 w-full py-3 bg-moss hover:bg-fern text-parchment rounded-xl font-display text-sm tracking-wider transition-all">
                  ADD PLOT
                </button>
              </GreenCard>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
