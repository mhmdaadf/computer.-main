import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./hooks/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-inter)", "sans-serif"],
        display: ["var(--font-space-grotesk)", "sans-serif"],
        mono: ["var(--font-jetbrains-mono)", "monospace"],
      },
      colors: {
        ink: "#0F172A",
        cream: "#FFF9F0",
        amberpop: "#F59E0B",
        cyanpop: "#0891B2",
        coral: "#F97316",
        surface: "var(--surface)",
        surfaceMuted: "var(--surface-muted)",
        muted: "var(--muted)",
        success: {
          50: "#ecfdf5",
          100: "#d1fae5",
          500: "#10b981",
          700: "#047857",
        },
        warning: {
          50: "#fffbeb",
          100: "#fef3c7",
          500: "#f59e0b",
          700: "#b45309",
        },
        danger: {
          50: "#fef2f2",
          100: "#fee2e2",
          500: "#ef4444",
          700: "#b91c1c",
        },
      },
      boxShadow: {
        card: "0 20px 40px -25px rgba(15, 23, 42, 0.35)",
        hover: "0 25px 50px -20px rgba(15, 23, 42, 0.45)",
      },
      keyframes: {
        rise: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "slide-up": {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "slide-down": {
          "0%": { opacity: "0", transform: "translateY(-10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "fade-in-scale": {
          "0%": { opacity: "0", transform: "scale(0.95)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        "pulse-subtle": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.8" },
        },
        "toast-in": {
          "0%": { opacity: "0", transform: "translateY(100%) scale(0.9)" },
          "100%": { opacity: "1", transform: "translateY(0) scale(1)" },
        },
        "toast-out": {
          "0%": { opacity: "1", transform: "translateY(0) scale(1)" },
          "100%": { opacity: "0", transform: "translateY(100%) scale(0.9)" },
        },
      },
      animation: {
        rise: "rise 500ms ease-out both",
        "slide-up": "slide-up 300ms ease-out both",
        "slide-down": "slide-down 300ms ease-out both",
        "fade-in-scale": "fade-in-scale 250ms ease-out both",
        "pulse-subtle": "pulse-subtle 2s ease-in-out infinite",
        "toast-in": "toast-in 300ms cubic-bezier(0.16, 1, 0.3, 1) forwards",
        "toast-out": "toast-out 300ms cubic-bezier(0.16, 1, 0.3, 1) forwards",
      },
    },
  },
  plugins: [],
};

export default config;
