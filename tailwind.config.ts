import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        background: "#0B0D12",
        surface: "#11141C",
        surfaceSecondary: "#171B24",
        borderSoft: "rgba(255,255,255,0.08)",
        textPrimary: "#F7F8FA",
        textSecondary: "#9BA3AF",
        accent: "#6D5DF6"
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"]
      }
    }
  },
  plugins: []
};

export default config;
