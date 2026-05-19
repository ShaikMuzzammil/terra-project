"use client";
import Link from "next/link";
import { Sprout, Github, Twitter, Mail, Phone } from "lucide-react";

export default function Footer() {
  return (
    <footer className="relative border-t border-bark/40 bg-void mt-auto">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-moss flex items-center justify-center">
                <Sprout className="w-4 h-4 text-parchment" />
              </div>
              <span className="font-display text-lg text-parchment tracking-widest">TERRA</span>
            </div>
            <p className="font-data text-xs text-clay leading-relaxed mb-4">
              Intelligent farming platform for modern Indian agriculture. From soil to sale.
            </p>
            <div className="flex items-center gap-3">
              {[Github, Twitter, Mail].map((Icon, i) => (
                <div key={i} className="w-8 h-8 rounded-lg bg-loam border border-bark hover:border-moss flex items-center justify-center cursor-pointer transition-all group">
                  <Icon className="w-4 h-4 text-clay group-hover:text-fern transition-colors" />
                </div>
              ))}
            </div>
          </div>

          {[
            { title:"Platform", links:[{l:"Dashboard",h:"/dashboard"},{l:"Field Monitor",h:"/field-monitor"},{l:"Weather",h:"/weather"},{l:"Market Prices",h:"/market"}] },
            { title:"Tools",    links:[{l:"Inventory",h:"/inventory"},{l:"Calendar",h:"/calendar"},{l:"Profit Calculator",h:"/market"},{l:"Crop Calendar",h:"/"}] },
            { title:"Support",  links:[{l:"Contact Us",h:"/contact"},{l:"Documentation",h:"/contact"},{l:"API Access",h:"/contact"},{l:"Feature Requests",h:"/contact"}] },
          ].map(col => (
            <div key={col.title}>
              <h4 className="font-display text-sm text-parchment mb-4 tracking-wide">{col.title}</h4>
              <ul className="space-y-2">
                {col.links.map(link => (
                  <li key={link.l}>
                    <Link href={link.h} className="font-data text-xs text-clay hover:text-fern transition-colors">{link.l}</Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-bark/40 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="font-data text-[10px] text-clay">
            © 2026 TERRA Farm Intelligence. Built for Indian Farmers.
          </p>
          <div className="flex items-center gap-2">
            <span className="status-dot" style={{background:"#95D5B2"}} />
            <span className="font-data text-[10px] text-fern">All systems operational</span>
          </div>
          <div className="flex items-center gap-1.5 font-data text-[10px] text-clay">
            <Phone className="w-3 h-3" />
            Kisan Helpline: 1800-180-1551
          </div>
        </div>
      </div>
    </footer>
  );
}
