"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Clock, MapPin, Check } from "lucide-react";
import { useFarmStore } from "@/lib/store";
import GreenCard from "@/components/GreenCard";

const daysInMonth = 30;
const firstDay = 3;

const suggestedTasks = [
  { day: 2, task: "Schedule post-rain fertilizer", plot: "Plot A", duration: "2 hrs", type: "weather" },
  { day: 5, task: "First irrigation cycle", plot: "Plot B", duration: "3 hrs", type: "crop" },
  { day: 8, task: "Pest inspection — Cotton", plot: "Plot C", duration: "1 hr", type: "alert" },
  { day: 12, task: "Market visit — Soybean sale", plot: "All", duration: "4 hrs", type: "market" },
  { day: 15, task: "Soil sampling for NPK", plot: "Plot D", duration: "2 hrs", type: "field" },
  { day: 18, task: "Harvest readiness check", plot: "Plot A", duration: "1.5 hrs", type: "crop" },
  { day: 22, task: "Equipment maintenance", plot: "Shed", duration: "3 hrs", type: "other" },
];

export default function CalendarPage() {
  const [selectedDate, setSelectedDate] = useState<number | null>(null);
  const activities = useFarmStore((s) => s.activities);
  const addActivity = useFarmStore((s) => s.addActivity);
  const [form, setForm] = useState({ type: "Field Work", crop: "Wheat", plot: "Plot A", description: "", duration: "", cost: "" });

  const getDaySuggestions = (day: number) => suggestedTasks.filter((t) => t.day === day);

  const logActivity = () => {
    if (!form.description) return;
    addActivity({ id: Date.now().toString(), type: form.type, plot: form.plot, description: form.description, timestamp: new Date().toLocaleString("en-IN"), duration: Number(form.duration) || 0, cost: Number(form.cost) || 0 });
    setForm({ type: "Field Work", crop: "Wheat", plot: "Plot A", description: "", duration: "", cost: "" });
  };

  return (
    <div className="pt-24 px-4 max-w-7xl mx-auto pb-12">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <h1 className="font-display text-4xl text-parchment mb-2">Farm Calendar</h1>
        <p className="font-data text-clay">Plan, track, and optimize your farm activities</p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <GreenCard>
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-display text-xl text-parchment">June 2026</h3>
              <div className="flex items-center gap-4 font-data text-xs text-clay">
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-moss" /> Field</span>
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-amber" /> Market</span>
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-rust" /> Alert</span>
              </div>
            </div>
            <div className="grid grid-cols-7 gap-1 mb-2">
              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => <div key={d} className="text-center font-data text-xs text-clay py-2">{d}</div>)}
            </div>
            <div className="grid grid-cols-7 gap-1">
              {Array.from({ length: firstDay }, (_, i) => <div key={`empty-${i}`} className="aspect-square" />)}
              {Array.from({ length: daysInMonth }, (_, i) => {
                const day = i + 1;
                const suggestions = getDaySuggestions(day);
                const isToday = day === 17;
                const isSelected = selectedDate === day;
                return (
                  <motion.button key={day} whileHover={{ scale: 1.05 }} onClick={() => setSelectedDate(day)}
                    className={`aspect-square rounded-lg p-1 relative transition-colors ${isSelected ? "bg-moss/20 border border-moss" : isToday ? "bg-amber/10 border border-amber" : "bg-void/30 hover:bg-loam/50"}`}>
                    <span className={`font-data text-sm ${isToday ? "text-amber font-bold" : "text-parchment"}`}>{day}</span>
                    <div className="absolute bottom-1 left-1 right-1 flex justify-center gap-0.5">
                      {suggestions.map((s, j) => <span key={j} className={`w-1.5 h-1.5 rounded-full ${s.type === "weather" || s.type === "field" ? "bg-moss" : s.type === "market" ? "bg-amber" : "bg-rust"}`} />)}
                    </div>
                  </motion.button>
                );
              })}
            </div>
          </GreenCard>

          <div className="mt-6">
            <h3 className="font-display text-lg text-parchment mb-4">Upcoming Tasks</h3>
            <div className="flex gap-3 overflow-x-auto pb-2">
              {suggestedTasks.map((task, i) => (
                <motion.div key={i} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}
                  className="glass-card p-4 min-w-[250px] flex-shrink-0">
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`w-2 h-2 rounded-full ${task.type === "weather" || task.type === "field" ? "bg-moss" : task.type === "market" ? "bg-amber" : "bg-rust"}`} />
                    <span className="font-data text-xs text-clay">June {task.day}</span>
                  </div>
                  <h4 className="font-display text-sm text-parchment mb-1">{task.task}</h4>
                  <div className="flex items-center gap-3 font-data text-[10px] text-clay">
                    <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {task.plot}</span>
                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {task.duration}</span>
                  </div>
                  <div className="flex gap-2 mt-3">
                    <button className="flex-1 py-1.5 bg-moss/20 text-fern rounded text-[10px] font-data hover:bg-moss/30 transition-colors">MARK DONE</button>
                    <button className="flex-1 py-1.5 bg-void text-clay rounded text-[10px] font-data hover:bg-loam transition-colors">SNOOZE</button>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        <div>
          <GreenCard className="sticky top-24">
            <h3 className="font-display text-lg text-parchment mb-4">Log Activity</h3>
            <div className="space-y-3">
              <div>
                <label className="font-data text-xs text-clay mb-1 block">Activity Type</label>
                <select className="w-full glass-input" value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>
                  {["Field Work", "Irrigation", "Harvest", "Market", "Treatment", "Other"].map((t) => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <div>
                <label className="font-data text-xs text-clay mb-1 block">Plot</label>
                <select className="w-full glass-input" value={form.plot} onChange={(e) => setForm({ ...form, plot: e.target.value })}>
                  {["Plot A", "Plot B", "Plot C", "Plot D", "Plot E", "Plot F", "All Plots"].map((p) => <option key={p} value={p}>{p}</option>)}
                </select>
              </div>
              <div>
                <label className="font-data text-xs text-clay mb-1 block">Description</label>
                <textarea className="w-full glass-input min-h-[80px]" placeholder="What did you do?" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div><label className="font-data text-xs text-clay mb-1 block">Duration (hrs)</label><input type="number" className="w-full glass-input" value={form.duration} onChange={(e) => setForm({ ...form, duration: e.target.value })} /></div>
                <div><label className="font-data text-xs text-clay mb-1 block">Cost (₹)</label><input type="number" className="w-full glass-input" value={form.cost} onChange={(e) => setForm({ ...form, cost: e.target.value })} /></div>
              </div>
              <button onClick={logActivity} className="w-full py-3 bg-moss hover:bg-fern text-parchment rounded-md font-display text-sm transition-colors">LOG ACTIVITY</button>
            </div>

            {selectedDate && (
              <div className="mt-6 pt-6 border-t border-bark">
                <h4 className="font-data text-xs text-clay mb-2">June {selectedDate} Activities</h4>
                <div className="space-y-2">
                  {getDaySuggestions(selectedDate).map((s, i) => <div key={i} className="p-2 bg-void/50 rounded text-xs font-data text-parchment">{s.task}</div>)}
                  {getDaySuggestions(selectedDate).length === 0 && <p className="text-clay text-xs font-data">No activities logged</p>}
                </div>
              </div>
            )}
          </GreenCard>
        </div>
      </div>
    </div>
  );
}