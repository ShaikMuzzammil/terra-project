import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface Plot {
  id: string; name: string; crop: string; size: number;
  moisture: number; health: number; temperature: number;
  npk: { n: number; p: number; k: number };
  lastIrrigated: string; autoIrrigate: boolean;
  phase: string; soilPH: number; pestRisk: "low"|"medium"|"high";
}

export interface Alert {
  id: string; type: "weather"|"pest"|"price"|"soil"|"irrigation";
  message: string; severity: "low"|"medium"|"high"|"critical";
  plotId?: string; timestamp: string; dismissed: boolean;
}

export interface InventoryItem {
  id: string; name: string; category: string;
  stock: number; unit: string; minThreshold: number;
  costPerUnit: number; lastUsed: string;
}

export interface Activity {
  id: string; type: string; plot: string;
  description: string; timestamp: string;
  duration?: number; cost?: number;
}

export interface CalendarEvent {
  id: string; title: string; date: string;
  type: "irrigation"|"fertilizer"|"pesticide"|"harvest"|"planting"|"other";
  plot?: string; notes?: string; completed: boolean;
}

export interface PriceAlert {
  id: string; commodity: string; type: "above"|"below";
  threshold: number; email?: string;
}

interface FarmStore {
  plots: Plot[];
  alerts: Alert[];
  inventory: InventoryItem[];
  activities: Activity[];
  events: CalendarEvent[];
  priceAlerts: PriceAlert[];
  farmName: string;
  location: string;

  updatePlotMoisture: (id: string, moisture: number) => void;
  updatePlotField: (id: string, field: string, value: any) => void;
  toggleAutoIrrigate: (id: string) => void;
  addPlot: (plot: Plot) => void;
  deletePlot: (id: string) => void;
  dismissAlert: (id: string) => void;
  addAlert: (alert: Alert) => void;
  clearAllAlerts: () => void;
  addInventory: (item: InventoryItem) => void;
  updateInventory: (id: string, delta: number) => void;
  deleteInventory: (id: string) => void;
  addActivity: (activity: Activity) => void;
  addEvent: (event: CalendarEvent) => void;
  toggleEventComplete: (id: string) => void;
  deleteEvent: (id: string) => void;
  addPriceAlert: (alert: PriceAlert) => void;
  removePriceAlert: (id: string) => void;
  irrigatePlot: (id: string) => void;
  irrigateAll: () => void;
  setFarmName: (name: string) => void;
}

const defaultPlots: Plot[] = [
  { id: "A", name: "Plot A — North Field", crop: "Wheat", size: 4.5, moisture: 68, health: 92, temperature: 32, npk: { n: 142, p: 45, k: 180 }, lastIrrigated: "2 hours ago", autoIrrigate: true, phase: "Tillering", soilPH: 6.8, pestRisk: "low" },
  { id: "B", name: "Plot B — East Block",  crop: "Rice",   size: 3.2, moisture: 45, health: 78, temperature: 34, npk: { n: 120, p: 38, k: 165 }, lastIrrigated: "5 hours ago", autoIrrigate: false, phase: "Panicle Init.", soilPH: 6.2, pestRisk: "medium" },
  { id: "C", name: "Plot C — South Field", crop: "Cotton", size: 5.0, moisture: 23, health: 45, temperature: 36, npk: { n: 95,  p: 52, k: 140 }, lastIrrigated: "1 day ago",   autoIrrigate: true,  phase: "Boll Formation", soilPH: 7.1, pestRisk: "high" },
  { id: "D", name: "Plot D — West Block",  crop: "Soybean",size: 3.8, moisture: 72, health: 88, temperature: 31, npk: { n: 155, p: 48, k: 195 }, lastIrrigated: "3 hours ago", autoIrrigate: true,  phase: "Pod Fill", soilPH: 6.5, pestRisk: "low" },
  { id: "E", name: "Plot E — Central",     crop: "Maize",  size: 4.0, moisture: 55, health: 82, temperature: 33, npk: { n: 135, p: 42, k: 175 }, lastIrrigated: "6 hours ago", autoIrrigate: false, phase: "Silking", soilPH: 6.9, pestRisk: "low" },
  { id: "F", name: "Plot F — Border",      crop: "Onion",  size: 2.5, moisture: 61, health: 90, temperature: 30, npk: { n: 148, p: 55, k: 188 }, lastIrrigated: "4 hours ago", autoIrrigate: true,  phase: "Bulb Dev.", soilPH: 6.4, pestRisk: "low" },
];

const today = new Date();
const fmt = (d: Date) => d.toISOString().split("T")[0];
const addDays = (d: Date, n: number) => { const x = new Date(d); x.setDate(x.getDate()+n); return x; };

const defaultEvents: CalendarEvent[] = [
  { id:"e1", title:"Irrigate Plot A & D", date: fmt(today), type:"irrigation", plot:"A,D", notes:"Morning 6am irrigation cycle", completed:false },
  { id:"e2", title:"Apply Urea — Plot B", date: fmt(addDays(today,2)), type:"fertilizer", plot:"B", notes:"25kg/acre top dressing", completed:false },
  { id:"e3", title:"Pesticide — Plot C (Armyworm)", date: fmt(addDays(today,1)), type:"pesticide", plot:"C", notes:"Chlorpyrifos 2ml/L solution", completed:false },
  { id:"e4", title:"Wheat Harvest Estimate", date: fmt(addDays(today,45)), type:"harvest", plot:"A", notes:"Expected yield: 45 qtl/acre", completed:false },
  { id:"e5", title:"Soil Test — All Plots", date: fmt(addDays(today,7)), type:"other", notes:"Send samples to ICAR lab", completed:false },
  { id:"e6", title:"Soybean Planting", date: fmt(addDays(today,10)), type:"planting", plot:"D", notes:"Variety: JS-335", completed:false },
];

export const useFarmStore = create<FarmStore>()(
  persist(
    (set, get) => ({
      plots: defaultPlots,
      farmName: "Kisaan Farms",
      location: "Telangana, India",
      alerts: [
        { id:"a1", type:"pest",    message:"Fall Armyworm detected — Plot C. Treat within 48h.", severity:"critical", plotId:"C", timestamp: new Date().toISOString(), dismissed:false },
        { id:"a2", type:"soil",    message:"Plot C moisture critical (23%) — Immediate irrigation needed.", severity:"critical", plotId:"C", timestamp: new Date().toISOString(), dismissed:false },
        { id:"a3", type:"weather", message:"Heavy rain forecast in 6h — Postpone fertilizer application.", severity:"high", timestamp: new Date().toISOString(), dismissed:false },
        { id:"a4", type:"price",   message:"Soybean prices up 3.1% today — Good time to sell.", severity:"low", timestamp: new Date().toISOString(), dismissed:false },
        { id:"a5", type:"irrigation", message:"Plot B auto-irrigation disabled — Manual check required.", severity:"medium", plotId:"B", timestamp: new Date().toISOString(), dismissed:false },
      ],
      inventory: [
        { id:"i1", name:"Wheat Seeds (HD-2967)",    category:"Seeds",      stock:850,  unit:"kg",   minThreshold:200, costPerUnit:45,   lastUsed:"3 days ago" },
        { id:"i2", name:"Urea (46% N)",             category:"Fertilizer", stock:1200, unit:"kg",   minThreshold:500, costPerUnit:12,   lastUsed:"1 week ago" },
        { id:"i3", name:"DAP Fertilizer",           category:"Fertilizer", stock:45,   unit:"kg",   minThreshold:100, costPerUnit:35,   lastUsed:"2 days ago" },
        { id:"i4", name:"Chlorpyrifos 20% EC",      category:"Pesticides", stock:18,   unit:"L",    minThreshold:20,  costPerUnit:280,  lastUsed:"5 days ago" },
        { id:"i5", name:"Tractor Diesel",           category:"Fuel",       stock:150,  unit:"L",    minThreshold:50,  costPerUnit:95,   lastUsed:"1 day ago" },
        { id:"i6", name:"Drip Irrigation Tape",     category:"Tools",      stock:12,   unit:"roll", minThreshold:5,   costPerUnit:1200, lastUsed:"2 weeks ago" },
        { id:"i7", name:"Potash (MOP)",             category:"Fertilizer", stock:320,  unit:"kg",   minThreshold:150, costPerUnit:22,   lastUsed:"4 days ago" },
        { id:"i8", name:"Neem Oil (Biopesticide)",  category:"Pesticides", stock:8,    unit:"L",    minThreshold:5,   costPerUnit:180,  lastUsed:"1 week ago" },
      ],
      activities: [
        { id:"ac1", type:"Irrigation", plot:"Plot A",  description:"Auto-irrigation completed — 45 mins @ 12L/min", timestamp:"14:32", duration:45 },
        { id:"ac2", type:"Treatment",  plot:"Plot C",  description:"Chlorpyrifos applied for armyworm control",      timestamp:"13:15", duration:120, cost:3400 },
        { id:"ac3", type:"Fertilizer", plot:"Plot B",  description:"Urea top-dressing — 25kg/acre",                  timestamp:"11:00", duration:90,  cost:1200 },
        { id:"ac4", type:"Harvest",    plot:"Plot D",  description:"Sample harvest — yield estimate 18 qtl/acre",    timestamp:"09:30", duration:180 },
        { id:"ac5", type:"Monitoring", plot:"All",     description:"Morning field walk — no new pest sightings",     timestamp:"07:00", duration:30 },
      ],
      events: defaultEvents,
      priceAlerts: [],

      updatePlotMoisture: (id, moisture) =>
        set(s => ({ plots: s.plots.map(p => {
          if(p.id!==id) return p;
          const health = moisture<30?45 : moisture<50?70 : moisture<70?85 : 95;
          return { ...p, moisture, health };
        })})),

      updatePlotField: (id, field, value) =>
        set(s => ({ plots: s.plots.map(p => p.id===id ? { ...p, [field]: value } : p) })),

      toggleAutoIrrigate: (id) =>
        set(s => ({ plots: s.plots.map(p => p.id===id ? { ...p, autoIrrigate:!p.autoIrrigate } : p) })),

      addPlot: (plot) => set(s => ({ plots: [...s.plots, plot] })),
      deletePlot: (id) => set(s => ({ plots: s.plots.filter(p => p.id!==id) })),

      dismissAlert: (id) =>
        set(s => ({ alerts: s.alerts.map(a => a.id===id ? {...a, dismissed:true} : a) })),

      addAlert: (alert) => set(s => ({ alerts: [alert, ...s.alerts] })),

      clearAllAlerts: () =>
        set(s => ({ alerts: s.alerts.map(a => ({...a, dismissed:true})) })),

      addInventory: (item) => set(s => ({ inventory: [...s.inventory, item] })),

      updateInventory: (id, delta) =>
        set(s => ({ inventory: s.inventory.map(i => i.id===id ? {...i, stock: Math.max(0,i.stock+delta)} : i) })),

      deleteInventory: (id) => set(s => ({ inventory: s.inventory.filter(i => i.id!==id) })),

      addActivity: (activity) => set(s => ({ activities: [activity, ...s.activities] })),

      addEvent: (event) => set(s => ({ events: [...s.events, event] })),
      toggleEventComplete: (id) =>
        set(s => ({ events: s.events.map(e => e.id===id ? {...e, completed:!e.completed} : e) })),
      deleteEvent: (id) => set(s => ({ events: s.events.filter(e => e.id!==id) })),

      addPriceAlert: (alert) => set(s => ({ priceAlerts: [...s.priceAlerts, alert] })),
      removePriceAlert: (id) => set(s => ({ priceAlerts: s.priceAlerts.filter(a => a.id!==id) })),

      irrigatePlot: (id) => {
        const plot = get().plots.find(p => p.id===id);
        if(!plot) return;
        set(s => ({ plots: s.plots.map(p => p.id===id ? { ...p, moisture: Math.min(95, p.moisture+15), lastIrrigated:"just now", health: Math.min(98, p.health+5) } : p) }));
        get().addActivity({ id: Date.now().toString(), type:"Irrigation", plot: plot.name, description:`Manual irrigation triggered for ${plot.name}`, timestamp: new Date().toLocaleTimeString("en-IN", { hour:"2-digit", minute:"2-digit" }), duration:30 });
      },

      irrigateAll: () => {
        const plots = get().plots;
        set(s => ({ plots: s.plots.map(p => ({ ...p, moisture: Math.min(95, p.moisture+12), lastIrrigated:"just now" })) }));
        get().addActivity({ id: Date.now().toString(), type:"Irrigation", plot:"All Plots", description:"Mass irrigation initiated for all 6 plots", timestamp: new Date().toLocaleTimeString("en-IN", { hour:"2-digit", minute:"2-digit" }), duration:60 });
      },

      setFarmName: (name) => set({ farmName: name }),
    }),
    { name: "terra-farm-v2" }
  )
);
