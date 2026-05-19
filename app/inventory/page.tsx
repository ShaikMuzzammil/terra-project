"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Package, Plus, Minus, Trash2, AlertTriangle, X, Search } from "lucide-react";
import { useFarmStore } from "@/lib/store";
import GreenCard from "@/components/GreenCard";
import { formatCurrency } from "@/lib/utils";

const CATEGORIES = ["All","Seeds","Fertilizer","Pesticides","Fuel","Tools","Other"];

export default function Inventory() {
  const { inventory, addInventory, updateInventory, deleteInventory } = useFarmStore();
  const [filterCat, setFilterCat] = useState("All");
  const [search, setSearch] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [newItem, setNewItem] = useState({ name:"", category:"Seeds", stock:0, unit:"kg", minThreshold:0, costPerUnit:0 });

  const filtered = inventory.filter(i =>
    (filterCat === "All" || i.category === filterCat) &&
    i.name.toLowerCase().includes(search.toLowerCase())
  );

  const lowStock = inventory.filter(i => i.stock <= i.minThreshold);
  const totalValue = inventory.reduce((s,i) => s + i.stock*i.costPerUnit, 0);

  const handleAdd = () => {
    if (!newItem.name) return;
    addInventory({ ...newItem, id: Date.now().toString(), lastUsed: "Just added" });
    setNewItem({ name:"", category:"Seeds", stock:0, unit:"kg", minThreshold:0, costPerUnit:0 });
    setShowAddModal(false);
  };

  const catColors: Record<string,string> = {
    Seeds:"bg-leaf/15 text-leaf", Fertilizer:"bg-amber/15 text-amber",
    Pesticides:"bg-rust/15 text-rust", Fuel:"bg-clay/15 text-clay",
    Tools:"bg-fern/15 text-fern", Other:"bg-parchment/10 text-parchment",
  };

  return (
    <div className="pt-24 min-h-screen bg-void px-4">
      <div className="max-w-6xl mx-auto py-8">
        {/* Header */}
        <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="font-display text-4xl md:text-5xl text-parchment mb-1">Inventory <span className="text-amber">Hub</span></h1>
            <p className="font-data text-xs text-clay">Track seeds, fertilizers, tools and supplies</p>
          </div>
          <button onClick={() => setShowAddModal(true)} className="flex items-center gap-2 px-5 py-2.5 bg-moss hover:bg-fern text-parchment rounded-xl font-display text-sm tracking-wider transition-all hover:scale-105">
            <Plus className="w-4 h-4"/> ADD ITEM
          </button>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
          {[
            { l:"Total Items",    v:inventory.length,            c:"text-parchment" },
            { l:"Total Value",    v:formatCurrency(totalValue),  c:"text-amber" },
            { l:"Low Stock",      v:lowStock.length,             c:lowStock.length>0?"text-rust":"text-fern" },
            { l:"Categories",     v:CATEGORIES.length-1,         c:"text-fern" },
          ].map((s,i) => (
            <motion.div key={s.l} initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{delay:i*0.08}}>
              <GreenCard className="text-center p-4">
                <div className={`font-accent text-2xl ${s.c} mb-1`}>{s.v}</div>
                <div className="font-data text-[10px] text-clay">{s.l}</div>
              </GreenCard>
            </motion.div>
          ))}
        </div>

        {/* Low stock alert */}
        {lowStock.length > 0 && (
          <motion.div initial={{opacity:0}} animate={{opacity:1}} className="mb-6 p-4 rounded-xl alert-critical flex items-start gap-3">
            <AlertTriangle className="w-4 h-4 mt-0.5 flex-shrink-0"/>
            <div>
              <p className="font-display text-sm text-parchment mb-1">Low Stock Alert — {lowStock.length} items below threshold</p>
              <p className="font-data text-[10px] text-clay">{lowStock.map(i=>i.name).join(" · ")}</p>
            </div>
          </motion.div>
        )}

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-clay"/>
            <input placeholder="Search inventory..." value={search} onChange={e=>setSearch(e.target.value)} className="pl-9"/>
          </div>
          <div className="flex gap-1.5 flex-wrap">
            {CATEGORIES.map(cat => (
              <button key={cat} onClick={() => setFilterCat(cat)}
                className={`px-3 py-1.5 rounded-full font-data text-[10px] transition-all ${filterCat===cat?"bg-moss text-parchment":"border border-bark/60 text-clay hover:border-moss/40 hover:text-parchment"}`}>
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        <GreenCard hover={false} className="overflow-x-auto">
          <table className="w-full min-w-[700px]">
            <thead>
              <tr className="border-b border-bark/50">
                {["Item","Category","Stock","Threshold","Cost/Unit","Total Value","Last Used","Actions"].map(h => (
                  <th key={h} className="text-left font-data text-[10px] text-clay tracking-widest pb-3 pr-4">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((item, i) => {
                const isLow = item.stock <= item.minThreshold;
                const totalVal = item.stock * item.costPerUnit;
                return (
                  <motion.tr key={item.id} initial={{opacity:0,x:-20}} animate={{opacity:1,x:0}} transition={{delay:i*0.05}}
                    className="border-b border-bark/20 hover:bg-loam/30 transition-colors">
                    <td className="py-4 pr-4">
                      <span className={`font-display text-sm ${isLow?"text-rust":"text-parchment"}`}>{item.name}</span>
                      {isLow && <span className="ml-2 text-[9px] bg-rust/20 text-rust px-1.5 py-0.5 rounded font-data">LOW</span>}
                    </td>
                    <td className="py-4 pr-4">
                      <span className={`font-data text-[10px] px-2 py-1 rounded ${catColors[item.category]||"bg-bark/30 text-clay"}`}>{item.category}</span>
                    </td>
                    <td className="py-4 pr-4">
                      <span className={`font-accent text-lg ${isLow?"text-rust":"text-parchment"}`}>{item.stock}</span>
                      <span className="font-data text-[10px] text-clay ml-1">{item.unit}</span>
                    </td>
                    <td className="py-4 pr-4 font-data text-xs text-clay">{item.minThreshold} {item.unit}</td>
                    <td className="py-4 pr-4 font-data text-xs text-clay">₹{item.costPerUnit}</td>
                    <td className="py-4 pr-4 font-data text-xs text-amber">₹{totalVal.toLocaleString("en-IN")}</td>
                    <td className="py-4 pr-4 font-data text-[10px] text-clay">{item.lastUsed}</td>
                    <td className="py-4 pr-2">
                      <div className="flex items-center gap-1">
                        <button onClick={() => updateInventory(item.id, -10)} className="p-1.5 rounded hover:bg-rust/20 text-clay hover:text-rust transition-colors"><Minus className="w-3 h-3"/></button>
                        <button onClick={() => updateInventory(item.id, 50)} className="p-1.5 rounded hover:bg-fern/20 text-clay hover:text-fern transition-colors"><Plus className="w-3 h-3"/></button>
                        <button onClick={() => deleteInventory(item.id)} className="p-1.5 rounded hover:bg-rust/20 text-clay hover:text-rust transition-colors"><Trash2 className="w-3 h-3"/></button>
                      </div>
                    </td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div className="text-center py-12 font-data text-sm text-clay">No items found. Try a different filter.</div>
          )}
        </GreenCard>
      </div>

      {/* Add Modal */}
      <AnimatePresence>
        {showAddModal && (
          <>
            <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="fixed inset-0 bg-void/80 backdrop-blur-sm z-50" onClick={() => setShowAddModal(false)}/>
            <motion.div initial={{opacity:0,scale:0.95,y:20}} animate={{opacity:1,scale:1,y:0}} exit={{opacity:0,scale:0.95}}
              className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-md">
              <GreenCard className="border-moss/30 shadow-2xl shadow-void" hover={false}>
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-display text-xl text-parchment">Add Inventory Item</h3>
                  <button onClick={() => setShowAddModal(false)} className="text-clay hover:text-parchment"><X className="w-5 h-5"/></button>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="font-data text-[10px] text-clay block mb-1.5">ITEM NAME</label>
                    <input placeholder="e.g. Rice Seeds (IR-64)" value={newItem.name} onChange={e=>setNewItem(p=>({...p,name:e.target.value}))}/>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="font-data text-[10px] text-clay block mb-1.5">CATEGORY</label>
                      <select value={newItem.category} onChange={e=>setNewItem(p=>({...p,category:e.target.value}))}>
                        {CATEGORIES.slice(1).map(c=><option key={c} value={c}>{c}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="font-data text-[10px] text-clay block mb-1.5">UNIT</label>
                      <select value={newItem.unit} onChange={e=>setNewItem(p=>({...p,unit:e.target.value}))}>
                        {["kg","L","g","ml","roll","bag","pack","unit"].map(u=><option key={u}>{u}</option>)}
                      </select>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="font-data text-[10px] text-clay block mb-1.5">STOCK</label>
                      <input type="number" value={newItem.stock} onChange={e=>setNewItem(p=>({...p,stock:Number(e.target.value)}))}/>
                    </div>
                    <div>
                      <label className="font-data text-[10px] text-clay block mb-1.5">MIN THRESHOLD</label>
                      <input type="number" value={newItem.minThreshold} onChange={e=>setNewItem(p=>({...p,minThreshold:Number(e.target.value)}))}/>
                    </div>
                    <div>
                      <label className="font-data text-[10px] text-clay block mb-1.5">COST/UNIT (₹)</label>
                      <input type="number" value={newItem.costPerUnit} onChange={e=>setNewItem(p=>({...p,costPerUnit:Number(e.target.value)}))}/>
                    </div>
                  </div>
                  <button onClick={handleAdd} className="w-full py-3 bg-moss hover:bg-fern text-parchment rounded-xl font-display text-sm tracking-wider transition-all">
                    ADD TO INVENTORY
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
