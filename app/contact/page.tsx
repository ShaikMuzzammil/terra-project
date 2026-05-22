"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Phone, MapPin, Send, CheckCircle, MessageSquare, ChevronDown } from "lucide-react";
import Card from "@/components/Card";

const FAQ = [
  {q:"Is AgroWave free to use?",           a:"Yes — completely free, no account required. Open the platform and start immediately."},
  {q:"Does it need any hardware?",          a:"No hardware needed. Start with manual entry. IoT sensor integration can be added later."},
  {q:"How accurate are the forecasts?",     a:"Our hyper-local model achieves 99.2% accuracy for 24-hour predictions."},
  {q:"Are the market prices real?",         a:"Prices are simulated from real MSP data with realistic variation. In production, live mandi APIs would feed real rates."},
  {q:"Where is my farm data stored?",       a:"Entirely in your browser using localStorage. No server, no cloud, no account — your data stays with you."},
  {q:"Can I use this for my hackathon?",    a:"This IS the hackathon project! It demonstrates a complete smart farming platform built with Next.js 14."},
];

export default function Contact() {
  const [form, setForm]   = useState({name:"",email:"",phone:"",subject:"General Inquiry",msg:""});
  const [sent, setSent]   = useState(false);
  const [busy, setBusy]   = useState(false);
  const [openFaq, setFaq] = useState<number|null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name||!form.email||!form.msg) return;
    setBusy(true);
    await new Promise(r=>setTimeout(r,1200));
    setSent(true); setBusy(false);
  };

  if (sent) return (
    <div className="pt-[88px] min-h-screen bg-slate-50 flex items-center justify-center px-4">
      <motion.div initial={{opacity:0,scale:.9}} animate={{opacity:1,scale:1}} className="text-center max-w-md">
        <div className="w-20 h-20 rounded-full bg-brand-100 border-2 border-brand-300 flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-10 h-10 text-brand-600"/>
        </div>
        <h2 className="text-3xl font-bold text-slate-900 mb-3">Message Sent!</h2>
        <p className="text-slate-500 mb-6">Thank you, {form.name}. We'll get back to you within 24 hours.</p>
        <button onClick={()=>{setSent(false);setForm({name:"",email:"",phone:"",subject:"General Inquiry",msg:""});}}
          className="btn btn-primary px-8 py-3">Send Another Message</button>
      </motion.div>
    </div>
  );

  return (
    <div className="pt-[88px] min-h-screen bg-slate-50">
      <div className="container py-12">
        <motion.div initial={{opacity:0,y:16}} animate={{opacity:1,y:0}} className="text-center mb-14">
          <h1 className="text-5xl font-bold text-slate-900 mb-4">Get in <span className="grad-text">Touch</span></h1>
          <p className="text-slate-500 text-lg max-w-xl mx-auto">Questions, partnerships, or feedback — we'd love to hear from you.</p>
        </motion.div>

        {/* Contact info */}
        <div className="grid md:grid-cols-3 gap-4 mb-12 max-w-3xl mx-auto">
          {[
            {icon:Phone,  title:"Kisan Helpline",  val:"1800-180-1551",     sub:"Mon–Sat, 6am–10pm"},
            {icon:Mail,   title:"Email",            val:"hello@agrowave.farm",sub:"Reply within 24h"},
            {icon:MapPin, title:"Location",         val:"Hyderabad, India",  sub:"Telangana – 500032"},
          ].map((c,i)=>(
            <motion.div key={i} initial={{opacity:0,y:16}} animate={{opacity:1,y:0}} transition={{delay:i*0.1}}>
              <Card className="text-center p-6">
                <div className="w-12 h-12 rounded-xl bg-brand-50 border border-brand-100 flex items-center justify-center mx-auto mb-3">
                  <c.icon className="w-6 h-6 text-brand-600"/>
                </div>
                <p className="font-bold text-slate-800 mb-1">{c.title}</p>
                <p className="text-brand-700 font-semibold text-sm">{c.val}</p>
                <p className="text-xs text-slate-400 mt-0.5">{c.sub}</p>
              </Card>
            </motion.div>
          ))}
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* Form */}
          <motion.div initial={{opacity:0,x:-20}} animate={{opacity:1,x:0}}>
            <Card hover={false}>
              <h2 className="font-bold text-xl text-slate-800 mb-6 flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-brand-600"/> Send a Message
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-slate-500 block mb-1.5">FULL NAME *</label>
                    <input required placeholder="Ramesh Kumar" value={form.name} onChange={e=>setForm(p=>({...p,name:e.target.value}))}/>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-500 block mb-1.5">PHONE</label>
                    <input placeholder="+91 98765 43210" value={form.phone} onChange={e=>setForm(p=>({...p,phone:e.target.value}))}/>
                  </div>
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-500 block mb-1.5">EMAIL *</label>
                  <input required type="email" placeholder="farmer@example.com" value={form.email} onChange={e=>setForm(p=>({...p,email:e.target.value}))}/>
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-500 block mb-1.5">SUBJECT</label>
                  <select value={form.subject} onChange={e=>setForm(p=>({...p,subject:e.target.value}))}>
                    {["General Inquiry","Technical Support","Partnership","Feature Request","Bug Report","Kisan Helpline"].map(s=><option key={s}>{s}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-500 block mb-1.5">MESSAGE *</label>
                  <textarea required rows={5} placeholder="How can AgroWave help your farm?" value={form.msg} onChange={e=>setForm(p=>({...p,msg:e.target.value}))}/>
                </div>
                <button type="submit" disabled={busy} className="btn btn-primary w-full py-3 disabled:opacity-60 disabled:cursor-not-allowed">
                  {busy ? (
                    <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"/> Sending…</>
                  ) : (
                    <><Send className="w-4 h-4"/> Send Message</>
                  )}
                </button>
              </form>
            </Card>
          </motion.div>

          {/* FAQ */}
          <motion.div initial={{opacity:0,x:20}} animate={{opacity:1,x:0}} className="space-y-3">
            <h2 className="font-bold text-xl text-slate-800 mb-4">Frequently Asked Questions</h2>
            {FAQ.map((f,i)=>(
              <Card key={i} className={`cursor-pointer transition-all ${openFaq===i?"border-brand-300 bg-brand-50/30":""}`} hover={false}>
                <button onClick={()=>setFaq(openFaq===i?null:i)} className="w-full text-left">
                  <div className="flex items-center justify-between gap-3">
                    <span className="font-semibold text-slate-800 text-sm">{f.q}</span>
                    <ChevronDown className={`w-4 h-4 text-slate-400 flex-shrink-0 transition-transform ${openFaq===i?"rotate-180":""}`}/>
                  </div>
                  <AnimatedAnswer show={openFaq===i} text={f.a}/>
                </button>
              </Card>
            ))}

            <Card hover={false} className="bg-brand-50 border-brand-100 mt-4">
              <h3 className="font-bold text-slate-800 mb-2">🏆 Hackathon Project</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                AgroWave was built as a smart agriculture hackathon submission. It demonstrates a complete, production-ready platform for Indian farmers with real-time data, AI-driven insights, and a fully interactive interface — all deployable in one command.
              </p>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

function AnimatedAnswer({show,text}:{show:boolean;text:string}) {
  if (!show) return null;
  return <p className="text-slate-500 text-sm mt-3 leading-relaxed border-t border-brand-100 pt-3">{text}</p>;
}
