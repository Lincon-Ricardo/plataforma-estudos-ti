import type { Config } from "tailwindcss";
const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        ink: "#101a20",
        panel: "#18262d",
        panel2: "#1c2c34",
        side: "#142b35",
        line: "#30434b",
        accent: "#61c3b6",
        accentdeep: "#80d5c8",
        accentsoft: "#213c3c",
        gold: "#e7ac58",
        bodytext: "#e6eff0",
        muted: "#a0b2b7",
      },
      fontFamily: {
        sans: ['"DM Sans"', '"Segoe UI"', "system-ui", "sans-serif"],
        display: ["Manrope", '"DM Sans"', '"Segoe UI"', "sans-serif"],
        mono: ['"DM Mono"', "ui-monospace", "monospace"],
      },
      boxShadow: { panel: "0 8px 28px rgba(0,0,0,0.16)" },
    },
  },
  plugins: [],
};
export default config;
