"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Minus, AlertTriangle, ChevronDown } from "lucide-react";
import { useFarmStore } from "@/lib/store";
import GreenCard from "@/components/GreenCard";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const categories = ["ALL", "SEEDS", "FERTILIZER", "PESTICIDES", "TOOLS", "FUEL", "OTHERS"];

export default function Inventory() {
  const { inventory, addInventory, updateInventory } = useFarmStore();
  const [activeCategory, setActiveCategory] = useState("ALL");
  const [showAddForm, setShowAddForm] = useState(false);
  const [newItem, setNewItem] = useState({ name: "", category: "SEEDS", stock: 0, unit: "kg", minThreshold: 0, costPerUnit: 0 });

  const filtered = activeCategory === "ALL" ? inventory : inventory.filter((i) => i.category.toUpperCase() === activeCategory);
  const lowStock = inventory.filter((i) => i.stock < i.minThreshold);

  const handleAdd = () => {
    if (!newItem.name) return;
    addInventory({ id: Date.now().toString(), ...newItem, lastUsed: "Just now" });
    setShowAddForm(false);
    setNewItem({ name: "", category: "SEEDS", stock: 0, unit: "kg", minThreshold: 0, costPerUnit: 0 });
  };

  const usageData = inventory.slice(0, 8).map((i) => ({ name: i.name.split(" ")[0], used: Math.round(i.stock * 0.3), restocked: i.stock }));

  return (
    <div className="pt-24 px-4 max-w-7xl mx-auto pb-12">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <h1 className="font-display text-4xl text-parchment mb-2">Farm Inventory</h1>
        <p className="font-data text-clay">Stock management and supply tracking</p>
      </motion.div>

      <div className="flex gap-2 overflow-x-auto pb-4 mb-6">
        {categories.map((cat) => (
          <button key={cat} onClick={() => setActiveCategory(cat)}
            className={`px-4 py-2 rounded-full font-data text-xs whitespace-nowrap transition-colors ${activeCategory === cat ? "bg-amber text-void" : "bg-loam text-clay hover:text-parchment border border-bark"}`}>
            {cat}
          </button>
        ))}
      </div>

      {lowStock.length > 0 && (
        <div className="mb-6 space-y-2">
          <h3 className="font-display text-lg text-rust flex items-center gap-2"><AlertTriangle className="w-5 h-5" />Low Stock Alerts</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {lowStock.map((item) => (
              <motion.div key={item.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="glass-card p-4 border-rust/50 border">
                <div className="flex justify-between items-start mb-2">
                  <div><h4 className="font-display text-parchment">{item.name}</h4><p className="font-data text-xs text-clay">{item.category}</p></div>
                  <span className="px-2 py-1 bg-rust/20 text-rust rounded text-[10px] font-data">LOW</span>
                </div>
                <div className="flex items-center gap-4">
                  <div className="font-accent text-2xl text-rust">{item.stock}</div>
                  <div className="font-data text-xs text-clay">/ {item.minThreshold} {item.unit}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        <AnimatePresence>
          {filtered.map((item, i) => {
            const stockPercent = (item.stock / (item.minThreshold * 3)) * 100;
            const isLow = item.stock < item.minThreshold;
            return (
              <motion.div key={item.id} layout initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} transition={{ delay: i * 0.05 }}
                className={`glass-card p-5 border-l-4 ${isLow ? "border-l-rust" : stockPercent > 70 ? "border-l-leaf" : "border-l-amber"}`}>
                <div className="flex justify-between items-start mb-3">
                  <div><span className="font-data text-[10px] text-clay uppercase tracking-wider">{item.category}</span><h4 className="font-display text-lg text-parchment">{item.name}</h4></div>
                  {isLow && <AlertTriangle className="w-5 h-5 text-rust animate-pulse" />}
                </div>
                <div className="flex items-end gap-2 mb-3"><span className="font-accent text-3xl text-amber">{item.stock}</span><span className="font-data text-xs text-clay mb-1">{item.unit}</span></div>
                <div className="h-2 bg-void rounded-full overflow-hidden mb-3">
                  <motion.div initial={{ width: 0 }} animate={{ width: `${Math.min(stockPercent, 100)}%` }}
                    className={`h-full rounded-full ${isLow ? "bg-rust" : stockPercent > 70 ? "bg-leaf" : "bg-amber"}`} />
                </div>
                <div className="flex gap-2">
                  <button onClick={() => updateInventory(item.id, 10)} className="flex-1 flex items-center justify-center gap-1 py-2 bg-moss/20 hover:bg-moss/30 text-fern rounded font-data text-xs transition-colors"><Plus className="w-3 h-3" /> ADD</button>
                  <button onClick={() => updateInventory(item.id, -5)} className="flex-1 flex items-center justify-center gap-1 py-2 bg-void hover:bg-loam text-clay rounded font-data text-xs transition-colors"><Minus className="w-3 h-3" /> USE</button>
                </div>
                <div className="mt-2 font-data text-[10px] text-clay">Last used: {item.lastUsed}</div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      <GreenCard className="mb-8">
        <button onClick={() => setShowAddForm(!showAddForm)} className="flex items-center justify-between w-full">
          <h3 className="font-display text-lg text-parchment flex items-center gap-2">Add New Item</h3>
          <ChevronDown className={`w-5 h-5 text-clay transition-transform ${showAddForm ? "rotate-180" : ""}`} />
        </button>
        <AnimatePresence>
          {showAddForm && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4 pt-4 border-t border-bark">
                <input placeholder="Item name" className="glass-input" value={newItem.name} onChange={(e) => setNewItem({ ...newItem, name: e.target.value })} />
                <select className="glass-input" value={newItem.category} onChange={(e) => setNewItem({ ...newItem, category: e.target.value })}>
                  {categories.slice(1).map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
                <div className="flex gap-2">
                  <input type="number" placeholder="Quantity" className="glass-input flex-1" value={newItem.stock || ""} onChange={(e) => setNewItem({ ...newItem, stock: Number(e.target.value) })} />
                  <input placeholder="Unit" className="glass-input w-24" value={newItem.unit} onChange={(e) => setNewItem({ ...newItem, unit: e.target.value })} />
                </div>
                <input type="number" placeholder="Min threshold" className="glass-input" value={newItem.minThreshold || ""} onChange={(e) => setNewItem({ ...newItem, minThreshold: Number(e.target.value) })} />
                <input type="number" placeholder="Cost per unit (₹)" className="glass-input" value={newItem.costPerUnit || ""} onChange={(e) => setNewItem({ ...newItem, costPerUnit: Number(e.target.value) })} />
                <button onClick={handleAdd} className="sm:col-span-2 py-3 bg-amber hover:bg-wheat text-void rounded-md font-display text-sm transition-colors">ADD TO INVENTORY</button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </GreenCard>

      <GreenCard>
        <h3 className="font-display text-lg text-parchment mb-4">Top Items by Usage (30 days)</h3>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={usageData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#3D2410" /><XAxis dataKey="name" tick={{ fill: "#8B5E3C", fontSize: 10, fontFamily: "Space Mono" }} />
            <YAxis tick={{ fill: "#8B5E3C", fontSize: 10 }} /><Tooltip contentStyle={{ backgroundColor: "#1A0E05", border: "1px solid #3D2410" }} />
            <Bar dataKey="used" fill="#C0392B" name="Used" radius={[4, 4, 0, 0]} /><Bar dataKey="restocked" fill="#2D6A4F" name="In Stock" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </GreenCard>
    </div>
  );
}