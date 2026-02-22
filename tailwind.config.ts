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
        potato: {
          light: "#FDFCF0",
          DEFAULT: "#8B4513", // Potato Brown
          dark: "#45220A",
        },
        sprout: {
          DEFAULT: "#ADFF00", // "Electric Sprout" green
          hover: "#99E600",
        },
        hyper: {
          DEFAULT: "#7B2CBF", // High-contrast violet
          hover: "#5A189A",
        }
      },
      boxShadow: {
        'brutal': '4px 4px 0px 0px rgba(0,0,0,1)',
        'brutal-sm': '2px 2px 0px 0px rgba(0,0,0,1)',
        'brutal-lg': '8px 8px 0px 0px rgba(0,0,0,1)',
      }
    },
  },
  plugins: [],
};
export default config;
