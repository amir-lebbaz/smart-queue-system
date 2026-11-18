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
        // Exact "Arctic Harbor" palette:
        // Restored Signature Master Palette from User Specification:
        // #06141B (Deepest midnight canvas)
        // #11212D (Marine container background)
        // #253745 (Sea slate borders & accents)
        // #4A5C6A (Misty steel blue subtitles & icons)
        // #9BA8AB (Crisp horizon blue body text)
        // #CCD0CF (Glacial white-blue headings & prominent text)
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
