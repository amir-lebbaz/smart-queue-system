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
        // #08131F (Deepest midnight canvas)
        // #16314A (Marine container background)
        // #2E4F6B (Sea slate borders & accents)
        // #5F7F98 (Misty steel blue subtitles & icons)
        // #A9BDC9 (Crisp horizon blue body text)
        // #E8EFF3 (Glacial white-blue headings & prominent text)
        arctic: {
          950: '#08131F',
          900: '#16314A',
          800: '#2E4F6B',
          700: '#3D6282',
          600: '#5F7F98',
          400: '#A9BDC9',
          100: '#E8EFF3',
        },
        slateNavy: {
          950: '#08131F',
          900: '#16314A',
          850: '#1c3d5a',
          800: '#2E4F6B',
          750: '#385b79',
          700: '#3D6282',
          600: '#5F7F98',
          400: '#A9BDC9',
          300: '#C2D1DB',
          200: '#D6E2E8',
          100: '#E8EFF3',
        },
      },
    },
  },
  plugins: [],
};
export default config;
