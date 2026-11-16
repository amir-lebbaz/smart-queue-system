import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        // Custom palette extracted from user design image
        slateNavy: {
          950: '#06141B', // Deepest background
          900: '#11212D', // Card container background
          800: '#253745', // Borders, input backgrounds, secondary surfaces
          700: '#4A5C6A', // Muted accents, soft borders, subtle buttons
          400: '#9BA8AB', // Secondary text, icons, metadata
          100: '#CCD0CF', // Primary text, prominent typography
        },
      },
    },
  },
  plugins: [],
};
export default config;
