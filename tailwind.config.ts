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
      },
    },
  },
  plugins: [],
};
export default config;
