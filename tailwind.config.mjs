// @ts-expect-error daisyui does not provide TypeScript declarations.
import daisyui from "daisyui";

/** @type {import('tailwindcss').Config} */
const config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [daisyui],
  daisyui: {
    themes: ["light", "dark"], // Theme Toggling Challenge এর জন্য
  },
};

export default config;