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
        // Existing Dashboard Palettes:
        arctic: {
          950: '#06141B',
          900: '#11212D',
          850: '#1a2d3d',
          800: '#253745',
          700: '#4A5C6A',
          600: '#4A5C6A',
          400: '#9BA8AB',
          100: '#CCD0CF',
        },
        slateNavy: {
          950: '#06141B',
          900: '#11212D',
          850: '#1a2d3d',
          800: '#253745',
          750: '#344755',
          700: '#4A5C6A',
          600: '#4A5C6A',
          500: '#718491',
          400: '#9BA8AB',
          300: '#B0BCBE',
          200: '#CCD0CF',
          100: '#CCD0CF',
        },
      },
    },
  },
  plugins: [],
};
export default config;
