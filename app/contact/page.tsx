"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Send, Check, AlertCircle, Mail, User, MessageSquare, Tag } from "lucide-react";
import GreenCard from "@/components/GreenCard";

const subjects = ["General Query", "Technical Support", "Market Data", "Weather Alerts", "Partnership", "Other"];

const team = [
  { initial: "A", name: "Arjun Mehta", role: "Farm Systems Lead", specialty: "Soil sensor integration" },
  { initial: "P", name: "Priya Sharma", role: "Data Intelligence", specialty: "Yield prediction models" },
  { initial: "R", name: "Rohan Patel", role: "Market Analytics", specialty: "Commodity price APIs" },
  { initial: "N", name: "Nisha Reddy", role: "Weather Systems", specialty: "Hyper-local forecasting" },
];

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", subject: "General Query", message: "" });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [emailValid, setEmailValid] = useState<boolean | null>(null);
  const [charCount, setCharCount] = useState(0);

  const validateEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) return;
    if (!validateEmail(form.email)) { setEmailValid(false); return; }
    setStatus("loading");
    try {
      const res = await fetch("/api/contact", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
      if (res.ok) { setStatus("success"); setForm({ name: "", email: "", subject: "General Query", message: "" }); setCharCount(0); setTimeout(() => setStatus("idle"), 5000); }
      else setStatus("error");
    } catch (e) { setStatus("error"); }
  };

  return (
    <div className="pt-24 px-4 max-w-7xl mx-auto pb-12">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-12 text-center">
        <h1 className="font-display text-4xl md:text-5xl text-parchment mb-4">Get in Touch</h1>
        <p className="font-data text-clay max-w-xl mx-auto">Have questions about your farm data? Need technical support? Our team responds within 24 hours.</p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        <div className="lg:col-span-3">
          <GreenCard>
            <h2 className="font-display text-2xl text-parchment mb-6 relative inline-block">
              SEND MESSAGE
              <motion.div initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: 0.6 }} className="absolute -bottom-2 left-0 right-0 h-0.5 bg-amber origin-left" />
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="font-data text-xs text-clay mb-1 block flex items-center gap-1"><User className="w-3 h-3" /> Your Name</label>
                <input type="text" placeholder="Your Name" className="w-full glass-input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
              </div>
              <div>
                <label className="font-data text-xs text-clay mb-1 block flex items-center gap-1"><Mail className="w-3 h-3" /> Email Address</label>
                <div className="relative">
                  <input type="email" placeholder="your@email.com"
                    className={`w-full glass-input pr-10 ${emailValid === false ? "border-rust focus:border-rust focus:ring-rust/20" : emailValid === true ? "border-leaf focus:border-leaf focus:ring-leaf/20" : ""}`}
                    value={form.email} onChange={(e) => { setForm({ ...form, email: e.target.value }); if (e.target.value) setEmailValid(validateEmail(e.target.value)); }} required />
                  {emailValid === true && <Check className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-leaf" />}
                  {emailValid === false && <AlertCircle className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-rust" />}
                </div>
                {emailValid === false && <p className="text-rust text-xs font-data mt-1">Invalid email format</p>}
              </div>
              <div>
                <label className="font-data text-xs text-clay mb-1 block flex items-center gap-1"><Tag className="w-3 h-3" /> Subject</label>
                <div className="relative">
                  <select className="w-full glass-input appearance-none" value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })}>
                    {subjects.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                    <svg className="w-4 h-4 text-amber" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                  </div>
                </div>
              </div>
              <div>
                <label className="font-data text-xs text-clay mb-1 block flex items-center gap-1"><MessageSquare className="w-3 h-3" /> Message</label>
                <textarea placeholder="Write your message here..." className="w-full glass-input min-h-[160px] resize-y" maxLength={500}
                  value={form.message} onChange={(e) => { setForm({ ...form, message: e.target.value }); setCharCount(e.target.value.length); }} required />
                <div className={`text-right font-data text-xs mt-1 ${charCount > 450 ? "text-rust" : charCount > 350 ? "text-amber" : "text-clay"}`}>{charCount} / 500</div>
              </div>
              <motion.button type="submit" disabled={status === "loading" || status === "success"} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                className={`w-full py-4 rounded-md font-display text-sm tracking-[0.15em] transition-all flex items-center justify-center gap-2 ${
                  status === "success" ? "bg-leaf text-void" : status === "error" ? "bg-rust text-parchment" : "bg-moss hover:bg-fern text-parchment"
                }`}>
                {status === "loading" ? <><div className="w-5 h-5 border-2 border-parchment border-t-transparent rounded-full animate-spin" />SENDING...</>
                  : status === "success" ? <><Check className="w-5 h-5" />✓ MESSAGE SENT</>
                  : status === "error" ? <><AlertCircle className="w-5 h-5" />✗ FAILED — TRY AGAIN</>
                  : <><Send className="w-4 h-4" />SEND MESSAGE →</>}
              </motion.button>
            </form>
          </GreenCard>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-6">
            {[{ name: "WEATHER API", status: "LIVE", latency: "142ms" }, { name: "PRICE DATA", status: "LIVE", latency: "89ms" }, { name: "RESEND EMAIL", status: "OPERATIONAL", latency: "" }, { name: "DATABASE", status: "HEALTHY", latency: "12ms" }].map((sys) => (
              <div key={sys.name} className="glass-card p-3 text-center">
                <div className="flex items-center justify-center gap-2 mb-1"><span className="w-2 h-2 rounded-full bg-leaf animate-pulse-glow" /><span className="font-data text-[10px] text-clay">{sys.name}</span></div>
                <div className="font-data text-xs text-parchment">{sys.status}</div>
                {sys.latency && <div className="font-data text-[10px] text-clay">{sys.latency}</div>}
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-2">
          <h3 className="font-display text-lg text-parchment mb-4">Our Team</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {team.map((member, i) => (
              <motion.div key={member.name} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
                className="glass-card p-6 text-center hover:border-amber/50 transition-colors">
                <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-moss to-soil flex items-center justify-center mb-4">
                  <span className="font-accent text-3xl text-amber">{member.initial}</span>
                </div>
                <h4 className="font-display text-lg text-parchment mb-1">{member.name}</h4>
                <span className="inline-block px-3 py-1 bg-moss/20 text-fern rounded-full text-[10px] font-data mb-2">{member.role}</span>
                <p className="font-data text-xs text-clay">{member.specialty}</p>
              </motion.div>
            ))}
          </div>
          <GreenCard className="mt-6">
            <h4 className="font-display text-lg text-parchment mb-3">Direct Contact</h4>
            <div className="space-y-3 font-data text-sm">
              <div className="flex items-center gap-3 text-clay"><Mail className="w-4 h-4 text-amber" /><span>support@terra.farm</span></div>
              <div className="flex items-center gap-3 text-clay"><MessageSquare className="w-4 h-4 text-amber" /><span>+91 1800-TERRA-01</span></div>
              <div className="flex items-center gap-3 text-clay"><Tag className="w-4 h-4 text-amber" /><span>Hyderabad, Telangana, India</span></div>
            </div>
          </GreenCard>
        </div>
      </div>
    </div>
  );
}