import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        // This makes 'Inter' the default sans-serif font
        sans: ['var(--font-inter)'], 
        // This creates a new utility class 'font-display' for Poppins
        display: ['var(--font-poppins)'], 
      },
      // You can add your custom colors from the style guide here
      colors: {
        indigo: {
          '100': '#E0E7FF',
          '600': '#4F46E5',
          '700': '#4338CA',
        },
        emerald: {
          '500': '#10B981',
        },
        rose: {
          '500': '#F43F5E', // Note: Your guide had EF4444, but F43F5E is the standard Rose 500
        },
        amber: {
          '400': '#FBBF24',
        }
      }
    },
  },
  plugins: [],
};
export default config;
