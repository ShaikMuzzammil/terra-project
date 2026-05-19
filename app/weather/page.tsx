"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { CloudRain, Wind, Droplets, Eye, Thermometer, Gauge, Sun, AlertTriangle } from "lucide-react";
import GreenCard from "@/components/GreenCard";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";

const tooltipStyle = { backgroundColor:"#0A0600", border:"1px solid #3D2410", borderRadius:"6px", fontFamily:"Space Mono", fontSize:"11px", color:"#F5E6C8" };

const forecast = [
  { day:"Today",  high:36, low:24, rain:10,  icon:"⛅", desc:"Partly Cloudy",  humidity:68, wind:12 },
  { day:"Tue",    high:34, low:23, rain:60,  icon:"🌧", desc:"Rain Likely",     humidity:80, wind:18 },
  { day:"Wed",    high:32, low:22, rain:80,  icon:"⛈",  desc:"Thunderstorm",   humidity:88, wind:25 },
  { day:"Thu",    high:33, low:23, rain:30,  icon:"🌦", desc:"Showers",         humidity:75, wind:15 },
  { day:"Fri",    high:35, low:24, rain:5,   icon:"☀️", desc:"Mostly Clear",   humidity:60, wind:10 },
  { day:"Sat",    high:37, low:26, rain:0,   icon:"☀️", desc:"Clear",           humidity:55, wind:8  },
  { day:"Sun",    high:38, low:27, rain:0,   icon:"☀️", desc:"Hot & Clear",    humidity:50, wind:9  },
];

const hourly = Array.from({length:24}, (_,i) => ({
  hour: `${i.toString().padStart(2,"0")}:00`,
  temp: 24 + Math.sin((i-6)*Math.PI/12)*10 + (Math.random()-0.5)*2,
  rain: i>=12&&i<=18 ? Math.random()*5 : 0,
}));

const farmAdvisory = [
  { icon:"💧", title:"Irrigation Advisory", msg:"Rain expected Wed–Thu. Skip irrigation for Plot A & D on Tuesday. Save ≈₹800 in water costs.", severity:"info" },
  { icon:"⚗️",  title:"Fertilizer Application", msg:"Avoid DAP application until after the rain cycle. Apply between Fri–Sat for best uptake.", severity:"warning" },
  { icon:"🐛", title:"Pest Risk Post-Rain", msg:"High pest activity expected after rains. Inspect Plot C for armyworm on Friday morning.", severity:"danger" },
  { icon:"🌾", title:"Harvest Window", msg:"Ideal dry weather Fri–Sun. Soybean plots ready for harvest — schedule combine harvester now.", severity:"success" },
];

const sovColor = { info:"border-fern/40 bg-fern/5 text-fern", warning:"border-amber/40 bg-amber/5 text-amber", danger:"border-rust/40 bg-rust/5 text-rust", success:"border-leaf/40 bg-leaf/5 text-leaf" };

export default function Weather() {
  const [currentHour, setCurrentHour] = useState(new Date().getHours());

  useEffect(() => {
    const iv = setInterval(() => setCurrentHour(new Date().getHours()), 60000);
    return () => clearInterval(iv);
  }, []);

  const current = hourly[currentHour];

  return (
    <div className="pt-24 min-h-screen bg-void px-4">
      <div className="max-w-6xl mx-auto py-8">
        {/* Header */}
        <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} className="mb-8">
          <h1 className="font-display text-4xl md:text-5xl text-parchment mb-2">Weather <span className="text-amber">Intelligence</span></h1>
          <p className="font-data text-xs text-clay">Hyper-local farm forecasts · Telangana, India · Updated every 30 minutes</p>
        </motion.div>

        {/* Current conditions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} className="md:col-span-2">
            <GreenCard className="p-8" hover={false}>
              <div className="flex items-start justify-between mb-6">
                <div>
                  <div className="font-data text-[10px] text-clay tracking-widest mb-2">CURRENT CONDITIONS · FARM LOCATION</div>
                  <div className="flex items-end gap-4">
                    <span className="font-accent text-7xl text-amber">{Math.round(current?.temp||33)}°C</span>
                    <div className="pb-2">
                      <div className="text-4xl mb-1">{forecast[0].icon}</div>
                      <div className="font-display text-lg text-parchment">{forecast[0].desc}</div>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-data text-[10px] text-clay">Feels Like</div>
                  <div className="font-accent text-2xl text-parchment">{Math.round((current?.temp||33)+2)}°C</div>
                </div>
              </div>
              <div className="grid grid-cols-4 gap-4 border-t border-bark/40 pt-5">
                {[
                  { icon:Droplets,    label:"Humidity",    val:`${forecast[0].humidity}%` },
                  { icon:Wind,        label:"Wind",        val:`${forecast[0].wind} km/h` },
                  { icon:Eye,         label:"Visibility",  val:"8 km" },
                  { icon:Gauge,       label:"Pressure",    val:"1012 hPa" },
                ].map(s => (
                  <div key={s.label} className="text-center">
                    <s.icon className="w-4 h-4 text-clay mx-auto mb-2"/>
                    <div className="font-data text-[10px] text-clay mb-1">{s.label}</div>
                    <div className="font-display text-base text-parchment">{s.val}</div>
                  </div>
                ))}
              </div>
            </GreenCard>
          </motion.div>

          <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{delay:0.1}}>
            <GreenCard className="h-full flex flex-col" hover={false}>
              <h3 className="font-data text-[10px] text-clay tracking-widest mb-4">TODAY'S RANGE & RAIN</h3>
              <div className="space-y-4 flex-1">
                <div>
                  <div className="flex justify-between font-data text-xs text-clay mb-2">
                    <span>Low: {forecast[0].low}°C</span>
                    <span>High: {forecast[0].high}°C</span>
                  </div>
                  <div className="h-2 bg-void rounded-full overflow-hidden">
                    <div className="h-full rounded-full" style={{ background:"linear-gradient(to right,#52B788,#E9A319,#C0392B)", width:"100%" }}/>
                  </div>
                </div>
                <div className="pt-2 border-t border-bark/30">
                  <div className="font-data text-[10px] text-clay mb-2">RAIN PROBABILITY</div>
                  <div className="font-accent text-5xl text-fern mb-1">{forecast[0].rain}%</div>
                  <p className="font-data text-[10px] text-clay">{forecast[0].rain>50?"Rain expected today — consider delaying field work.":"Good conditions for outdoor farm activities."}</p>
                </div>
                <div className="pt-2 border-t border-bark/30">
                  <div className="font-data text-[10px] text-clay mb-1">UV INDEX</div>
                  <div className="font-accent text-2xl text-amber">8 — Very High</div>
                  <p className="font-data text-[10px] text-clay">Avoid outdoor work 11am–3pm</p>
                </div>
              </div>
            </GreenCard>
          </motion.div>
        </div>

        {/* Hourly chart */}
        <motion.div initial={{opacity:0}} whileInView={{opacity:1}} viewport={{once:true}} className="mb-6">
          <GreenCard hover={false}>
            <h3 className="font-display text-lg text-parchment mb-4">24-Hour Temperature & Rain</h3>
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={hourly} margin={{top:5,right:10,bottom:5,left:0}}>
                <defs>
                  <linearGradient id="tempG" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#E9A319" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#E9A319" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="rainG" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#52B788" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#52B788" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#3D2410" vertical={false}/>
                <XAxis dataKey="hour" tick={{fill:"#8B5E3C",fontSize:9,fontFamily:"Space Mono"}} axisLine={false} tickLine={false} interval={3}/>
                <YAxis tick={{fill:"#8B5E3C",fontSize:9,fontFamily:"Space Mono"}} axisLine={false} tickLine={false}/>
                <Tooltip contentStyle={tooltipStyle}/>
                <Area type="monotone" dataKey="temp" stroke="#E9A319" fill="url(#tempG)" strokeWidth={2} name="Temp (°C)"/>
                <Area type="monotone" dataKey="rain" stroke="#52B788" fill="url(#rainG)" strokeWidth={1.5} name="Rain (mm)"/>
              </AreaChart>
            </ResponsiveContainer>
          </GreenCard>
        </motion.div>

        {/* 7-day forecast */}
        <motion.div initial={{opacity:0}} whileInView={{opacity:1}} viewport={{once:true}} className="mb-6">
          <GreenCard hover={false}>
            <h3 className="font-display text-lg text-parchment mb-5">7-Day Forecast</h3>
            <div className="grid grid-cols-7 gap-2">
              {forecast.map((day, i) => (
                <motion.div key={day.day} initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} transition={{delay:i*0.06}}
                  className={`text-center p-3 rounded-xl border transition-all ${i===0?"border-amber/40 bg-amber/5":"border-bark/30 hover:border-moss/30"}`}>
                  <div className="font-data text-[10px] text-clay mb-2">{day.day}</div>
                  <div className="text-2xl mb-2">{day.icon}</div>
                  <div className="font-display text-sm text-parchment mb-0.5">{day.high}°</div>
                  <div className="font-data text-[10px] text-clay mb-2">{day.low}°</div>
                  <div className={`font-data text-[9px] ${day.rain>50?"text-fern":day.rain>20?"text-amber":"text-clay"}`}>{day.rain}%</div>
                  <div className="mt-2 h-1 bg-void rounded-full overflow-hidden">
                    <div className="h-full bg-fern rounded-full" style={{width:`${day.rain}%`, opacity:0.7}}/>
                  </div>
                </motion.div>
              ))}
            </div>
          </GreenCard>
        </motion.div>

        {/* Farm advisory */}
        <motion.div initial={{opacity:0}} whileInView={{opacity:1}} viewport={{once:true}}>
          <h2 className="font-display text-2xl text-parchment mb-4">Farm Advisory</h2>
          <div className="grid md:grid-cols-2 gap-3">
            {farmAdvisory.map((adv, i) => (
              <motion.div key={adv.title} initial={{opacity:0,x:-20}} whileInView={{opacity:1,x:0}} viewport={{once:true}} transition={{delay:i*0.08}}>
                <GreenCard className={`border-l-4 ${(sovColor as any)[adv.severity]}`}>
                  <div className="flex items-start gap-3">
                    <span className="text-2xl mt-1">{adv.icon}</span>
                    <div>
                      <h4 className="font-display text-base text-parchment mb-1">{adv.title}</h4>
                      <p className="font-data text-xs text-clay leading-relaxed">{adv.msg}</p>
                    </div>
                  </div>
                </GreenCard>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
