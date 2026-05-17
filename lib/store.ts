import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface Plot {
  id: string; name: string; crop: string; size: number;
  moisture: number; health: number; temperature: number;
  npk: { n: number; p: number; k: number };
  lastIrrigated: string; autoIrrigate: boolean;
}

export interface Alert {
  id: string; type: "weather" | "pest" | "price" | "soil";
  message: string; severity: "low" | "medium" | "high" | "critical";
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

interface FarmStore {
  plots: Plot[]; alerts: Alert[]; inventory: InventoryItem[];
  activities: Activity[]; weatherAlerts: string[]; priceAlerts: any[];
  updatePlotMoisture: (id: string, moisture: number) => void;
  toggleAutoIrrigate: (id: string) => void;
  dismissAlert: (id: string) => void;
  addAlert: (alert: Alert) => void;
  addInventory: (item: InventoryItem) => void;
  updateInventory: (id: string, delta: number) => void;
  addActivity: (activity: Activity) => void;
  addPriceAlert: (alert: any) => void;
  removePriceAlert: (id: string) => void;
}

const defaultPlots: Plot[] = [
  { id: "A", name: "Plot A - North Field", crop: "Wheat", size: 4.5, moisture: 68, health: 92, temperature: 32, npk: { n: 142, p: 45, k: 180 }, lastIrrigated: "2 hours ago", autoIrrigate: true },
  { id: "B", name: "Plot B - East Block", crop: "Rice", size: 3.2, moisture: 45, health: 78, temperature: 34, npk: { n: 120, p: 38, k: 165 }, lastIrrigated: "5 hours ago", autoIrrigate: false },
  { id: "C", name: "Plot C - South Field", crop: "Cotton", size: 5.0, moisture: 23, health: 45, temperature: 36, npk: { n: 95, p: 52, k: 140 }, lastIrrigated: "1 day ago", autoIrrigate: true },
  { id: "D", name: "Plot D - West Block", crop: "Soybean", size: 3.8, moisture: 72, health: 88, temperature: 31, npk: { n: 155, p: 48, k: 195 }, lastIrrigated: "3 hours ago", autoIrrigate: true },
  { id: "E", name: "Plot E - Central", crop: "Maize", size: 4.0, moisture: 55, health: 82, temperature: 33, npk: { n: 135, p: 42, k: 175 }, lastIrrigated: "6 hours ago", autoIrrigate: false },
  { id: "F", name: "Plot F - Border", crop: "Onion", size: 2.5, moisture: 61, health: 90, temperature: 30, npk: { n: 148, p: 55, k: 188 }, lastIrrigated: "4 hours ago", autoIrrigate: true },
];

export const useFarmStore = create<FarmStore>()(
  persist(
    (set) => ({
      plots: defaultPlots,
      alerts: [
        { id: "1", type: "weather", message: "Rain expected in 6 hours — Postpone irrigation", severity: "medium", timestamp: new Date().toISOString(), dismissed: false },
        { id: "2", type: "pest", message: "Fall Armyworm detected — Plot C", severity: "high", plotId: "C", timestamp: new Date().toISOString(), dismissed: false },
        { id: "3", type: "price", message: "Soybean prices up 3.1% today", severity: "low", timestamp: new Date().toISOString(), dismissed: false },
        { id: "4", type: "soil", message: "Plot B moisture critical — 23%", severity: "critical", plotId: "B", timestamp: new Date().toISOString(), dismissed: false },
      ],
      inventory: [
        { id: "1", name: "Wheat Seeds (HD-2967)", category: "Seeds", stock: 850, unit: "kg", minThreshold: 200, costPerUnit: 45, lastUsed: "3 days ago" },
        { id: "2", name: "Urea (46% N)", category: "Fertilizer", stock: 1200, unit: "kg", minThreshold: 500, costPerUnit: 12, lastUsed: "1 week ago" },
        { id: "3", name: "DAP Fertilizer", category: "Fertilizer", stock: 45, unit: "kg", minThreshold: 100, costPerUnit: 35, lastUsed: "2 days ago" },
        { id: "4", name: "Chlorpyrifos 20% EC", category: "Pesticides", stock: 18, unit: "L", minThreshold: 20, costPerUnit: 280, lastUsed: "5 days ago" },
        { id: "5", name: "Tractor Diesel", category: "Fuel", stock: 150, unit: "L", minThreshold: 50, costPerUnit: 95, lastUsed: "1 day ago" },
        { id: "6", name: "Drip Irrigation Tape", category: "Tools", stock: 12, unit: "roll", minThreshold: 5, costPerUnit: 1200, lastUsed: "2 weeks ago" },
      ],
      activities: [
        { id: "1", type: "Irrigation", plot: "Plot A", description: "Irrigated for 45 minutes", timestamp: "14:32", duration: 45 },
        { id: "2", type: "Treatment", plot: "Plot C", description: "Applied pesticide for armyworm", timestamp: "13:15", duration: 120, cost: 3400 },
        { id: "3", type: "Fertilizer", plot: "Plot B", description: "Urea application 25kg/acre", timestamp: "11:00", duration: 90, cost: 1200 },
      ],
      weatherAlerts: [], priceAlerts: [],
      updatePlotMoisture: (id, moisture) =>
        set((state) => ({
          plots: state.plots.map((p) => {
            if (p.id !== id) return p;
            const health = moisture < 30 ? 45 : moisture < 50 ? 70 : moisture < 70 ? 85 : 95;
            return { ...p, moisture, health };
          }),
        })),
      toggleAutoIrrigate: (id) =>
        set((state) => ({
          plots: state.plots.map((p) => (p.id === id ? { ...p, autoIrrigate: !p.autoIrrigate } : p)),
        })),
      dismissAlert: (id) =>
        set((state) => ({ alerts: state.alerts.map((a) => (a.id === id ? { ...a, dismissed: true } : a)) })),
      addAlert: (alert) => set((state) => ({ alerts: [alert, ...state.alerts] })),
      addInventory: (item) => set((state) => ({ inventory: [...state.inventory, item] })),
      updateInventory: (id, delta) =>
        set((state) => ({
          inventory: state.inventory.map((i) => (i.id === id ? { ...i, stock: Math.max(0, i.stock + delta) } : i)),
        })),
      addActivity: (activity) => set((state) => ({ activities: [activity, ...state.activities] })),
      addPriceAlert: (alert) => set((state) => ({ priceAlerts: [...state.priceAlerts, alert] })),
      removePriceAlert: (id) => set((state) => ({ priceAlerts: state.priceAlerts.filter((a) => a.id !== id) })),
    }),
    { name: "terra-farm-store" }
  )
);