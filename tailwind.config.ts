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
