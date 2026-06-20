import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        // インク(濃紺): テキスト・構造の主色。信頼感・清潔感。
        ink: {
          50: "#f3f5f9",
          100: "#e4e8f0",
          200: "#c7d0e0",
          300: "#9fadc8",
          400: "#6f82a8",
          500: "#4d618c",
          600: "#384c73",
          700: "#2b3c5d",
          800: "#1f2d49",
          900: "#16203a",
          950: "#0d1426",
        },
        // NAORUブランドのコーラル: アクセント・CTA・ハート。親しみやすさ。
        brand: {
          50: "#fef3f0",
          100: "#fde4dc",
          200: "#fbcbbd",
          300: "#f7a692",
          400: "#f17a5e",
          500: "#ea5532",
          600: "#d63e1c",
          700: "#b33017",
          800: "#942b18",
          900: "#7b291a",
        },
        // 温かみのあるクリーム(背景)。高級感・落ち着き。
        cream: {
          50: "#fdfbf8",
          100: "#faf7f1",
          200: "#f3ede2",
        },
        // 難易度の星などに使う上品なゴールド。
        gold: {
          400: "#e0b34d",
          500: "#cf9a2f",
        },
        // 後方互換(旧navy参照用)
        navy: {
          50: "#f3f5f9",
          100: "#e4e8f0",
          200: "#c7d0e0",
          600: "#384c73",
          700: "#2b3c5d",
          800: "#1f2d49",
          900: "#16203a",
        },
        accent: {
          50: "#fef3f0",
          100: "#fde4dc",
          500: "#ea5532",
          600: "#d63e1c",
          700: "#b33017",
        },
      },
      fontFamily: {
        // 本文: 清潔感のあるゴシック
        sans: [
          "-apple-system",
          "BlinkMacSystemFont",
          "Hiragino Kaku Gothic ProN",
          "Hiragino Sans",
          "Noto Sans JP",
          "Meiryo",
          "sans-serif",
        ],
        // 見出し: 上品で信頼感のある明朝
        serif: [
          "Hiragino Mincho ProN",
          "Hiragino Mincho Pro",
          "YuMincho",
          "Yu Mincho",
          "Noto Serif JP",
          "Shippori Mincho",
          "serif",
        ],
      },
      boxShadow: {
        soft: "0 1px 2px rgba(22,32,58,0.04), 0 8px 24px -12px rgba(22,32,58,0.12)",
        lift: "0 4px 12px rgba(22,32,58,0.06), 0 18px 40px -16px rgba(22,32,58,0.20)",
      },
      letterSpacing: {
        wider2: "0.12em",
      },
    },
  },
  plugins: [],
};

export default config;
