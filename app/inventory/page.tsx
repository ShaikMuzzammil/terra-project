"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Minus, Trash2, AlertTriangle, Search, X, Package } from "lucide-react";
import { useStore } from "@/lib/store";
import Card from "@/components/Card";
import { fmtINR } from "@/lib/utils";

const CATS = ["All","Seeds","Fertilizer","Pesticides","Fuel","Tools","Other"];
const CAT_STYLE: Record<string,string> = {
  Seeds:"badge-green", Fertilizer:"badge-blue", Pesticides:"badge-red",
  Fuel:"badge-amber", Tools:"badge-slate", Other:"badge-slate",
};

export default function Inventory() {
  const { inventory, addItem, adjustStock, deleteItem, pushNotif } = useStore();
  const [cat, setCat] = useState("All");
  const [q, setQ] = useState("");
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ name:"", cat:"Seeds", qty:0, unit:"kg", minQty:0, cost:0 });

  const filtered = inventory.filter(i =>
    (cat==="All" || i.cat===cat) && i.name.toLowerCase().includes(q.toLowerCase())
  );
  const low = inventory.filter(i=>i.qty<=i.minQty);
  const total = inventory.reduce((s,i)=>s+i.qty*i.cost,0);

  const handleAdd = () => {
    if (!form.name) return;
    addItem({...form, id:Date.now().toString(), lastUsed:"Just added"});
    pushNotif({title:"📦 Item Added",body:`${form.name} added to inventory.`,type:"success",time:"just now"});
    setForm({name:"",cat:"Seeds",qty:0,unit:"kg",minQty:0,cost:0});
    setShowAdd(false);
  };

  const handleAdjust = (id:string, delta:number, name:string) => {
    adjustStock(id, delta);
    if (delta > 0) pushNotif({title:"📦 Stock Updated",body:`${name}: +${delta} units added.`,type:"info",time:"just now"});
  };

  return (
    <div className="pt-[88px] min-h-screen bg-slate-50">
      <div className="container py-8">
        <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
          <div>
            <h1 className="text-4xl font-bold text-slate-900 mb-1">Inventory <span className="grad-text">Hub</span></h1>
            <p className="text-slate-500 text-sm">Track seeds, fertilizers, pesticides and tools</p>
          </div>
          <button onClick={()=>setShowAdd(true)} className="btn btn-primary"><Plus className="w-4 h-4"/> Add Item</button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {[
            {l:"Total Items",    v:inventory.length,         c:"text-brand-700 bg-brand-50 border-brand-100"},
            {l:"Total Value",    v:fmtINR(total),            c:"text-amber-700 bg-amber-50 border-amber-100"},
            {l:"Low Stock",      v:`${low.length} items`,    c:low.length>0?"text-rose-700 bg-rose-50 border-rose-100":"text-brand-700 bg-brand-50 border-brand-100"},
            {l:"Categories",     v:CATS.length-1,            c:"text-sky-700 bg-sky-50 border-sky-100"},
          ].map((s,i)=>(
            <motion.div key={s.l} initial={{opacity:0,y:16}} animate={{opacity:1,y:0}} transition={{delay:i*0.07}}>
              <div className={`card p-4 border text-center ${s.c}`}>
                <div className="text-2xl font-bold mb-0.5">{s.v}</div>
                <div className="text-xs font-semibold opacity-70">{s.l}</div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Low stock banner */}
        {low.length > 0 && (
          <motion.div initial={{opacity:0}} animate={{opacity:1}}
            className="flex items-start gap-3 p-4 bg-rose-50 border border-rose-200 rounded-xl mb-5 text-rose-800">
            <AlertTriangle className="w-5 h-5 mt-0.5 flex-shrink-0"/>
            <div>
              <p className="font-bold text-sm">Low Stock Alert — {low.length} item{low.length>1?"s":""} below minimum threshold</p>
              <p className="text-xs mt-0.5 opacity-80">{low.map(i=>i.name).join(" · ")}</p>
            </div>
          </motion.div>
        )}

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3 mb-5">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400"/>
            <input className="pl-9" placeholder="Search inventory…" value={q} onChange={e=>setQ(e.target.value)}/>
          </div>
          <div className="flex gap-1.5 flex-wrap">
            {CATS.map(c=>(
              <button key={c} onClick={()=>setCat(c)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${cat===c?"bg-brand-600 text-white":"bg-white border border-slate-200 text-slate-600 hover:border-brand-300 hover:text-brand-700"}`}>
                {c}
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        <Card hover={false} className="overflow-x-auto p-0">
          <table className="w-full min-w-[700px]">
            <thead>
              <tr className="border-b border-slate-100">
                {["Item Name","Category","In Stock","Min Threshold","Cost/Unit","Total Value","Last Used","Actions"].map(h=>(
                  <th key={h} className="text-left text-xs font-semibold text-slate-400 tracking-wider px-5 py-4">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filtered.map((item,i)=>{
                const isLow = item.qty <= item.minQty;
                return (
                  <motion.tr key={item.id} initial={{opacity:0,x:-12}} animate={{opacity:1,x:0}} transition={{delay:i*0.04}}
                    className="hover:bg-slate-50/70 transition-colors">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <Package className="w-4 h-4 text-slate-300"/>
                        <span className="font-semibold text-slate-800 text-sm">{item.name}</span>
                        {isLow && <span className="badge badge-red text-[9px]">LOW</span>}
                      </div>
                    </td>
                    <td className="px-5 py-4"><span className={`badge ${CAT_STYLE[item.cat]||"badge-slate"}`}>{item.cat}</span></td>
                    <td className="px-5 py-4">
                      <span className={`text-lg font-bold ${isLow?"text-rose-600":"text-slate-800"}`}>{item.qty}</span>
                      <span className="text-xs text-slate-400 ml-1">{item.unit}</span>
                    </td>
                    <td className="px-5 py-4 text-sm text-slate-500">{item.minQty} {item.unit}</td>
                    <td className="px-5 py-4 text-sm text-slate-500">₹{item.cost}</td>
                    <td className="px-5 py-4 font-semibold text-amber-600 text-sm">₹{(item.qty*item.cost).toLocaleString("en-IN")}</td>
                    <td className="px-5 py-4 text-xs text-slate-400">{item.lastUsed}</td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-1">
                        <button onClick={()=>handleAdjust(item.id,-10,item.name)} className="p-1.5 rounded-lg hover:bg-rose-50 text-slate-400 hover:text-rose-500 transition-colors"><Minus className="w-3.5 h-3.5"/></button>
                        <button onClick={()=>handleAdjust(item.id,50,item.name)}  className="p-1.5 rounded-lg hover:bg-brand-50 text-slate-400 hover:text-brand-600 transition-colors"><Plus className="w-3.5 h-3.5"/></button>
                        <button onClick={()=>deleteItem(item.id)}                 className="p-1.5 rounded-lg hover:bg-rose-50 text-slate-400 hover:text-rose-500 transition-colors"><Trash2 className="w-3.5 h-3.5"/></button>
                      </div>
                    </td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
          {filtered.length===0 && (
            <div className="text-center py-16 text-slate-400">
              <Package className="w-10 h-10 mx-auto mb-3 opacity-30"/>
              <p className="font-medium">No items found</p>
              <p className="text-sm mt-1">Try a different category or search term</p>
            </div>
          )}
        </Card>
      </div>

      {/* Add modal */}
      <AnimatePresence>
        {showAdd && (
          <>
            <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50" onClick={()=>setShowAdd(false)}/>
            <motion.div initial={{opacity:0,scale:.95,y:16}} animate={{opacity:1,scale:1,y:0}} exit={{opacity:0,scale:.95}}
              className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-md p-4">
              <Card hover={false} className="shadow-float border-brand-200">
                <div className="flex items-center justify-between mb-5">
                  <h3 className="font-bold text-xl text-slate-800">Add Inventory Item</h3>
                  <button onClick={()=>setShowAdd(false)} className="p-1.5 rounded-xl hover:bg-slate-100 text-slate-400"><X className="w-5 h-5"/></button>
                </div>
                <div className="space-y-3">
                  <div><label className="text-xs font-semibold text-slate-500 block mb-1.5">ITEM NAME</label>
                    <input placeholder="e.g. Rice Seeds IR-64" value={form.name} onChange={e=>setForm(p=>({...p,name:e.target.value}))}/>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div><label className="text-xs font-semibold text-slate-500 block mb-1.5">CATEGORY</label>
                      <select value={form.cat} onChange={e=>setForm(p=>({...p,cat:e.target.value}))}>
                        {CATS.slice(1).map(c=><option key={c}>{c}</option>)}
                      </select>
                    </div>
                    <div><label className="text-xs font-semibold text-slate-500 block mb-1.5">UNIT</label>
                      <select value={form.unit} onChange={e=>setForm(p=>({...p,unit:e.target.value}))}>
                        {["kg","L","g","ml","roll","bag","pack","unit"].map(u=><option key={u}>{u}</option>)}
                      </select>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    <div><label className="text-xs font-semibold text-slate-500 block mb-1.5">QTY</label>
                      <input type="number" value={form.qty} onChange={e=>setForm(p=>({...p,qty:+e.target.value}))}/>
                    </div>
                    <div><label className="text-xs font-semibold text-slate-500 block mb-1.5">MIN QTY</label>
                      <input type="number" value={form.minQty} onChange={e=>setForm(p=>({...p,minQty:+e.target.value}))}/>
                    </div>
                    <div><label className="text-xs font-semibold text-slate-500 block mb-1.5">COST (₹)</label>
                      <input type="number" value={form.cost} onChange={e=>setForm(p=>({...p,cost:+e.target.value}))}/>
                    </div>
                  </div>
                  <button onClick={handleAdd} className="btn btn-primary w-full py-3 mt-2">Add to Inventory</button>
                </div>
              </Card>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
