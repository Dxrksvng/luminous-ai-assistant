import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Hologram theme colors
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",

        // Hologram specific
        hologram: {
          cyan: "hsl(180, 100%, 50%)",
          blue: "hsl(220, 100%, 50%)",
          purple: "hsl(280, 100%, 50%)",
        },
        // Luminous v2.0 specific
        navy: "#0a0e1a",
        "navy-2": "#0d1224",
        "navy-3": "#111827",
        cyan: {
          DEFAULT: "#00d4ff",
          2: "rgba(0, 212, 255, 0.15)",
          3: "rgba(0, 212, 255, 0.08)",
          4: "#00d4ff",
        },
        violet: {
          DEFAULT: "#7b5ea7",
          2: "rgba(123, 94, 167, 0.2)",
        },
        gold: {
          DEFAULT: "#ffc450",
          2: "rgba(255, 196, 80, 0.15)",
        },
        green: "#00e5a0",
        red: "#ff4d6d",
        orange: "#ff8c42",
        "white-30": "rgba(240, 244, 255, 0.3)",
        "white-15": "rgba(240, 244, 255, 0.15)",
        "white-08": "rgba(240, 244, 255, 0.08)",
        "white-04": "rgba(240, 244, 255, 0.04)",
        glass: "rgba(10, 14, 26, 0.75)",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "scan-line": {
          "0%": { transform: "translateY(-100%)" },
          "100%": { transform: "translateY(100vh)" },
        },
        "pulse-glow": {
          "0%, 100%": { opacity: "1", filter: "brightness(1)" },
          "50%": { opacity: "0.8", filter: "brightness(1.2)" },
        },
        "float": {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
        },
        "rotate-slow": {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(360deg)" },
        },
      },
      animation: {
        "scan-line": "scan-line 3s linear infinite",
        "pulse-glow": "pulse-glow 2s ease-in-out infinite",
        "float": "float 3s ease-in-out infinite",
        "rotate-slow": "rotate-slow 20s linear infinite",
      },
      backgroundImage: {
        "hologram-gradient":
          "linear-gradient(135deg, hsl(var(--primary) / 0.1) 0%, hsl(var(--secondary) / 0.05) 50%, transparent 100%)",
        "scan-line-gradient":
          "linear-gradient(180deg, transparent, hsl(var(--primary) / 0.1), transparent)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
