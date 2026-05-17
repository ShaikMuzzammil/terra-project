"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Droplets, Thermometer, Activity, AlertTriangle, TrendingUp, CloudRain, X, ChevronRight, Sprout } from "lucide-react";
import { useFarmStore } from "@/lib/store";
import GreenCard from "@/components/GreenCard";
import { BarChart, Bar, LineChart, Line, AreaChart, Area, RadarChart, Radar, PolarGrid, PolarAngleAxis, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const rainfallData = [
  { day: "Mon", rain: 12, avg: 8 }, { day: "Tue", rain: 0, avg: 8 }, { day: "Wed", rain: 45, avg: 8 },
  { day: "Thu", rain: 8, avg: 8 }, { day: "Fri", rain: 0, avg: 8 }, { day: "Sat", rain: 22, avg: 8 }, { day: "Sun", rain: 5, avg: 8 },
];
const tempData = [
  { day: "Mon", max: 35, min: 24 }, { day: "Tue", max: 36, min: 25 }, { day: "Wed", max: 33, min: 23 },
  { day: "Thu", max: 34, min: 24 }, { day: "Fri", max: 37, min: 26 }, { day: "Sat", max: 38, min: 27 }, { day: "Sun", max: 36, min: 25 },
];
const healthData = [
  { subject: "Moisture", A: 80, fullMark: 100 }, { subject: "Nutrition", A: 75, fullMark: 100 },
  { subject: "Sunlight", A: 90, fullMark: 100 }, { subject: "Pest Risk", A: 85, fullMark: 100 },
  { subject: "Growth", A: 88, fullMark: 100 }, { subject: "Yield", A: 82, fullMark: 100 },
];

export default function Dashboard() {
  const { plots, alerts, dismissAlert, activities, addActivity } = useFarmStore();
  const [selectedPlot, setSelectedPlot] = useState<string | null>(null);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      plots.forEach((plot) => {
        const change = (Math.random() - 0.5) * 4;
        const newMoisture = Math.max(10, Math.min(95, plot.moisture + change));
        useFarmStore.getState().updatePlotMoisture(plot.id, newMoisture);
      });
    }, 10000);
    return () => clearInterval(interval);
  }, [plots]);

  const activeAlerts = alerts.filter((a) => !a.dismissed);
  const selectedPlotData = plots.find((p) => p.id === selectedPlot);
  const getHealthColor = (moisture: number) => moisture >= 70 ? "#95D5B2" : moisture >= 40 ? "#E9A319" : "#C0392B";

  return (
    <div className="pt-20 min-h-screen bg-void">
      <div className="fixed top-16 left-0 right-0 z-30 bg-soil/95 backdrop-blur border-b border-bark h-12 flex items-center px-4 justify-between">
        <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-leaf animate-pulse" /><span className="font-data text-xs text-fern">ALL SYSTEMS ACTIVE</span></div>
        <div className="font-data text-xs text-clay">🌾 KHARIF SEASON 2026 // Day 47 of 120</div>
        <div className="font-data text-xs text-parchment">{currentTime.toLocaleTimeString("en-IN")} • 33°C</div>
      </div>

      <div className="pt-12 px-4 max-w-[1600px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 py-6">
          <div className="lg:col-span-3 space-y-3">
            <h3 className="font-display text-lg text-parchment px-2 mb-2">Farm Plots</h3>
            {plots.map((plot, i) => (
              <motion.div key={plot.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }}
                onClick={() => setSelectedPlot(plot.id)}
                className={`glass-card p-4 cursor-pointer transition-all ${selectedPlot === plot.id ? "border-l-4 border-l-moss bg-loam/80" : ""}`}>
                <div className="flex justify-between items-start mb-3">
                  <div><h4 className="font-display text-parchment">{plot.name}</h4><span className="font-data text-xs text-clay">{plot.crop}</span></div>
                  <span className={`px-2 py-1 rounded text-[10px] font-data ${plot.health > 80 ? "bg-leaf/20 text-leaf" : plot.health > 50 ? "bg-amber/20 text-amber" : "bg-rust/20 text-rust"}`}>{plot.health}%</span>
                </div>
                <div className="space-y-2">
                  {[{ label: "🌡 Temp", value: plot.temperature, max: 45, color: "bg-amber" }, { label: "💧 Moisture", value: plot.moisture, max: 100, color: "bg-fern" }, { label: "🌿 Health", value: plot.health, max: 100, color: "bg-leaf" }].map((stat) => (
                    <div key={stat.label} className="flex items-center gap-2">
                      <span className="font-data text-[10px] text-clay w-16">{stat.label}</span>
                      <div className="flex-1 h-1.5 bg-void rounded-full overflow-hidden">
                        <motion.div initial={{ width: 0 }} animate={{ width: `${(stat.value / stat.max) * 100}%` }} transition={{ duration: 0.8, type: "spring" }} className={`h-full ${stat.color} rounded-full`} />
                      </div>
                      <span className="font-data text-[10px] text-parchment w-8 text-right">{Math.round(stat.value)}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
            <Link href="/field-monitor" className="flex items-center justify-center gap-2 w-full py-3 border border-dashed border-moss/50 text-moss hover:bg-moss/10 rounded-lg font-data text-sm transition-colors">+ ADD PLOT</Link>
          </div>

          <div className="lg:col-span-6 space-y-4">
            <GreenCard className="h-[400px] relative overflow-hidden">
              <h3 className="font-display text-lg text-parchment mb-4">Farm Layout Monitor</h3>
              <svg viewBox="0 0 600 300" className="w-full h-full">
                {plots.map((plot, i) => {
                  const positions = [{ x: 20, y: 20, w: 180, h: 120 }, { x: 220, y: 20, w: 160, h: 120 }, { x: 400, y: 20, w: 180, h: 120 }, { x: 20, y: 160, w: 200, h: 120 }, { x: 240, y: 160, w: 160, h: 120 }, { x: 420, y: 160, w: 160, h: 120 }];
                  const pos = positions[i]; const color = getHealthColor(plot.moisture);
                  return (
                    <g key={plot.id} className="cursor-pointer" onClick={() => setSelectedPlot(plot.id)}>
                      <rect x={pos.x} y={pos.y} width={pos.w} height={pos.h} rx="8" fill={color} fillOpacity="0.2" stroke={color} strokeWidth="2" className="transition-all duration-1000">
                        <animate attributeName="stroke-opacity" values="0.5;1;0.5" dur="3s" repeatCount="indefinite" />
                      </rect>
                      <text x={pos.x + pos.w / 2} y={pos.y + pos.h / 2 - 10} textAnchor="middle" fill="#F5E6C8" fontSize="14" fontFamily="Fraunces">{plot.id}</text>
                      <text x={pos.x + pos.w / 2} y={pos.y + pos.h / 2 + 10} textAnchor="middle" fill="#8B5E3C" fontSize="10" fontFamily="Space Mono">{plot.crop}</text>
                      <text x={pos.x + pos.w / 2} y={pos.y + pos.h / 2 + 25} textAnchor="middle" fill={color} fontSize="10" fontFamily="Space Mono">{Math.round(plot.moisture)}% moisture</text>
                    </g>
                  );
                })}
              </svg>
            </GreenCard>

            <div className="flex gap-2 overflow-x-auto pb-2">
              {activeAlerts.map((alert) => (
                <motion.div key={alert.id} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full whitespace-nowrap ${alert.severity === "critical" || alert.severity === "high" ? "bg-rust/20 text-rust border border-rust/50 animate-pulse" : alert.severity === "medium" ? "bg-amber/20 text-amber border border-amber/50" : "bg-moss/20 text-fern border border-moss/50"}`}>
                  <span className="text-sm">{alert.type === "weather" ? "🌧️" : alert.type === "pest" ? "🐛" : alert.type === "price" ? "📈" : "⚠️"}</span>
                  <span className="font-data text-xs">{alert.message}</span>
                  <button onClick={() => dismissAlert(alert.id)} className="hover:text-parchment"><X className="w-3 h-3" /></button>
                </motion.div>
              ))}
            </div>

            {selectedPlotData && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-6">
                <div className="flex justify-between items-start mb-4">
                  <div><h3 className="font-display text-xl text-parchment">{selectedPlotData.name}</h3><p className="font-data text-sm text-clay">{selectedPlotData.crop} • {selectedPlotData.size} acres</p></div>
                  <button onClick={() => setSelectedPlot(null)} className="text-clay hover:text-parchment"><X className="w-5 h-5" /></button>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  {[{ label: "Moisture", value: `${Math.round(selectedPlotData.moisture)}%`, color: "text-fern" }, { label: "Health", value: `${selectedPlotData.health}%`, color: "text-leaf" }, { label: "NPK", value: `${selectedPlotData.npk.n}/${selectedPlotData.npk.p}/${selectedPlotData.npk.k}`, color: "text-amber" }, { label: "Last Irrigated", value: selectedPlotData.lastIrrigated, color: "text-clay" }].map((stat) => (
                    <div key={stat.label} className="bg-void/50 p-3 rounded-lg"><div className="font-data text-[10px] text-clay uppercase">{stat.label}</div><div className={`font-accent text-xl ${stat.color}`}>{stat.value}</div></div>
                  ))}
                </div>
                <div className="flex gap-2">
                  <button onClick={() => { useFarmStore.getState().updatePlotMoisture(selectedPlotData.id, Math.min(95, selectedPlotData.moisture + 15)); addActivity({ id: Date.now().toString(), type: "Irrigation", plot: selectedPlotData.name, description: `Manual irrigation triggered`, timestamp: new Date().toLocaleTimeString("en-IN"), duration: 30 }); }}
                    className="flex items-center gap-2 px-4 py-2 bg-moss hover:bg-fern text-parchment rounded-md font-data text-sm transition-colors"><Droplets className="w-4 h-4" />IRRIGATE NOW</button>
                  <Link href="/field-monitor" className="flex items-center gap-2 px-4 py-2 border border-bark hover:border-amber text-clay hover:text-amber rounded-md font-data text-sm transition-colors">FULL REPORT <ChevronRight className="w-4 h-4" /></Link>
                </div>
              </motion.div>
            )}
          </div>

          <div className="lg:col-span-3 space-y-4">
            <GreenCard className="h-[300px] overflow-hidden">
              <h3 className="font-display text-sm text-parchment mb-3 flex items-center gap-2"><Activity className="w-4 h-4 text-amber" />ACTIVITY FEED</h3>
              <div className="space-y-2 overflow-y-auto h-[240px] pr-2">
                {activities.map((activity) => (
                  <div key={activity.id} className="flex items-start gap-2 text-xs font-data p-2 rounded bg-void/30">
                    <span className="text-clay shrink-0">{activity.timestamp}</span><span className="text-parchment">{activity.description}</span>
                  </div>
                ))}
              </div>
            </GreenCard>
            <div className="grid grid-cols-2 gap-2">
              {[{ label: "IRRIGATE ALL", icon: Droplets, href: "/field-monitor" }, { label: "LOG ACTIVITY", icon: Activity, href: "/calendar" }, { label: "WEEKLY REPORT", icon: TrendingUp, action: () => { fetch("/api/report/weekly", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email: "farmer@example.com", farmData: { plots: 6, health: 82, irrigation: 12 } }) }); } }, { label: "SET ALERT", icon: AlertTriangle, href: "/market" }].map((action) => (
                <button key={action.label} onClick={() => action.action ? action.action() : window.location.href = action.href}
                  className="flex flex-col items-center gap-1 p-3 glass-card hover:border-amber transition-colors text-center">
                  <action.icon className="w-5 h-5 text-amber" /><span className="font-data text-[10px] text-parchment">{action.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pb-8">
          <GreenCard>
            <h4 className="font-data text-xs text-clay mb-4">7-DAY RAINFALL (mm)</h4>
            <ResponsiveContainer width="100%" height={150}>
              <BarChart data={rainfallData}><CartesianGrid strokeDasharray="3 3" stroke="#3D2410" /><XAxis dataKey="day" tick={{ fill: "#8B5E3C", fontSize: 10, fontFamily: "Space Mono" }} /><Tooltip contentStyle={{ backgroundColor: "#1A0E05", border: "1px solid #3D2410", borderRadius: "6px" }} /><Bar dataKey="rain" fill="#2D6A4F" radius={[4, 4, 0, 0]} /><Line type="monotone" dataKey="avg" stroke="#E9A319" strokeDasharray="5 5" dot={false} /></BarChart>
            </ResponsiveContainer>
          </GreenCard>
          <GreenCard>
            <h4 className="font-data text-xs text-clay mb-4">TEMPERATURE TREND (°C)</h4>
            <ResponsiveContainer width="100%" height={150}>
              <AreaChart data={tempData}>
                <defs><linearGradient id="tempGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#E9A319" stopOpacity={0.3} /><stop offset="95%" stopColor="#E9A319" stopOpacity={0} /></linearGradient></defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#3D2410" /><XAxis dataKey="day" tick={{ fill: "#8B5E3C", fontSize: 10, fontFamily: "Space Mono" }} /><Tooltip contentStyle={{ backgroundColor: "#1A0E05", border: "1px solid #3D2410" }} />
                <Area type="monotone" dataKey="max" stroke="#E9A319" fill="url(#tempGrad)" /><Line type="monotone" dataKey="min" stroke="#52B788" dot={false} strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </GreenCard>
          <GreenCard>
            <h4 className="font-data text-xs text-clay mb-4">CROP HEALTH INDEX</h4>
            <ResponsiveContainer width="100%" height={150}>
              <RadarChart data={healthData}><PolarGrid stroke="#3D2410" /><PolarAngleAxis dataKey="subject" tick={{ fill: "#8B5E3C", fontSize: 9, fontFamily: "Space Mono" }} /><Radar name="Health" dataKey="A" stroke="#2D6A4F" fill="#2D6A4F" fillOpacity={0.3} /></RadarChart>
            </ResponsiveContainer>
          </GreenCard>
        </div>
      </div>
    </div>
  );
}