"use client";

import { useEffect, useState, useMemo } from "react";
import { motion } from "framer-motion";
import { TrendingUp, ArrowUp, ArrowDown, Bell, Calculator, Save, Mail } from "lucide-react";
import { CROPS, getLivePrices, formatCurrency, formatNumber, DISTRICT_AVERAGES } from "@/lib/utils";
import { useFarmStore } from "@/lib/store";
import GreenCard from "@/components/GreenCard";
import PriceTicker from "@/components/PriceTicker";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

const COLORS = ["#2D6A4F", "#E9A319", "#C0392B", "#8B5E3C"];

function generateSparkline(base: number) {
  return Array.from({ length: 7 }, (_, i) => ({ day: i + 1, value: base * (1 + (Math.random() - 0.5) * 0.04) }));
}

export default function Market() {
  const [prices, setPrices] = useState<Record<string, any>>({});
  const [selectedCrop, setSelectedCrop] = useState("wheat");
  const [alertForm, setAlertForm] = useState({ commodity: "wheat", type: "above", threshold: "", email: "" });
  const [alertSent, setAlertSent] = useState(false);
  const [calc, setCalc] = useState({
    crop: "wheat", area: 5, yieldPerAcre: 42, seedCost: 1200, fertilizerCost: 3500,
    laborCost: 4500, irrigationCost: 2000, pesticideCost: 1500, otherCost: 1000, sellingPrice: 2150,
  });

  useEffect(() => {
    const fetchPrices = () => { setPrices(getLivePrices()); };
    fetchPrices();
    const interval = setInterval(fetchPrices, 60000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const avg = DISTRICT_AVERAGES[calc.crop] || 40;
    setCalc((prev) => ({ ...prev, yieldPerAcre: avg, sellingPrice: prices[calc.crop]?.current || CROPS[calc.crop as keyof typeof CROPS]?.base || 2000 }));
  }, [calc.crop, prices]);

  const results = useMemo(() => {
    const totalYield = calc.area * calc.yieldPerAcre;
    const revenue = totalYield * calc.sellingPrice;
    const totalCost = calc.area * (calc.seedCost + calc.fertilizerCost + calc.laborCost + calc.irrigationCost + calc.pesticideCost + calc.otherCost);
    const profit = revenue - totalCost;
    const margin = totalCost > 0 ? (profit / revenue) * 100 : 0;
    const breakEven = totalYield > 0 ? totalCost / totalYield : 0;
    const roi = totalCost > 0 ? (profit / totalCost) * 100 : 0;
    return { totalYield, revenue, totalCost, profit, margin, breakEven, roi };
  }, [calc]);

  const pieData = [{ name: "Revenue", value: Math.max(0, results.revenue) }, { name: "Costs", value: results.totalCost }];

  const sendPriceAlert = async () => {
    if (!alertForm.email || !alertForm.threshold) return;
    await fetch("/api/alerts/price", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ commodity: alertForm.commodity, alertType: alertForm.type, threshold: Number(alertForm.threshold), email: alertForm.email }),
    });
    setAlertSent(true);
    useFarmStore.getState().addPriceAlert({ ...alertForm, id: Date.now().toString() });
    setTimeout(() => setAlertSent(false), 3000);
  };

  const mandiData = [
    { name: "Azadpur Mandi", location: "Delhi", price: 2150, arrival: "1200 qtl" },
    { name: "Vashi APMC", location: "Mumbai", price: 2180, arrival: "850 qtl" },
    { name: "Koyambedu", location: "Chennai", price: 2120, arrival: "600 qtl" },
    { name: "Guntur", location: "Andhra Pradesh", price: 2080, arrival: "2000 qtl" },
    { name: "Ludhiana", location: "Punjab", price: 2200, arrival: "1500 qtl" },
  ];

  return (
    <div className="pt-20 min-h-screen bg-void">
      <PriceTicker />
      <div className="px-4 max-w-7xl mx-auto py-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 className="font-display text-4xl text-parchment mb-2">Live Market Prices</h1>
          <p className="font-data text-clay">Real-time commodity rates and MSP comparison</p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {Object.entries(CROPS).map(([key, data], i) => {
            const price = prices[key]; if (!price) return null;
            const isUp = price.change >= 0;
            return (
              <motion.div key={key} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                onClick={() => setSelectedCrop(key)} className={`glass-card p-5 cursor-pointer transition-all ${selectedCrop === key ? "border-amber ring-1 ring-amber/30" : ""}`}>
                <div className="flex justify-between items-start mb-3">
                  <span className="text-2xl">{data.emoji}</span>
                  <span className={`flex items-center gap-1 font-data text-xs ${isUp ? "text-leaf" : "text-rust"}`}>
                    {isUp ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />}{Math.abs(price.changePercent)}%
                  </span>
                </div>
                <h4 className="font-display text-parchment mb-1">{key.toUpperCase()}</h4>
                <div className="font-accent text-3xl text-amber mb-2">₹{price.current.toLocaleString("en-IN")}</div>
                <div className="font-data text-[10px] text-clay mb-3">MSP: ₹{data.msp || "N/A"} {data.msp ? `// ${((price.current / data.msp - 1) * 100).toFixed(1)}% above` : ""}</div>
                <ResponsiveContainer width="100%" height={60}>
                  <LineChart data={generateSparkline(price.current)}><Line type="monotone" dataKey="value" stroke={isUp ? "#95D5B2" : "#C0392B"} strokeWidth={2} dot={false} /></LineChart>
                </ResponsiveContainer>
              </motion.div>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <GreenCard>
            <h3 className="font-display text-xl text-parchment mb-4 flex items-center gap-2"><Calculator className="w-5 h-5 text-amber" />Crop Profitability Calculator</h3>
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div>
                <label className="font-data text-xs text-clay mb-1 block">Crop</label>
                <select className="w-full glass-input" value={calc.crop} onChange={(e) => setCalc({ ...calc, crop: e.target.value })}>
                  {Object.entries(CROPS).map(([k, v]) => <option key={k} value={k}>{v.emoji} {k.toUpperCase()}</option>)}
                </select>
              </div>
              <div><label className="font-data text-xs text-clay mb-1 block">Area (acres)</label><input type="number" className="w-full glass-input" value={calc.area} onChange={(e) => setCalc({ ...calc, area: Number(e.target.value) })} /></div>
              <div><label className="font-data text-xs text-clay mb-1 block">Yield (qtl/acre)</label><input type="number" className="w-full glass-input" value={calc.yieldPerAcre} onChange={(e) => setCalc({ ...calc, yieldPerAcre: Number(e.target.value) })} /></div>
              <div><label className="font-data text-xs text-clay mb-1 block">Selling Price (₹/qtl)</label><input type="number" className="w-full glass-input" value={calc.sellingPrice} onChange={(e) => setCalc({ ...calc, sellingPrice: Number(e.target.value) })} /></div>
            </div>
            <div className="space-y-2 mb-4">
              <div className="font-data text-xs text-clay mb-2">Cost per Acre (₹)</div>
              {[{ key: "seedCost", label: "Seed" }, { key: "fertilizerCost", label: "Fertilizer" }, { key: "laborCost", label: "Labor" }, { key: "irrigationCost", label: "Irrigation" }, { key: "pesticideCost", label: "Pesticides" }, { key: "otherCost", label: "Others" }].map((field) => (
                <div key={field.key} className="flex items-center gap-2">
                  <span className="font-data text-xs text-clay w-20">{field.label}</span>
                  <input type="number" className="flex-1 glass-input py-1 text-sm" value={calc[field.key as keyof typeof calc]} onChange={(e) => setCalc({ ...calc, [field.key]: Number(e.target.value) })} />
                </div>
              ))}
            </div>
            <div className="border-t border-bark pt-4">
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div><div className="font-data text-xs text-clay">Total Yield</div><div className="font-accent text-xl text-parchment">{formatNumber(results.totalYield)} qtl</div></div>
                <div><div className="font-data text-xs text-clay">Gross Revenue</div><div className="font-accent text-xl text-amber">{formatCurrency(results.revenue)}</div></div>
                <div><div className="font-data text-xs text-clay">Total Cost</div><div className="font-accent text-xl text-clay">{formatCurrency(results.totalCost)}</div></div>
                <div><div className="font-data text-xs text-clay">Net Profit</div><div className={`font-accent text-2xl ${results.profit >= 0 ? "text-leaf" : "text-rust"}`}>{formatCurrency(results.profit)}</div></div>
              </div>
              <div className="flex items-center gap-4 mb-4">
                <div className="w-32 h-32">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart><Pie data={pieData} cx="50%" cy="50%" innerRadius={30} outerRadius={50} dataKey="value">{pieData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}</Pie></PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex-1 space-y-1">
                  <div className="flex justify-between font-data text-xs"><span className="text-clay">Profit Margin</span><span className="text-parchment">{results.margin.toFixed(1)}%</span></div>
                  <div className="flex justify-between font-data text-xs"><span className="text-clay">Break-even</span><span className="text-parchment">₹{results.breakEven.toFixed(0)}/qtl</span></div>
                  <div className="flex justify-between font-data text-xs"><span className="text-clay">ROI</span><span className={results.roi >= 0 ? "text-leaf" : "text-rust"}>{results.roi.toFixed(1)}%</span></div>
                </div>
              </div>
              <div className="flex gap-2">
                <button onClick={() => { localStorage.setItem("terra_calc", JSON.stringify({ calc, results, date: new Date().toISOString() })); alert("Calculation saved!"); }} className="flex-1 flex items-center justify-center gap-2 py-2 bg-void hover:bg-loam rounded font-data text-xs text-parchment transition-colors"><Save className="w-3 h-3" /> SAVE</button>
                <button onClick={() => { const email = prompt("Enter email to send report:"); if (email) { fetch("/api/report/weekly", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email, farmData: { calc, results } }) }); alert("Report sent!"); } }} className="flex-1 flex items-center justify-center gap-2 py-2 bg-moss/20 hover:bg-moss/30 text-fern rounded font-data text-xs transition-colors"><Mail className="w-3 h-3" /> EMAIL REPORT</button>
              </div>
            </div>
          </GreenCard>

          <GreenCard>
            <h3 className="font-display text-xl text-parchment mb-4 flex items-center gap-2"><Bell className="w-5 h-5 text-amber" />Price Alert Setup</h3>
            <div className="space-y-3 mb-4">
              <select className="w-full glass-input" value={alertForm.commodity} onChange={(e) => setAlertForm({ ...alertForm, commodity: e.target.value })}>
                {Object.keys(CROPS).map((c) => <option key={c} value={c}>{c.toUpperCase()}</option>)}
              </select>
              <div className="flex gap-2">
                {["above", "below", "change"].map((t) => (
                  <button key={t} onClick={() => setAlertForm({ ...alertForm, type: t })}
                    className={`flex-1 py-2 rounded font-data text-xs transition-colors ${alertForm.type === t ? "bg-amber text-void" : "bg-void text-clay hover:text-parchment"}`}>
                    {t === "above" ? "ABOVE PRICE" : t === "below" ? "BELOW PRICE" : "CHANGE %"}
                  </button>
                ))}
              </div>
              <input type="number" placeholder="Threshold value (₹)" className="w-full glass-input" value={alertForm.threshold} onChange={(e) => setAlertForm({ ...alertForm, threshold: e.target.value })} />
              <input type="email" placeholder="Email for alerts" className="w-full glass-input" value={alertForm.email} onChange={(e) => setAlertForm({ ...alertForm, email: e.target.value })} />
              <button onClick={sendPriceAlert} disabled={alertSent}
                className={`w-full py-3 rounded-md font-display text-sm tracking-wider transition-all ${alertSent ? "bg-leaf text-void" : "bg-moss hover:bg-fern text-parchment"}`}>
                {alertSent ? "✓ ALERT ACTIVATED" : "ACTIVATE ALERT"}
              </button>
            </div>
            <div className="border-t border-bark pt-4">
              <h4 className="font-data text-xs text-clay mb-2">Active Alerts</h4>
              <div className="space-y-2">
                {useFarmStore((s) => s.priceAlerts).map((alert: any) => (
                  <div key={alert.id} className="flex items-center justify-between p-2 bg-void/50 rounded">
                    <span className="font-data text-xs text-parchment">{alert.commodity.toUpperCase()} {alert.type} ₹{alert.threshold}</span>
                    <button onClick={() => useFarmStore.getState().removePriceAlert(alert.id)} className="text-rust hover:text-parchment text-xs">✕</button>
                  </div>
                ))}
              </div>
            </div>
          </GreenCard>
        </div>

        <GreenCard>
          <h3 className="font-display text-xl text-parchment mb-4">Major Mandi Prices Today</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-bark">
                  <th className="text-left font-data text-xs text-clay py-3 px-2">MANDI NAME</th>
                  <th className="text-left font-data text-xs text-clay py-3 px-2">LOCATION</th>
                  <th className="text-right font-data text-xs text-clay py-3 px-2">PRICE (₹/qtl)</th>
                  <th className="text-right font-data text-xs text-clay py-3 px-2">ARRIVAL</th>
                </tr>
              </thead>
              <tbody>
                {mandiData.map((m, i) => (
                  <motion.tr key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.05 }}
                    className={`border-b border-bark/50 hover:bg-loam/30 transition-colors ${m.price === Math.max(...mandiData.map((d) => d.price)) ? "bg-amber/5" : ""}`}>
                    <td className="py-3 px-2 font-data text-sm text-parchment">{m.name}</td>
                    <td className="py-3 px-2 font-data text-xs text-clay">{m.location}</td>
                    <td className="py-3 px-2 font-data text-sm text-amber text-right">₹{m.price}</td>
                    <td className="py-3 px-2 font-data text-xs text-clay text-right">{m.arrival}</td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </GreenCard>
      </div>
    </div>
  );
}