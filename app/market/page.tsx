"use client";

import { useEffect, useState, useMemo } from "react";
import { motion } from "framer-motion";
import { TrendingUp, ArrowUp, ArrowDown, Bell, Calculator, X, Filter } from "lucide-react";
import { CROPS, getLivePrices, formatCurrency, MANDI_DATA, generateSparkline } from "@/lib/utils";
import { useFarmStore } from "@/lib/store";
import GreenCard from "@/components/GreenCard";
import PriceTicker from "@/components/PriceTicker";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, BarChart, Bar } from "recharts";

const tooltipStyle = { backgroundColor:"#0A0600", border:"1px solid #3D2410", borderRadius:"6px", fontFamily:"Space Mono", fontSize:"11px", color:"#F5E6C8" };

const COST_PRESETS: Record<string, { seed:number; fert:number; labor:number; irr:number; pest:number; other:number }> = {
  wheat:   { seed:1200, fert:3500, labor:4500, irr:2000, pest:1200, other:800 },
  rice:    { seed:1500, fert:4200, labor:5500, irr:3000, pest:1500, other:1000 },
  maize:   { seed:900,  fert:3000, labor:3500, irr:1500, pest:1000, other:600 },
  soybean: { seed:2000, fert:2800, labor:4000, irr:1800, pest:1800, other:900 },
  cotton:  { seed:3000, fert:5000, labor:6000, irr:2500, pest:2500, other:1200 },
  onion:   { seed:2500, fert:3500, labor:5000, irr:2000, pest:1500, other:1000 },
  tomato:  { seed:3500, fert:4000, labor:6000, irr:2500, pest:2000, other:1500 },
  potato:  { seed:8000, fert:4500, labor:5000, irr:2200, pest:1800, other:1100 },
};

export default function Market() {
  const [prices, setPrices] = useState<Record<string,any>>({});
  const [selectedCrop, setSelectedCrop] = useState("wheat");
  const [sparklines, setSparklines] = useState<Record<string,any[]>>({});
  const [activeTab, setActiveTab] = useState<"prices"|"calculator"|"mandis"|"alerts">("prices");
  const [alertSent, setAlertSent] = useState(false);
  const [alertForm, setAlertForm] = useState({ commodity:"wheat", type:"above" as "above"|"below", threshold:"", email:"" });
  const { priceAlerts, addPriceAlert, removePriceAlert } = useFarmStore();

  const [calc, setCalc] = useState({
    crop:"wheat", area:5, yieldPerAcre:42, sellingPrice:2150,
    seed:1200, fert:3500, labor:4500, irr:2000, pest:1200, other:800,
  });

  useEffect(() => {
    const p = getLivePrices();
    setPrices(p);
    const sl: Record<string,any[]> = {};
    Object.entries(CROPS).forEach(([key,data]) => { sl[key] = generateSparkline(data.base, 30); });
    setSparklines(sl);
    const iv = setInterval(() => setPrices(getLivePrices()), 60000);
    return () => clearInterval(iv);
  }, []);

  useEffect(() => {
    const preset = COST_PRESETS[calc.crop] || COST_PRESETS.wheat;
    const cropData = CROPS[calc.crop as keyof typeof CROPS];
    setCalc(p => ({...p, ...preset, sellingPrice: prices[calc.crop]?.current || cropData?.base || 2000, yieldPerAcre: ({wheat:42,rice:55,maize:48,soybean:18,cotton:15,onion:180,tomato:220,potato:200} as any)[calc.crop]||40 }));
  }, [calc.crop, prices]);

  const results = useMemo(() => {
    const totalYield = calc.area * calc.yieldPerAcre;
    const revenue = totalYield * calc.sellingPrice;
    const costPerAcre = calc.seed + calc.fert + calc.labor + calc.irr + calc.pest + calc.other;
    const totalCost = calc.area * costPerAcre;
    const profit = revenue - totalCost;
    const margin = revenue > 0 ? (profit/revenue)*100 : 0;
    const breakEven = totalYield > 0 ? totalCost/totalYield : 0;
    const roi = totalCost > 0 ? (profit/totalCost)*100 : 0;
    return { totalYield, revenue, totalCost, profit, margin, breakEven, roi };
  }, [calc]);

  const mandiPrices = MANDI_DATA.filter(m => m.crops.includes(selectedCrop)).map(m => ({
    ...m, price: Math.round((prices[selectedCrop]?.current || CROPS[selectedCrop as keyof typeof CROPS]?.base || 2000) * (0.96 + Math.random()*0.08)),
    arrival: `${Math.floor(500+Math.random()*2000)} qtl`
  }));

  const handleSendAlert = () => {
    if (!alertForm.threshold) return;
    addPriceAlert({ id:Date.now().toString(), commodity:alertForm.commodity, type:alertForm.type, threshold:Number(alertForm.threshold), email:alertForm.email });
    setAlertSent(true);
    setTimeout(() => setAlertSent(false), 3000);
    setAlertForm(p => ({...p, threshold:"", email:""}));
  };

  const tabs = [
    { id:"prices",     label:"Live Prices",  icon:TrendingUp },
    { id:"calculator", label:"P&L Calc",     icon:Calculator },
    { id:"mandis",     label:"Mandi Rates",  icon:Filter },
    { id:"alerts",     label:"Price Alerts", icon:Bell },
  ] as const;

  return (
    <div className="pt-24 min-h-screen bg-void">
      <PriceTicker />

      <div className="px-4 max-w-7xl mx-auto py-8">
        {/* Header */}
        <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} className="mb-8">
          <h1 className="font-display text-4xl md:text-5xl text-parchment mb-2">Live Market <span className="text-amber">Intelligence</span></h1>
          <p className="font-data text-xs text-clay">MSP + mandi rates · Updated every 60 seconds · 600+ markets tracked</p>
        </motion.div>

        {/* Tabs */}
        <div className="flex gap-1 mb-8 bg-loam/40 p-1 rounded-xl border border-bark/30 w-fit">
          {tabs.map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-lg font-data text-xs tracking-wide transition-all ${activeTab===tab.id ? "bg-moss text-parchment shadow-sm" : "text-clay hover:text-parchment"}`}>
              <tab.icon className="w-3.5 h-3.5" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* PRICES TAB */}
        {activeTab === "prices" && (
          <div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 mb-8">
              {Object.entries(CROPS).map(([key, data], i) => {
                const p = prices[key];
                const isUp = (p?.change||0) >= 0;
                const isSelected = selectedCrop === key;
                return (
                  <motion.div key={key} initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{delay:i*0.05}}
                    onClick={() => setSelectedCrop(key)}
                    className={`glass-card p-4 cursor-pointer transition-all duration-200 ${isSelected ? "border-amber/60 bg-amber/5 shadow-lg shadow-amber/10" : "hover:border-bark/80"}`}>
                    <div className="flex justify-between items-start mb-3">
                      <span className="text-2xl">{data.emoji}</span>
                      <span className={`font-data text-[10px] px-2 py-0.5 rounded-full ${isUp ? "bg-fern/15 text-fern" : "bg-rust/15 text-rust"}`}>
                        {isUp?"▲":"▼"}{Math.abs(p?.changePercent||0).toFixed(1)}%
                      </span>
                    </div>
                    <div className="font-display text-sm text-parchment uppercase mb-1">{key}</div>
                    <div className="font-accent text-2xl text-amber mb-1">₹{(p?.current||data.base).toLocaleString("en-IN")}</div>
                    <div className="font-data text-[9px] text-clay">per {data.unit}</div>
                    {data.msp > 0 && (
                      <div className="mt-2 font-data text-[9px]">
                        <span className="text-clay">MSP: </span>
                        <span className="text-fern">₹{data.msp.toLocaleString("en-IN")}</span>
                        <span className="text-clay ml-1">({((((p?.current||data.base)/data.msp)-1)*100).toFixed(1)}% above)</span>
                      </div>
                    )}
                    {/* Mini sparkline */}
                    {sparklines[key] && (
                      <div className="mt-3 h-10">
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart data={sparklines[key].slice(-14)}>
                            <Line type="monotone" dataKey="value" stroke={isUp?"#52B788":"#C0392B"} strokeWidth={1.5} dot={false}/>
                          </LineChart>
                        </ResponsiveContainer>
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </div>

            {/* Selected crop detail chart */}
            {selectedCrop && sparklines[selectedCrop] && (
              <motion.div key={selectedCrop} initial={{opacity:0,y:20}} animate={{opacity:1,y:0}}>
                <GreenCard hover={false}>
                  <div className="flex items-start justify-between mb-6">
                    <div>
                      <h3 className="font-display text-2xl text-parchment">{CROPS[selectedCrop as keyof typeof CROPS]?.emoji} {selectedCrop.toUpperCase()} — 30 Day Price History</h3>
                      <div className="flex items-center gap-4 mt-2">
                        <span className="font-accent text-3xl text-amber">₹{(prices[selectedCrop]?.current||CROPS[selectedCrop as keyof typeof CROPS]?.base).toLocaleString("en-IN")}</span>
                        <span className={`font-data text-sm ${(prices[selectedCrop]?.change||0)>=0?"text-fern":"text-rust"}`}>
                          {(prices[selectedCrop]?.change||0)>=0?"+":""}{prices[selectedCrop]?.change||0} ({prices[selectedCrop]?.changePercent||0}%)
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-data text-[10px] text-clay">MSP: ₹{(CROPS[selectedCrop as keyof typeof CROPS]?.msp||0).toLocaleString("en-IN")}</div>
                      <div className="font-data text-[10px] text-clay">Unit: {CROPS[selectedCrop as keyof typeof CROPS]?.unit}</div>
                    </div>
                  </div>
                  <ResponsiveContainer width="100%" height={220}>
                    <AreaChart data={sparklines[selectedCrop]}>
                      <defs>
                        <linearGradient id="priceGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#E9A319" stopOpacity={0.2}/>
                          <stop offset="95%" stopColor="#E9A319" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#3D2410" vertical={false}/>
                      <XAxis dataKey="day" tick={{fill:"#8B5E3C",fontSize:9,fontFamily:"Space Mono"}} axisLine={false} tickLine={false}/>
                      <YAxis tick={{fill:"#8B5E3C",fontSize:9,fontFamily:"Space Mono"}} axisLine={false} tickLine={false}
                        tickFormatter={v=>`₹${v.toLocaleString("en-IN")}`} width={70}/>
                      <Tooltip contentStyle={tooltipStyle} formatter={(v:any) => [`₹${Number(v).toLocaleString("en-IN")}`, "Price"]}/>
                      {CROPS[selectedCrop as keyof typeof CROPS]?.msp > 0 && (
                        <line y1={CROPS[selectedCrop as keyof typeof CROPS]?.msp} y2={CROPS[selectedCrop as keyof typeof CROPS]?.msp} stroke="#52B788" strokeDasharray="5 5" strokeWidth={1.5}/>
                      )}
                      <Area type="monotone" dataKey="value" stroke="#E9A319" fill="url(#priceGrad)" strokeWidth={2}/>
                    </AreaChart>
                  </ResponsiveContainer>
                </GreenCard>
              </motion.div>
            )}
          </div>
        )}

        {/* CALCULATOR TAB */}
        {activeTab === "calculator" && (
          <motion.div initial={{opacity:0}} animate={{opacity:1}} className="grid md:grid-cols-2 gap-6">
            <GreenCard hover={false}>
              <h3 className="font-display text-xl text-parchment mb-6 flex items-center gap-2"><Calculator className="w-5 h-5 text-amber"/>Profit & Loss Calculator</h3>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-data text-[10px] text-clay block mb-1.5">CROP</label>
                    <select value={calc.crop} onChange={e => setCalc(p=>({...p,crop:e.target.value}))}>
                      {Object.keys(CROPS).map(k => <option key={k} value={k}>{k.toUpperCase()}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="font-data text-[10px] text-clay block mb-1.5">AREA (acres)</label>
                    <input type="number" value={calc.area} onChange={e => setCalc(p=>({...p,area:Number(e.target.value)}))} min="0.5" step="0.5"/>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-data text-[10px] text-clay block mb-1.5">YIELD (qtl/acre)</label>
                    <input type="number" value={calc.yieldPerAcre} onChange={e => setCalc(p=>({...p,yieldPerAcre:Number(e.target.value)}))}/>
                  </div>
                  <div>
                    <label className="font-data text-[10px] text-clay block mb-1.5">SELLING PRICE (₹/qtl)</label>
                    <input type="number" value={calc.sellingPrice} onChange={e => setCalc(p=>({...p,sellingPrice:Number(e.target.value)}))}/>
                  </div>
                </div>
                <div className="border-t border-bark/40 pt-4">
                  <p className="font-data text-[10px] text-clay mb-3 tracking-widest">COST PER ACRE (₹)</p>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      {k:"seed",  l:"Seeds"},
                      {k:"fert",  l:"Fertilizer"},
                      {k:"labor", l:"Labor"},
                      {k:"irr",   l:"Irrigation"},
                      {k:"pest",  l:"Pesticides"},
                      {k:"other", l:"Other"},
                    ].map(({k,l}) => (
                      <div key={k}>
                        <label className="font-data text-[10px] text-clay block mb-1">{l.toUpperCase()}</label>
                        <input type="number" value={(calc as any)[k]} onChange={e => setCalc(p=>({...p,[k]:Number(e.target.value)}))}/>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </GreenCard>

            <div className="space-y-4">
              <GreenCard hover={false}>
                <h3 className="font-display text-lg text-parchment mb-5">Analysis Results</h3>
                <div className="space-y-3">
                  {[
                    { l:"Total Yield",   v:`${results.totalYield.toFixed(0)} qtl`,          color:"text-parchment" },
                    { l:"Gross Revenue", v:formatCurrency(results.revenue),                  color:"text-amber" },
                    { l:"Total Cost",    v:formatCurrency(results.totalCost),                color:"text-rust" },
                    { l:"Net Profit",    v:formatCurrency(results.profit),                   color:results.profit>=0?"text-leaf":"text-rust" },
                    { l:"Profit Margin", v:`${results.margin.toFixed(1)}%`,                  color:results.margin>=20?"text-leaf":results.margin>=0?"text-amber":"text-rust" },
                    { l:"Break-even",    v:`₹${results.breakEven.toFixed(0)}/qtl`,          color:"text-clay" },
                    { l:"ROI",           v:`${results.roi.toFixed(1)}%`,                     color:results.roi>=20?"text-leaf":results.roi>=0?"text-amber":"text-rust" },
                  ].map(row => (
                    <div key={row.l} className="flex items-center justify-between py-2.5 border-b border-bark/20">
                      <span className="font-data text-xs text-clay">{row.l}</span>
                      <span className={`font-accent text-lg ${row.color}`}>{row.v}</span>
                    </div>
                  ))}
                </div>
              </GreenCard>

              <GreenCard hover={false}>
                <h4 className="font-data text-xs text-clay mb-4">COST BREAKDOWN</h4>
                <ResponsiveContainer width="100%" height={160}>
                  <BarChart data={[
                    {name:"Seeds",  val:calc.seed},
                    {name:"Fert",   val:calc.fert},
                    {name:"Labor",  val:calc.labor},
                    {name:"Irr",    val:calc.irr},
                    {name:"Pest",   val:calc.pest},
                    {name:"Other",  val:calc.other},
                  ]} layout="vertical" margin={{left:10}}>
                    <XAxis type="number" tick={{fill:"#8B5E3C",fontSize:9,fontFamily:"Space Mono"}} tickFormatter={v=>`₹${v}`} axisLine={false} tickLine={false}/>
                    <YAxis type="category" dataKey="name" tick={{fill:"#8B5E3C",fontSize:9,fontFamily:"Space Mono"}} axisLine={false} tickLine={false} width={35}/>
                    <Tooltip contentStyle={tooltipStyle} formatter={(v:any)=>[`₹${Number(v).toLocaleString("en-IN")}`,"Cost/Acre"]}/>
                    <Bar dataKey="val" fill="#2D6A4F" radius={[0,4,4,0]}/>
                  </BarChart>
                </ResponsiveContainer>
              </GreenCard>
            </div>
          </motion.div>
        )}

        {/* MANDIS TAB */}
        {activeTab === "mandis" && (
          <motion.div initial={{opacity:0}} animate={{opacity:1}}>
            <div className="flex flex-wrap gap-2 mb-6">
              {Object.entries(CROPS).map(([key,data]) => (
                <button key={key} onClick={() => setSelectedCrop(key)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full font-data text-xs transition-all ${selectedCrop===key?"bg-moss text-parchment":"border border-bark/60 text-clay hover:border-moss/40 hover:text-parchment"}`}>
                  {data.emoji} {key.toUpperCase()}
                </button>
              ))}
            </div>
            <div className="grid gap-3">
              {mandiPrices.length > 0 ? mandiPrices.map((m,i) => {
                const base = prices[selectedCrop]?.current || CROPS[selectedCrop as keyof typeof CROPS]?.base || 2000;
                const diff = m.price - base;
                return (
                  <motion.div key={m.name} initial={{opacity:0,x:-20}} animate={{opacity:1,x:0}} transition={{delay:i*0.08}}>
                    <GreenCard className="flex items-center justify-between p-5">
                      <div>
                        <h4 className="font-display text-lg text-parchment">{m.name}</h4>
                        <p className="font-data text-xs text-clay">{m.location} · Arrival: {m.arrival}</p>
                      </div>
                      <div className="text-right">
                        <div className="font-accent text-2xl text-amber">₹{m.price.toLocaleString("en-IN")}</div>
                        <div className={`font-data text-xs ${diff>=0?"text-fern":"text-rust"}`}>
                          {diff>=0?"+":""}{diff} vs avg
                        </div>
                      </div>
                    </GreenCard>
                  </motion.div>
                );
              }) : (
                <div className="text-center py-12 font-data text-sm text-clay">No mandi data for this crop region. Select another crop.</div>
              )}
              {/* Fallback: show all mandis */}
              {mandiPrices.length === 0 && MANDI_DATA.slice(0,4).map((m,i) => (
                <motion.div key={m.name} initial={{opacity:0}} animate={{opacity:1}} transition={{delay:i*0.08}}>
                  <GreenCard className="flex items-center justify-between p-5">
                    <div>
                      <h4 className="font-display text-lg text-parchment">{m.name}</h4>
                      <p className="font-data text-xs text-clay">{m.location} · Crops: {m.crops.join(", ")}</p>
                    </div>
                    <div className="font-accent text-2xl text-amber">₹{(prices[selectedCrop]?.current||2000).toLocaleString("en-IN")}</div>
                  </GreenCard>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* ALERTS TAB */}
        {activeTab === "alerts" && (
          <motion.div initial={{opacity:0}} animate={{opacity:1}} className="grid md:grid-cols-2 gap-6">
            <GreenCard hover={false}>
              <h3 className="font-display text-xl text-parchment mb-6 flex items-center gap-2"><Bell className="w-5 h-5 text-amber"/>Set Price Alert</h3>
              <div className="space-y-4">
                <div>
                  <label className="font-data text-[10px] text-clay block mb-1.5">COMMODITY</label>
                  <select value={alertForm.commodity} onChange={e => setAlertForm(p=>({...p,commodity:e.target.value}))}>
                    {Object.entries(CROPS).map(([k,v]) => <option key={k} value={k}>{v.emoji} {k.toUpperCase()}</option>)}
                  </select>
                </div>
                <div>
                  <label className="font-data text-[10px] text-clay block mb-1.5">ALERT WHEN PRICE IS</label>
                  <div className="grid grid-cols-2 gap-2">
                    {(["above","below"] as const).map(t => (
                      <button key={t} onClick={() => setAlertForm(p=>({...p,type:t}))}
                        className={`py-2.5 rounded-lg font-data text-xs border transition-all ${alertForm.type===t?"bg-moss border-moss text-parchment":"border-bark/60 text-clay hover:border-moss/40"}`}>
                        {t==="above"?"▲ ABOVE":"▼ BELOW"}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="font-data text-[10px] text-clay block mb-1.5">THRESHOLD PRICE (₹/qtl)</label>
                  <input type="number" placeholder="e.g. 2200" value={alertForm.threshold} onChange={e => setAlertForm(p=>({...p,threshold:e.target.value}))}/>
                </div>
                <div>
                  <label className="font-data text-[10px] text-clay block mb-1.5">EMAIL (optional)</label>
                  <input type="email" placeholder="farmer@example.com" value={alertForm.email} onChange={e => setAlertForm(p=>({...p,email:e.target.value}))}/>
                </div>
                <button onClick={handleSendAlert}
                  className={`w-full py-3 rounded-xl font-display text-sm tracking-wider transition-all ${alertSent?"bg-fern text-parchment":"bg-moss hover:bg-fern text-parchment hover:scale-105"}`}>
                  {alertSent ? "✓ ALERT SET SUCCESSFULLY" : "SET PRICE ALERT"}
                </button>
              </div>
            </GreenCard>

            <GreenCard hover={false}>
              <h3 className="font-display text-xl text-parchment mb-6">Active Alerts ({priceAlerts.length})</h3>
              {priceAlerts.length === 0 ? (
                <div className="text-center py-12">
                  <Bell className="w-8 h-8 text-bark mx-auto mb-3"/>
                  <p className="font-data text-xs text-clay">No price alerts set. Create one to get notified when prices cross your target.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {priceAlerts.map(a => (
                    <div key={a.id} className="flex items-center justify-between p-4 glass-card">
                      <div>
                        <div className="font-display text-sm text-parchment">{CROPS[a.commodity as keyof typeof CROPS]?.emoji} {a.commodity.toUpperCase()}</div>
                        <div className="font-data text-[10px] text-clay">{a.type==="above"?"▲ Above":"▼ Below"} ₹{Number(a.threshold).toLocaleString("en-IN")}/qtl</div>
                        {a.email && <div className="font-data text-[9px] text-clay/60">{a.email}</div>}
                      </div>
                      <button onClick={() => removePriceAlert(a.id)} className="text-clay hover:text-rust transition-colors p-1">
                        <X className="w-4 h-4"/>
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </GreenCard>
          </motion.div>
        )}
      </div>
    </div>
  );
}
