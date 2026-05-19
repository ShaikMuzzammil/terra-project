import type { Metadata } from "next";
import "./globals.css";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "TERRA — Intelligent Farming Platform",
  description: "Real-time soil intelligence, predictive weather, and live market prices for modern Indian farmers.",
  keywords: "smart farming, precision agriculture, soil monitoring, crop prices, India",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🌱</text></svg>" />
      </head>
      <body className="noise-bg">
        {/* Ambient background layers */}
        <div className="fixed inset-0 pointer-events-none z-0">
          <div className="absolute inset-0" style={{
            background: "radial-gradient(ellipse at 20% 50%, rgba(45,106,79,0.06) 0%, transparent 60%), radial-gradient(ellipse at 80% 20%, rgba(233,163,25,0.04) 0%, transparent 50%)"
          }} />
          <div className="absolute inset-0 grid-lines opacity-30" />
        </div>

        <Navigation />
        <main className="relative z-10 min-h-screen">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
