import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // ブランドカラー: 白 / ネイビー / アクセントグリーン
        navy: {
          50: "#eef2f7",
          100: "#dbe3ef",
          200: "#b7c6df",
          300: "#8ca4ca",
          400: "#5d7bb0",
          500: "#3f5d97",
          600: "#2f487a",
          700: "#243a63",
          800: "#1c2d4d",
          900: "#16243d",
          950: "#0d1626",
        },
        accent: {
          50: "#ecfdf3",
          100: "#d1fadf",
          200: "#a6f4c5",
          300: "#6ce9a6",
          400: "#32d583",
          500: "#12b76a",
          600: "#039855",
          700: "#027a48",
          800: "#05603a",
          900: "#054f31",
        },
      },
      fontFamily: {
        sans: [
          "-apple-system",
          "BlinkMacSystemFont",
          "Hiragino Kaku Gothic ProN",
          "Hiragino Sans",
          "Noto Sans JP",
          "Meiryo",
          "sans-serif",
        ],
      },
    },
  },
  plugins: [],
};

export default config;
