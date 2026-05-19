"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, Plus, X, CheckCircle2, Circle, Trash2, ChevronLeft, ChevronRight } from "lucide-react";
import { useFarmStore } from "@/lib/store";
import GreenCard from "@/components/GreenCard";

const TYPE_CONFIG = {
  irrigation: { color:"bg-fern/20 text-fern border-fern/30",   dot:"bg-fern",   label:"Irrigation" },
  fertilizer: { color:"bg-amber/20 text-amber border-amber/30", dot:"bg-amber",  label:"Fertilizer" },
  pesticide:  { color:"bg-rust/20 text-rust border-rust/30",    dot:"bg-rust",   label:"Pesticide"  },
  harvest:    { color:"bg-wheat/20 text-wheat border-wheat/30", dot:"bg-wheat",  label:"Harvest"    },
  planting:   { color:"bg-leaf/20 text-leaf border-leaf/30",    dot:"bg-leaf",   label:"Planting"   },
  other:      { color:"bg-clay/20 text-clay border-clay/30",    dot:"bg-clay",   label:"Other"      },
} as const;

const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];
const DAYS = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];

export default function FarmCalendar() {
  const { events, addEvent, toggleEventComplete, deleteEvent } = useFarmStore();
  const [viewDate, setViewDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0]);
  const [showAdd, setShowAdd] = useState(false);
  const [newEvent, setNewEvent] = useState({
    title:"", date:selectedDate,
    type:"irrigation" as keyof typeof TYPE_CONFIG,
    plot:"", notes:"", completed:false
  });

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month+1, 0).getDate();

  const calDays = Array.from({length:42}, (_,i) => {
    const d = i - firstDay + 1;
    return d >= 1 && d <= daysInMonth ? d : null;
  });

  const getEventsForDay = (day: number) => {
    const dateStr = `${year}-${String(month+1).padStart(2,"0")}-${String(day).padStart(2,"0")}`;
    return events.filter(e => e.date === dateStr);
  };

  const selectedEvents = events.filter(e => e.date === selectedDate).sort((a,b) => a.completed ? 1 : -1);
  const today = new Date().toISOString().split("T")[0];

  const handleAddEvent = () => {
    if (!newEvent.title) return;
    addEvent({ ...newEvent, id: Date.now().toString(), date: selectedDate });
    setShowAdd(false);
    setNewEvent({ title:"", date:selectedDate, type:"irrigation", plot:"", notes:"", completed:false });
  };

  const prevMonth = () => setViewDate(new Date(year, month-1, 1));
  const nextMonth = () => setViewDate(new Date(year, month+1, 1));

  // Upcoming events (next 14 days)
  const upcoming = events
    .filter(e => !e.completed && e.date >= today)
    .sort((a,b) => a.date.localeCompare(b.date))
    .slice(0,8);

  return (
    <div className="pt-24 min-h-screen bg-void px-4">
      <div className="max-w-6xl mx-auto py-8">
        <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-display text-4xl md:text-5xl text-parchment mb-1">Farm <span className="text-amber">Calendar</span></h1>
            <p className="font-data text-xs text-clay">Plan irrigation, fertilizer, pesticides, harvests and more</p>
          </div>
          <button onClick={() => setShowAdd(true)}
            className="flex items-center gap-2 px-5 py-2.5 bg-moss hover:bg-fern text-parchment rounded-xl font-display text-sm tracking-wider transition-all hover:scale-105">
            <Plus className="w-4 h-4"/> ADD EVENT
          </button>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Calendar grid */}
          <div className="lg:col-span-2">
            <GreenCard hover={false}>
              {/* Month nav */}
              <div className="flex items-center justify-between mb-6">
                <button onClick={prevMonth} className="p-2 hover:bg-loam rounded-lg text-clay hover:text-parchment transition-all"><ChevronLeft className="w-5 h-5"/></button>
                <h2 className="font-display text-xl text-parchment">{MONTHS[month]} {year}</h2>
                <button onClick={nextMonth} className="p-2 hover:bg-loam rounded-lg text-clay hover:text-parchment transition-all"><ChevronRight className="w-5 h-5"/></button>
              </div>

              {/* Day headers */}
              <div className="grid grid-cols-7 mb-2">
                {DAYS.map(d => <div key={d} className="text-center font-data text-[10px] text-clay py-2">{d}</div>)}
              </div>

              {/* Calendar days */}
              <div className="grid grid-cols-7 gap-1">
                {calDays.map((day, i) => {
                  if (!day) return <div key={i} />;
                  const dateStr = `${year}-${String(month+1).padStart(2,"0")}-${String(day).padStart(2,"0")}`;
                  const dayEvents = getEventsForDay(day);
                  const isToday = dateStr === today;
                  const isSelected = dateStr === selectedDate;
                  return (
                    <button key={i} onClick={() => setSelectedDate(dateStr)}
                      className={`relative aspect-square p-1.5 rounded-lg text-left transition-all ${isSelected?"bg-moss/30 border border-moss/50":isToday?"border border-amber/40 bg-amber/5":"hover:bg-loam/60 border border-transparent"}`}>
                      <span className={`font-data text-xs ${isToday?"text-amber":isSelected?"text-parchment":"text-clay"}`}>{day}</span>
                      {dayEvents.length > 0 && (
                        <div className="absolute bottom-1 left-1/2 -translate-x-1/2 flex gap-0.5">
                          {dayEvents.slice(0,3).map((e,j) => (
                            <div key={j} className={`w-1.5 h-1.5 rounded-full ${TYPE_CONFIG[e.type]?.dot||"bg-clay"} ${e.completed?"opacity-30":"opacity-100"}`}/>
                          ))}
                          {dayEvents.length > 3 && <span className="font-data text-[7px] text-clay">+{dayEvents.length-3}</span>}
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Legend */}
              <div className="flex flex-wrap gap-3 mt-5 pt-4 border-t border-bark/30">
                {Object.entries(TYPE_CONFIG).map(([k,v]) => (
                  <span key={k} className="flex items-center gap-1.5 font-data text-[10px] text-clay">
                    <span className={`w-2 h-2 rounded-full ${v.dot}`}/>
                    {v.label}
                  </span>
                ))}
              </div>
            </GreenCard>
          </div>

          {/* Right panel */}
          <div className="space-y-4">
            {/* Selected day events */}
            <GreenCard hover={false}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-display text-lg text-parchment">
                  {new Date(selectedDate + "T12:00:00").toLocaleDateString("en-IN",{day:"numeric",month:"short"})}
                </h3>
                <span className="font-data text-[10px] text-clay">{selectedEvents.length} events</span>
              </div>
              {selectedEvents.length === 0 ? (
                <div className="py-6 text-center">
                  <Calendar className="w-8 h-8 text-bark mx-auto mb-2"/>
                  <p className="font-data text-xs text-clay">No events. Add one!</p>
                  <button onClick={() => setShowAdd(true)} className="mt-3 font-data text-xs text-fern hover:underline">+ Add Event</button>
                </div>
              ) : (
                <div className="space-y-2">
                  {selectedEvents.map(ev => {
                    const cfg = TYPE_CONFIG[ev.type] || TYPE_CONFIG.other;
                    return (
                      <div key={ev.id} className={`p-3 rounded-lg border ${cfg.color} flex items-start gap-2`}>
                        <button onClick={() => toggleEventComplete(ev.id)} className="mt-0.5 flex-shrink-0">
                          {ev.completed ? <CheckCircle2 className="w-4 h-4 text-fern"/> : <Circle className="w-4 h-4 opacity-50"/>}
                        </button>
                        <div className="flex-1 min-w-0">
                          <p className={`font-display text-sm ${ev.completed?"line-through opacity-50":""}`}>{ev.title}</p>
                          {ev.plot && <p className="font-data text-[10px] opacity-70">Plot: {ev.plot}</p>}
                          {ev.notes && <p className="font-data text-[10px] opacity-60 mt-0.5">{ev.notes}</p>}
                        </div>
                        <button onClick={() => deleteEvent(ev.id)} className="flex-shrink-0 opacity-40 hover:opacity-100 transition-opacity">
                          <Trash2 className="w-3.5 h-3.5"/>
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </GreenCard>

            {/* Upcoming */}
            <GreenCard hover={false}>
              <h3 className="font-display text-base text-parchment mb-4">Upcoming (14 days)</h3>
              {upcoming.length === 0 ? (
                <p className="font-data text-xs text-clay text-center py-4">No upcoming events scheduled.</p>
              ) : (
                <div className="space-y-2">
                  {upcoming.map(ev => {
                    const cfg = TYPE_CONFIG[ev.type] || TYPE_CONFIG.other;
                    const d = new Date(ev.date + "T12:00:00");
                    return (
                      <div key={ev.id} className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-loam/40 cursor-pointer transition-colors" onClick={() => setSelectedDate(ev.date)}>
                        <div className={`w-1.5 h-8 rounded-full ${cfg.dot}`}/>
                        <div className="flex-1 min-w-0">
                          <p className="font-display text-xs text-parchment truncate">{ev.title}</p>
                          <p className="font-data text-[10px] text-clay">{cfg.label}</p>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <div className="font-data text-[10px] text-amber">{d.toLocaleDateString("en-IN",{day:"numeric",month:"short"})}</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </GreenCard>
          </div>
        </div>
      </div>

      {/* Add event modal */}
      <AnimatePresence>
        {showAdd && (
          <>
            <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="fixed inset-0 bg-void/80 backdrop-blur-sm z-50" onClick={()=>setShowAdd(false)}/>
            <motion.div initial={{opacity:0,scale:0.95}} animate={{opacity:1,scale:1}} exit={{opacity:0,scale:0.95}}
              className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-md">
              <GreenCard className="border-moss/30 shadow-2xl" hover={false}>
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-display text-xl text-parchment">Add Farm Event</h3>
                  <button onClick={()=>setShowAdd(false)} className="text-clay hover:text-parchment"><X className="w-5 h-5"/></button>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="font-data text-[10px] text-clay block mb-1.5">EVENT TITLE</label>
                    <input placeholder="e.g. Irrigate Plot A" value={newEvent.title} onChange={e=>setNewEvent(p=>({...p,title:e.target.value}))}/>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="font-data text-[10px] text-clay block mb-1.5">TYPE</label>
                      <select value={newEvent.type} onChange={e=>setNewEvent(p=>({...p,type:e.target.value as any}))}>
                        {Object.entries(TYPE_CONFIG).map(([k,v]) => <option key={k} value={k}>{v.label}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="font-data text-[10px] text-clay block mb-1.5">DATE</label>
                      <input type="date" value={selectedDate} onChange={e=>setSelectedDate(e.target.value)} className="[color-scheme:dark]"/>
                    </div>
                  </div>
                  <div>
                    <label className="font-data text-[10px] text-clay block mb-1.5">PLOT (optional)</label>
                    <input placeholder="e.g. Plot A, Plot B" value={newEvent.plot} onChange={e=>setNewEvent(p=>({...p,plot:e.target.value}))}/>
                  </div>
                  <div>
                    <label className="font-data text-[10px] text-clay block mb-1.5">NOTES</label>
                    <textarea rows={2} placeholder="Additional notes..." value={newEvent.notes} onChange={e=>setNewEvent(p=>({...p,notes:e.target.value}))}/>
                  </div>
                  <button onClick={handleAddEvent} className="w-full py-3 bg-moss hover:bg-fern text-parchment rounded-xl font-display text-sm tracking-wider transition-all">
                    ADD EVENT
                  </button>
                </div>
              </GreenCard>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
