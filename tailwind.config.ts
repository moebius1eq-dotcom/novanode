import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Vibe colors
        vibe: {
          focus: "#22C55E",
          social: "#F97316",
          quiet: "#3B82F6",
          lively: "#EAB308",
        },
        // Neighborhood accent colors
        nova: {
          arlington: "#4F46E5",
          alexandria: "#0891B2",
          tysons: "#7C3AED",
          reston: "#059669",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
