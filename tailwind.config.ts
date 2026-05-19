import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        void:      "#0A0600",
        soil:      "#1A0E05",
        loam:      "#2A1A0A",
        bark:      "#3D2410",
        clay:      "#8B5E3C",
        parchment: "#F5E6C8",
        amber:     "#E9A319",
        wheat:     "#F4D03F",
        fern:      "#52B788",
        leaf:      "#95D5B2",
        moss:      "#2D6A4F",
        rust:      "#C0392B",
      },
      fontFamily: {
        display: ["Fraunces", "Georgia", "serif"],
        data:    ["Space Mono", "Courier New", "monospace"],
        accent:  ["Playfair Display", "Georgia", "serif"],
      },
      animation: {
        "pulse-glow": "pulseGlow 2s ease-in-out infinite",
        "float":      "float 6s ease-in-out infinite",
        "grain":      "grain 0.5s steps(1) infinite",
        "scan":       "scan 3s linear infinite",
        "ticker":     "ticker 30s linear infinite",
        "spin-slow":  "spin 8s linear infinite",
      },
      keyframes: {
        pulseGlow: {
          "0%,100%": { boxShadow: "0 0 5px #2D6A4F50" },
          "50%":     { boxShadow: "0 0 20px #2D6A4F80, 0 0 40px #2D6A4F40" },
        },
        float: {
          "0%,100%": { transform: "translateY(0px)" },
          "50%":     { transform: "translateY(-10px)" },
        },
        grain: {
          "0%,100%": { transform: "translate(0,0)" },
          "10%":     { transform: "translate(-2%,-3%)" },
          "20%":     { transform: "translate(3%,2%)" },
          "30%":     { transform: "translate(-1%,3%)" },
          "40%":     { transform: "translate(2%,-1%)" },
          "50%":     { transform: "translate(-3%,1%)" },
          "60%":     { transform: "translate(1%,3%)" },
          "70%":     { transform: "translate(-2%,1%)" },
          "80%":     { transform: "translate(3%,-2%)" },
          "90%":     { transform: "translate(-1%,2%)" },
        },
        scan: {
          "0%":   { transform: "translateY(-100%)" },
          "100%": { transform: "translateY(100vh)" },
        },
        ticker: {
          "0%":   { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
      },
      backgroundImage: {
        "mesh-1": "radial-gradient(at 40% 20%, #2D6A4F22 0, transparent 50%), radial-gradient(at 80% 0%, #E9A31911 0, transparent 40%), radial-gradient(at 0% 50%, #1A0E0580 0, transparent 50%)",
        "mesh-2": "radial-gradient(at 0% 100%, #2D6A4F33 0, transparent 50%), radial-gradient(at 100% 0%, #E9A31922 0, transparent 50%)",
      },
    },
  },
  plugins: [],
};

export default config;
