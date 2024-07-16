import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      colors: {
        background: {
          DEFAULT: '#1B1F3B', // Midnight Blue
          coal: '#121212',

        },
        button: {
          primary: '#FFBF00', // Amber
          secondary: '#008080', // Teal
          base: '#1f2937 '
        },
        text: {
          DEFAULT: '#B0B0B0', // Medium Gray
        },
        border: {
          DEFAULT: '#E0E0E0', // Light Gray
        },
        accent: {
          cyan: '#00FFFF', // Cyan
          limeGreen: '#32CD32', // Lime Green
        },
      },
    },
  },
  plugins: [],
};
export default config;
