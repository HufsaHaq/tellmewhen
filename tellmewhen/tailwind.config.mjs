/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/**/*.{jsx,js,tsx,mdx}",
    "./components/*.{jsx,js,tsx,mdx}",
    "./components/**/*.{jsx,js,tsx,mdx}",
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    screens: {
      "tablet500": "500px",
      "tablet1080": "1080px",
      "tablet620": "620px"
    },
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
      fontFamily: {
        "bebas-neue": ["Bebas Neue", "sans-serif"],
      },
    },
  },
  plugins: [],
};
