"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Phone, MapPin, Send, CheckCircle, MessageSquare, Github, Twitter } from "lucide-react";
import GreenCard from "@/components/GreenCard";

const FAQ = [
  { q:"Is TERRA free to use?", a:"Yes, TERRA is completely free with no login required. Just open and start farming smarter." },
  { q:"Does TERRA require any hardware?", a:"No hardware needed. Start with manual entry. TERRA supports IoT sensor integration when you're ready to scale." },
  { q:"How accurate are the weather forecasts?", a:"Our hyper-local forecasts achieve 99.2% accuracy for 24-hour predictions using ensemble weather modeling." },
  { q:"Are the market prices real-time?", a:"Prices are updated every 60 seconds from 600+ mandis across India, cross-referenced with official MSP data." },
  { q:"Can I export my farm data?", a:"Yes, farm data can be exported as CSV or PDF reports via the Dashboard. Weekly email reports are also available." },
];

export default function Contact() {
  const [form, setForm] = useState({ name:"", email:"", phone:"", subject:"General Inquiry", message:"" });
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [openFaq, setOpenFaq] = useState<number|null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) return;
    setSending(true);
    await new Promise(r => setTimeout(r, 1200));
    setSent(true);
    setSending(false);
  };

  if (sent) return (
    <div className="pt-24 min-h-screen bg-void flex items-center justify-center px-4">
      <motion.div initial={{opacity:0,scale:0.9}} animate={{opacity:1,scale:1}} className="text-center max-w-md">
        <div className="w-20 h-20 rounded-full bg-moss/20 border border-moss/40 flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-10 h-10 text-fern"/>
        </div>
        <h2 className="font-display text-3xl text-parchment mb-3">Message Sent!</h2>
        <p className="font-data text-sm text-clay mb-6">Thank you, {form.name}. Our team will get back to you within 24 hours.</p>
        <button onClick={() => { setSent(false); setForm({ name:"", email:"", phone:"", subject:"General Inquiry", message:"" }); }}
          className="px-6 py-3 bg-moss hover:bg-fern text-parchment rounded-xl font-display text-sm tracking-wider transition-all">
          SEND ANOTHER
        </button>
      </motion.div>
    </div>
  );

  return (
    <div className="pt-24 min-h-screen bg-void px-4">
      <div className="max-w-6xl mx-auto py-10">
        <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} className="mb-12 text-center">
          <h1 className="font-display text-4xl md:text-6xl text-parchment mb-3">Get in <span className="text-amber">Touch</span></h1>
          <p className="font-data text-sm text-clay max-w-lg mx-auto">Questions, partnerships, or feedback — we'd love to hear from you. India's farmers deserve the best.</p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {[
            { icon:Phone,   title:"Kisan Helpline",   val:"1800-180-1551",    sub:"Mon–Sat, 6am–10pm" },
            { icon:Mail,    title:"Email Support",    val:"hello@terra.farm", sub:"Response within 24h" },
            { icon:MapPin,  title:"Head Office",      val:"Hyderabad, India", sub:"Telangana – 500032" },
          ].map((c,i) => (
            <motion.div key={c.title} initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{delay:i*0.1}}>
              <GreenCard className="text-center p-6 hover:border-amber/40 transition-all">
                <div className="w-12 h-12 rounded-xl bg-moss/15 border border-moss/30 flex items-center justify-center mx-auto mb-4">
                  <c.icon className="w-6 h-6 text-amber"/>
                </div>
                <h3 className="font-display text-base text-parchment mb-1">{c.title}</h3>
                <p className="font-data text-sm text-amber mb-1">{c.val}</p>
                <p className="font-data text-[10px] text-clay">{c.sub}</p>
              </GreenCard>
            </motion.div>
          ))}
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Form */}
          <motion.div initial={{opacity:0,x:-30}} animate={{opacity:1,x:0}}>
            <GreenCard hover={false}>
              <h2 className="font-display text-2xl text-parchment mb-6 flex items-center gap-2"><MessageSquare className="w-5 h-5 text-amber"/>Send a Message</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-data text-[10px] text-clay block mb-1.5">YOUR NAME *</label>
                    <input required placeholder="Ramesh Kumar" value={form.name} onChange={e=>setForm(p=>({...p,name:e.target.value}))}/>
                  </div>
                  <div>
                    <label className="font-data text-[10px] text-clay block mb-1.5">PHONE</label>
                    <input placeholder="+91 9876543210" value={form.phone} onChange={e=>setForm(p=>({...p,phone:e.target.value}))}/>
                  </div>
                </div>
                <div>
                  <label className="font-data text-[10px] text-clay block mb-1.5">EMAIL *</label>
                  <input required type="email" placeholder="farmer@example.com" value={form.email} onChange={e=>setForm(p=>({...p,email:e.target.value}))}/>
                </div>
                <div>
                  <label className="font-data text-[10px] text-clay block mb-1.5">SUBJECT</label>
                  <select value={form.subject} onChange={e=>setForm(p=>({...p,subject:e.target.value}))}>
                    {["General Inquiry","Technical Support","Partnership","Feature Request","Bug Report","Kisan Helpline"].map(s => <option key={s}>{s}</option>)}
                  </select>
                </div>
                <div>
                  <label className="font-data text-[10px] text-clay block mb-1.5">MESSAGE *</label>
                  <textarea required rows={5} placeholder="Tell us how TERRA can help your farm..." value={form.message} onChange={e=>setForm(p=>({...p,message:e.target.value}))}/>
                </div>
                <button type="submit" disabled={sending}
                  className="w-full flex items-center justify-center gap-2 py-3 bg-moss hover:bg-fern text-parchment rounded-xl font-display text-sm tracking-wider transition-all hover:scale-105 disabled:opacity-60 disabled:cursor-not-allowed">
                  {sending ? <><div className="w-4 h-4 border-2 border-parchment border-t-transparent rounded-full animate-spin"/><span>SENDING...</span></> : <><Send className="w-4 h-4"/><span>SEND MESSAGE</span></>}
                </button>
              </form>
            </GreenCard>
          </motion.div>

          {/* FAQ */}
          <motion.div initial={{opacity:0,x:30}} animate={{opacity:1,x:0}} className="space-y-3">
            <h2 className="font-display text-2xl text-parchment mb-4">Frequently Asked Questions</h2>
            {FAQ.map((faq, i) => (
              <motion.div key={i} initial={{opacity:0}} animate={{opacity:1}} transition={{delay:i*0.08}}>
                <GreenCard className={`cursor-pointer transition-all ${openFaq===i?"border-moss/50 bg-loam/60":""}`} hover={false}>
                  <button onClick={() => setOpenFaq(openFaq===i?null:i)} className="w-full text-left">
                    <div className="flex items-center justify-between">
                      <span className="font-display text-sm text-parchment pr-4">{faq.q}</span>
                      <span className={`text-amber text-lg flex-shrink-0 transition-transform ${openFaq===i?"rotate-45":""}`}>+</span>
                    </div>
                    {openFaq === i && (
                      <motion.p initial={{height:0,opacity:0}} animate={{height:"auto",opacity:1}} className="font-data text-xs text-clay mt-3 leading-relaxed">
                        {faq.a}
                      </motion.p>
                    )}
                  </button>
                </GreenCard>
              </motion.div>
            ))}

            <GreenCard hover={false} className="mt-6">
              <h3 className="font-display text-base text-parchment mb-3">Connect with us</h3>
              <div className="flex gap-3">
                {[
                  { icon:Github,  label:"GitHub",  href:"#" },
                  { icon:Twitter, label:"Twitter", href:"#" },
                  { icon:Mail,    label:"Email",   href:"mailto:hello@terra.farm" },
                ].map(s => (
                  <a key={s.label} href={s.href}
                    className="flex items-center gap-2 px-4 py-2 border border-bark/60 hover:border-moss/50 text-clay hover:text-fern rounded-lg font-data text-xs transition-all">
                    <s.icon className="w-3.5 h-3.5"/> {s.label}
                  </a>
                ))}
              </div>
            </GreenCard>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
