import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-ibm-plex-arabic)", "system-ui", "-apple-system", "sans-serif"],
        ibm: ["var(--font-ibm-plex-arabic)", "system-ui", "-apple-system", "sans-serif"],
      },
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        // Frozen Whisper Editorial Palette (Pale Snow, Clouded Steel, Icy Blue, Slate Mist, Charcoal Mist)
        frozen: {
          snowBright: "#f7f9fb",
          snowLight: "#eef1f4",
          snow: "#d5dbe2",
          steel: "#b3bfcb",
          steelLight: "#c8d2dc",
          ice: "#778ca4",
          iceLight: "#8ea2b8",
          slate: "#4f6271",
          slateLight: "#5f7587",
          charcoal: "#313c45",
          charcoalDark: "#232b32",
        },
        // Dynamic Dual-Theme Palettes (Original Midnight Navy vs Landing Page Frozen Whisper):
        arctic: {
          950: 'rgb(var(--canvas-bg-rgb) / <alpha-value>)',
          900: 'rgb(var(--surface-bg-rgb) / <alpha-value>)',
          850: 'rgb(var(--surface-elevated-rgb) / <alpha-value>)',
          800: 'rgb(var(--border-color-rgb) / <alpha-value>)',
          700: 'rgb(var(--accent-mid-rgb) / <alpha-value>)',
          600: 'rgb(var(--text-muted-rgb) / <alpha-value>)',
          400: 'rgb(var(--text-secondary-rgb) / <alpha-value>)',
          100: 'rgb(var(--text-primary-rgb) / <alpha-value>)',
        },
        slateNavy: {
          950: 'rgb(var(--canvas-bg-rgb) / <alpha-value>)',
          900: 'rgb(var(--surface-bg-rgb) / <alpha-value>)',
          850: 'rgb(var(--surface-elevated-rgb) / <alpha-value>)',
          800: 'rgb(var(--border-color-rgb) / <alpha-value>)',
          750: 'rgb(var(--accent-mid-rgb) / <alpha-value>)',
          700: 'rgb(var(--accent-mid-rgb) / <alpha-value>)',
          600: 'rgb(var(--text-muted-rgb) / <alpha-value>)',
          500: 'rgb(var(--text-muted-rgb) / <alpha-value>)',
          400: 'rgb(var(--text-secondary-rgb) / <alpha-value>)',
          300: 'rgb(var(--text-secondary-rgb) / <alpha-value>)',
          200: 'rgb(var(--text-primary-rgb) / <alpha-value>)',
          100: 'rgb(var(--text-primary-rgb) / <alpha-value>)',
        },
      },
    },
  },
  plugins: [],
};
export default config;
