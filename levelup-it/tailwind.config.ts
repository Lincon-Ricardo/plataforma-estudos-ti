import type { Config } from "tailwindcss";
const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        base: "#0B0F14",
        panel: "#11161D",
        muted: "#8B94A1",
      },
    },
  },
  plugins: [],
};
export default config;
