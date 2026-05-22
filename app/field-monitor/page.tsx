"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Droplets, Plus, X, Save, Bug, ChevronDown, Trash2 } from "lucide-react";
import { useStore } from "@/lib/store";
import Card from "@/components/Card";
import { getHealthColor, getMoistureColor, getMoistureLabel } from "@/lib/utils";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadarChart, Radar, PolarGrid, PolarAngleAxis } from "recharts";

const TT = { contentStyle:{background:"#fff",border:"1px solid #E2E8F0",borderRadius:"10px",fontFamily:"DM Sans",fontSize:"12px"} };

export default function FieldMonitor() {
  const { plots, updateMoisture, irrigate, toggleAutoIrr, addPlot, deletePlot, setField, pushNotif } = useStore();
  const [sel, setSel] = useState(plots[0]?.id || "A");
  const [showAdd, setShowAdd] = useState(false);
  const [editNPK, setEditNPK] = useState(false);
  const [npk, setNpk] = useState({n:0,p:0,k:0});
  const [newPlot, setNewPlot] = useState({ id:"G", name:"New Plot", crop:"Wheat", size:2.0, moisture:60, health:80, temp:32, npk:{n:120,p:40,k:160}, lastWatered:"Just added", autoIrr:false, phase:"Sowing", ph:6.5, pestRisk:"low" as "low"|"medium"|"high", area:"New Block" });

  const selPlot = plots.find(p=>p.id===sel);

  const history = Array.from({length:7},(_,i)=>({
    day:["Mon","Tue","Wed","Thu","Fri","Sat","Today"][i],
    moisture: selPlot ? Math.max(20,Math.min(92, selPlot.moisture+(Math.random()-.5)*18)) : 60,
    health: selPlot ? Math.max(40,Math.min(98, selPlot.health+(Math.random()-.5)*10)) : 80,
  }));

  const radarData = plots.map(p=>({
    id:p.id, moisture:p.moisture, health:p.health,
    risk:p.pestRisk==="high"?80:p.pestRisk==="medium"?45:15,
  }));

  const handleAddPlot = () => {
    addPlot({...newPlot});
    pushNotif({title:"✅ New Plot Added",body:`${newPlot.name} has been added to your farm.`,type:"success",time:"just now"});
    setShowAdd(false);
  };

  const saveNPK = () => {
    if(!selPlot) return;
    setField(selPlot.id,"npk",npk);
    pushNotif({title:"🌱 NPK Updated",body:`${selPlot.name}: N${npk.n}/P${npk.p}/K${npk.k} applied.`,type:"success",time:"just now"});
    setEditNPK(false);
  };

  const riskColor = {high:"badge-red",medium:"badge-amber",low:"badge-green"};

  return (
    <div className="pt-[88px] min-h-screen bg-slate-50">
      <div className="container py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-slate-900 mb-1">Field <span className="grad-text">Monitor</span></h1>
            <p className="text-slate-500 text-sm">Real-time soil intelligence · Click a plot to inspect</p>
          </div>
          <button onClick={()=>setShowAdd(true)} className="btn btn-primary">
            <Plus className="w-4 h-4"/> Add Plot
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* Plot list */}
          <div className="lg:col-span-4 space-y-3">
            {plots.map((p,i)=>{
              const mc = getMoistureColor(p.moisture);
              const hc = getHealthColor(p.health);
              return (
                <motion.div key={p.id} initial={{opacity:0,x:-16}} animate={{opacity:1,x:0}} transition={{delay:i*0.07}}
                  onClick={()=>setSel(p.id)}
                  className={`card cursor-pointer transition-all ${sel===p.id?"border-brand-400 ring-1 ring-brand-200 shadow-soft":""}`}>
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <p className="font-bold text-slate-800">{p.name}</p>
                      <p className="text-xs text-slate-400">{p.crop} · {p.size} ac · {p.phase}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`badge ${riskColor[p.pestRisk]}`}>{p.pestRisk} pest</span>
                      <span className={`badge ${p.health>80?"badge-green":p.health>60?"badge-amber":"badge-red"}`}>{p.health}%</span>
                    </div>
                  </div>

                  {/* Circular moisture */}
                  <div className="flex items-center gap-4">
                    <div className="relative w-14 h-14 flex-shrink-0">
                      <svg viewBox="0 0 56 56" className="w-full h-full -rotate-90">
                        <circle cx="28" cy="28" r="22" fill="none" stroke="#F1F5F9" strokeWidth="6"/>
                        <circle cx="28" cy="28" r="22" fill="none" strokeWidth="6"
                          stroke={mc} strokeDasharray={`${(p.moisture/100)*138} 138`}
                          strokeLinecap="round" style={{transition:"stroke-dasharray 1s ease"}}/>
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center flex-col">
                        <span className="text-[9px] font-bold text-slate-700">{Math.round(p.moisture)}%</span>
                      </div>
                    </div>
                    <div className="flex-1 space-y-1.5">
                      {[
                        {l:"Moisture", v:p.moisture,  max:100, c:mc},
                        {l:"Health",   v:p.health,    max:100, c:hc},
                        {l:"Temp",     v:p.temp,      max:45,  c:"#F59E0B"},
                      ].map(s=>(
                        <div key={s.l} className="flex items-center gap-2">
                          <span className="text-[9px] text-slate-400 w-12">{s.l}</span>
                          <div className="flex-1 progress"><div className="progress-fill" style={{width:`${(s.v/s.max)*100}%`,background:s.c}}/></div>
                          <span className="text-[9px] font-mono text-slate-600 w-7 text-right">{s.v}{s.l==="Temp"?"°":""}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-50">
                    <div className="flex gap-1.5">
                      <span className="text-[10px] text-slate-400">pH {p.ph}</span>
                      <span className="text-[10px] text-slate-300">·</span>
                      <span className="text-[10px] text-slate-400">NPK {p.npk.n}/{p.npk.p}/{p.npk.k}</span>
                    </div>
                    <span className={`badge text-[9px] ${getMoistureLabel(p.moisture)==="Critical"?"badge-red":getMoistureLabel(p.moisture)==="Low"?"badge-amber":"badge-green"}`}>
                      {getMoistureLabel(p.moisture)}
                    </span>
                  </div>
                </motion.div>
              );
            })}
            <button onClick={()=>setShowAdd(true)} className="flex items-center justify-center gap-2 w-full py-3 border-2 border-dashed border-slate-200 text-slate-400 hover:border-brand-300 hover:text-brand-600 rounded-xl text-sm font-medium transition-all">
              <Plus className="w-4 h-4"/> Add New Plot
            </button>
          </div>

          {/* Detail */}
          <div className="lg:col-span-8 space-y-4">
            {selPlot ? (
              <>
                <Card hover={false}>
                  <div className="flex items-start justify-between mb-5">
                    <div>
                      <h2 className="text-2xl font-bold text-slate-800">{selPlot.name}</h2>
                      <p className="text-slate-500 text-sm">{selPlot.crop} · {selPlot.size} acres · {selPlot.area} · {selPlot.phase}</p>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={()=>irrigate(selPlot.id)} className="btn btn-primary text-sm px-4 py-2">
                        <Droplets className="w-4 h-4"/> Irrigate
                      </button>
                      <button onClick={()=>deletePlot(selPlot.id)} className="btn btn-ghost text-sm px-3 py-2 text-rose-500 hover:bg-rose-50">
                        <Trash2 className="w-4 h-4"/>
                      </button>
                    </div>
                  </div>

                  {/* Stats grid */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
                    {[
                      {l:"Moisture",    v:`${Math.round(selPlot.moisture)}%`,               c:getMoistureColor(selPlot.moisture)},
                      {l:"Health",      v:`${selPlot.health}%`,                              c:getHealthColor(selPlot.health)},
                      {l:"Temperature", v:`${selPlot.temp}°C`,                              c:"#F59E0B"},
                      {l:"Soil pH",     v:selPlot.ph.toFixed(1),                            c:"#10B981"},
                      {l:"Nitrogen (N)",v:`${selPlot.npk.n} kg/ha`,                         c:"#3B82F6"},
                      {l:"Phosphorus",  v:`${selPlot.npk.p} kg/ha`,                         c:"#8B5CF6"},
                      {l:"Potassium",   v:`${selPlot.npk.k} kg/ha`,                         c:"#F59E0B"},
                      {l:"Pest Risk",   v:selPlot.pestRisk.toUpperCase(),                   c:selPlot.pestRisk==="high"?"#F43F5E":selPlot.pestRisk==="medium"?"#F59E0B":"#10B981"},
                    ].map(s=>(
                      <div key={s.l} className="bg-slate-50 rounded-xl p-3 border border-slate-100">
                        <div className="text-xs text-slate-400 mb-1">{s.l}</div>
                        <div className="text-xl font-bold" style={{color:s.c}}>{s.v}</div>
                      </div>
                    ))}
                  </div>

                  {/* Controls */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    <button onClick={()=>toggleAutoIrr(selPlot.id)}
                      className={`btn text-sm px-4 py-2 ${selPlot.autoIrr?"btn-primary":"btn-outline"}`}>
                      <Droplets className="w-4 h-4"/> Auto-Irrigate: {selPlot.autoIrr?"ON":"OFF"}
                    </button>
                    <button onClick={()=>{setNpk(selPlot.npk);setEditNPK(!editNPK);}}
                      className="btn btn-outline text-sm px-4 py-2">
                      <ChevronDown className={`w-4 h-4 transition-transform ${editNPK?"rotate-180":""}`}/> Update NPK
                    </button>
                    <button onClick={()=>setField(selPlot.id,"pestRisk",selPlot.pestRisk==="high"?"low":"high")}
                      className="btn btn-ghost text-sm px-4 py-2 text-rose-500 hover:bg-rose-50">
                      <Bug className="w-4 h-4"/> Toggle Pest Risk
                    </button>
                  </div>

                  <AnimatePresence>
                    {editNPK && (
                      <motion.div initial={{opacity:0,height:0}} animate={{opacity:1,height:"auto"}} exit={{opacity:0,height:0}}
                        className="bg-brand-50 rounded-xl p-4 border border-brand-100 mb-4">
                        <p className="text-xs font-semibold text-slate-500 mb-3 tracking-wider">UPDATE NPK VALUES (kg/ha)</p>
                        <div className="flex gap-3 items-end flex-wrap">
                          {[{k:"n",l:"Nitrogen (N)"},{k:"p",l:"Phosphorus (P)"},{k:"k",l:"Potassium (K)"}].map(({k,l})=>(
                            <div key={k} className="flex-1 min-w-[100px]">
                              <label className="text-xs font-semibold text-slate-500 block mb-1">{l}</label>
                              <input type="number" value={(npk as any)[k]} onChange={e=>setNpk(p=>({...p,[k]:+e.target.value}))}/>
                            </div>
                          ))}
                          <button onClick={saveNPK} className="btn btn-primary text-sm px-4 py-2.5">
                            <Save className="w-4 h-4"/> Save
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Moisture slider */}
                  <div>
                    <div className="flex justify-between mb-2">
                      <label className="text-xs font-semibold text-slate-500">MANUAL MOISTURE ADJUSTMENT</label>
                      <span className="text-xs font-bold text-brand-600">{Math.round(selPlot.moisture)}%</span>
                    </div>
                    <input type="range" min="5" max="95" value={selPlot.moisture}
                      onChange={e=>updateMoisture(selPlot.id,+e.target.value)}
                      className="w-full h-2 rounded-full appearance-none cursor-pointer"
                      style={{accentColor:"#10B981",background:`linear-gradient(to right, #10B981 ${selPlot.moisture}%, #E2E8F0 ${selPlot.moisture}%)`}}/>
                    <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                      <span>5% — Dry</span><span>50% — Good</span><span>95% — Optimal</span>
                    </div>
                  </div>
                </Card>

                <div className="grid md:grid-cols-2 gap-4">
                  <Card hover={false}>
                    <p className="text-xs font-semibold text-slate-400 mb-4">7-DAY MOISTURE & HEALTH TREND</p>
                    <ResponsiveContainer width="100%" height={160}>
                      <LineChart data={history}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false}/>
                        <XAxis dataKey="day" tick={{fill:"#94A3B8",fontSize:10}} axisLine={false} tickLine={false}/>
                        <YAxis tick={{fill:"#94A3B8",fontSize:10}} axisLine={false} tickLine={false} domain={[0,100]}/>
                        <Tooltip {...TT}/>
                        <Line type="monotone" dataKey="moisture" stroke="#10B981" strokeWidth={2.5} dot={false} name="Moisture %"/>
                        <Line type="monotone" dataKey="health" stroke="#3B82F6" strokeWidth={2} dot={false} strokeDasharray="4 4" name="Health %"/>
                      </LineChart>
                    </ResponsiveContainer>
                  </Card>
                  <Card hover={false}>
                    <p className="text-xs font-semibold text-slate-400 mb-4">FARM-WIDE COMPARISON</p>
                    <ResponsiveContainer width="100%" height={160}>
                      <RadarChart data={radarData} outerRadius={55}>
                        <PolarGrid stroke="#E2E8F0"/>
                        <PolarAngleAxis dataKey="id" tick={{fill:"#94A3B8",fontSize:10}}/>
                        <Radar name="Moisture" dataKey="moisture" stroke="#10B981" fill="#10B981" fillOpacity={0.15}/>
                        <Radar name="Health"   dataKey="health"   stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.1}/>
                        <Tooltip {...TT}/>
                      </RadarChart>
                    </ResponsiveContainer>
                  </Card>
                </div>
              </>
            ) : (
              <Card hover={false} className="flex items-center justify-center h-64 text-slate-400">
                Select a plot to view details
              </Card>
            )}
          </div>
        </div>
      </div>

      {/* Add plot modal */}
      <AnimatePresence>
        {showAdd && (
          <>
            <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50" onClick={()=>setShowAdd(false)}/>
            <motion.div initial={{opacity:0,scale:.95,y:20}} animate={{opacity:1,scale:1,y:0}} exit={{opacity:0,scale:.95}}
              className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-lg p-4">
              <Card hover={false} className="shadow-float border-brand-200">
                <div className="flex items-center justify-between mb-5">
                  <h3 className="font-bold text-xl text-slate-800">Add New Plot</h3>
                  <button onClick={()=>setShowAdd(false)} className="p-1.5 rounded-xl hover:bg-slate-100 text-slate-400"><X className="w-5 h-5"/></button>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    {l:"Plot ID",    k:"id",   t:"text"},
                    {l:"Plot Name",  k:"name", t:"text"},
                    {l:"Crop",       k:"crop", t:"text"},
                    {l:"Area (acres)",k:"size",t:"number"},
                    {l:"Phase",      k:"phase",t:"text"},
                    {l:"Soil pH",    k:"ph",   t:"number"},
                  ].map(({l,k,t})=>(
                    <div key={k}>
                      <label className="text-xs font-semibold text-slate-500 block mb-1">{l.toUpperCase()}</label>
                      <input type={t} value={(newPlot as any)[k]} onChange={e=>setNewPlot(p=>({...p,[k]:t==="number"?+e.target.value:e.target.value}))}/>
                    </div>
                  ))}
                  <div>
                    <label className="text-xs font-semibold text-slate-500 block mb-1">PEST RISK</label>
                    <select value={newPlot.pestRisk} onChange={e=>setNewPlot(p=>({...p,pestRisk:e.target.value as any}))}>
                      <option value="low">Low</option><option value="medium">Medium</option><option value="high">High</option>
                    </select>
                  </div>
                </div>
                <button onClick={handleAddPlot} className="btn btn-primary w-full mt-5 py-3">Add Plot to Farm</button>
              </Card>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
