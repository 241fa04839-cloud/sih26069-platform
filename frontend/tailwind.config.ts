import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./hooks/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        tactical: {
          canvas: "#0B0F17",
          panel: "#111827",
          border: "#1F2937",
          amber: "#F59E0B",
          crimson: "#EF4444",
          cyan: "#06B6D4",
          green: "#10B981",
        },
      },
      fontFamily: {
        mono: ["JetBrains Mono", "Roboto Mono", "monospace"],
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      borderColor: {
        tactical: "#1F2937",
      },
      animation: {
        "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "ticker-scroll": "ticker 30s linear infinite",
      },
      keyframes: {
        ticker: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
