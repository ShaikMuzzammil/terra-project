import Link from "next/link";
import { Sprout, ExternalLink, Mail, Phone, MapPin } from "lucide-react";

const resourceLinks = [
  { name: "PM-KISAN Portal", url: "https://pmkisan.gov.in", desc: "Direct farmer income support" },
  { name: "eNAM (National Agriculture Market)", url: "https://enam.gov.in", desc: "Unified national market for agri commodities" },
  { name: "Agmarknet", url: "https://agmarknet.gov.in", desc: "Daily market prices from 3000+ mandis" },
  { name: "IMD Agromet", url: "https://mausam.imd.gov.in", desc: "India Meteorological Department forecasts" },
  { name: "Soil Health Card", url: "https://soilhealth.dac.gov.in", desc: "Soil testing & nutrient recommendations" },
  { name: "Kisan Call Center", url: "tel:18001801551", desc: "1800-180-1551 (Toll Free)" },
  { name: "ICAR Portal", url: "https://icar.org.in", desc: "Agricultural research & advisories" },
  { name: "Farmer Portal (Gov)", url: "https://farmer.gov.in", desc: "Government schemes & services" },
];

const quickLinks = [
  { name: "Dashboard", href: "/dashboard" },
  { name: "Field Monitor", href: "/field-monitor" },
  { name: "Weather Intel", href: "/weather" },
  { name: "Live Market", href: "/market" },
  { name: "Farm Calendar", href: "/calendar" },
  { name: "Inventory", href: "/inventory" },
  { name: "Contact & Support", href: "/contact" },
];

export default function Footer() {
  return (
    <footer className="relative z-10 bg-soil border-t border-bark mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          <div className="lg:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-full bg-moss flex items-center justify-center">
                <Sprout className="w-6 h-6 text-parchment" />
              </div>
              <span className="font-display text-2xl font-bold text-parchment">TERRA</span>
            </div>
            <p className="text-clay text-sm leading-relaxed mb-4">
              Empowering 140 million Indian farmers with real-time intelligence. 
              From soil to sale, every decision backed by data.
            </p>
            <div className="space-y-2 text-sm text-clay">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-amber" />
                <span>support@terra.farm</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-amber" />
                <span>+91 1800-TERRA-01</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-amber" />
                <span>Hyderabad, Telangana, India</span>
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-display text-lg text-parchment mb-4">Platform</h3>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link 
                    href={link.href} 
                    className="text-clay hover:text-amber transition-colors text-sm flex items-center gap-1"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-2">
            <h3 className="font-display text-lg text-parchment mb-4">Government & Agricultural Resources</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {resourceLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-start gap-2 p-2 rounded-md hover:bg-loam/50 transition-colors"
                >
                  <ExternalLink className="w-4 h-4 text-moss mt-0.5 shrink-0 group-hover:text-amber" />
                  <div>
                    <div className="text-parchment text-sm font-medium group-hover:text-amber transition-colors">
                      {link.name}
                    </div>
                    <div className="text-clay text-xs">{link.desc}</div>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="border-t border-bark pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-clay text-xs font-data">
            © 2026 TERRA // Built for Indian Farmers // 17.3850°N 78.4867°E
          </p>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 text-xs text-clay">
              <span className="w-2 h-2 rounded-full bg-leaf animate-pulse-glow" />
              All Systems Operational
            </span>
            <span className="text-bark">|</span>
            <span className="text-xs text-clay">No Login Required</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
