import type { Metadata } from "next";
import "./globals.css";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "TERRA — Intelligent Farming Platform",
  description: "Real-time soil intelligence, predictive weather, live market prices. Built for 140 million Indian farmers.",
  keywords: "agriculture, farming, India, crop prices, weather, soil monitoring, farm management",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="antialiased min-h-screen flex flex-col">
        <Navigation />
        <main className="flex-1 relative z-10">{children}</main>
        <Footer />
      </body>
    </html>
  );
}