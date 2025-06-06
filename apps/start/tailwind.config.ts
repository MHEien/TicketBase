import type { Config } from "tailwindcss";

export default {
  // Content detection is now automatic in v4, but you can still specify if needed
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
    "../../packages/ui/src/**/*.{js,ts,jsx,tsx}",
    "./index.html"
  ],
  // Most config is now handled in CSS via @theme
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-geist-sans)"],
        mono: ["var(--font-geist-mono)"],
      },
    },
  },
} satisfies Config;