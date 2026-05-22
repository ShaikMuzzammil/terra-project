import type { Metadata } from "next";
import "./globals.css";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import ToastNotifications from "@/components/ToastNotifications";

export const metadata: Metadata = {
  title: "AgroWave — Smart Farming Platform for India",
  description: "Real-time soil intelligence, predictive weather, and live market prices for modern Indian farmers.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🌱</text></svg>"/>
      </head>
      <body>
        <Navigation/>
        <main className="min-h-screen">{children}</main>
        <Footer/>
        <ToastNotifications/>
      </body>
    </html>
  );
}
