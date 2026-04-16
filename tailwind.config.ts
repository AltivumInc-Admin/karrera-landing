import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: "#0f1729",
        teal: {
          DEFAULT: "#0d9488",
          light: "#ccfbf1",
          hover: "#0a7a70",
        },
      },
      fontFamily: {
        display: ["Cabinet Grotesk", "Inter", "sans-serif"],
        body: ["Satoshi", "Inter", "sans-serif"],
        mono: ["JetBrains Mono", "Courier New", "monospace"],
      },
    },
  },
  plugins: [],
};

export default config;
