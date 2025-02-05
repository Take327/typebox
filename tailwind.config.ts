/**
 * @file tailwind.config.ts
 * @description Tailwind + Flowbiteのカスタマイズ設定
 */

import flowbitePlugin from "flowbite/plugin";
import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    // Flowbiteのコンポーネントもツリーシェイキングの対象にする
    "./node_modules/flowbite/**/*.js",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          "50": "#f7e4c9",
          "100": "#f7e4c9",
          "200": "#f6ceb4",
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        accent: {
          DEFAULT: "#81d8d0",
          light: "#a3e5de", // ホバー時などに使用する例
          dark: "#5bc2ba", // アクティブ時などに使用する例
          foreground: "hsl(var(--accent-foreground))",
        },
        // 全体的な背景カラー
        background: "#f3f4f6",

        //タイプチャート
        pastelTeal: "#81D8D0",
        pastelPeach: "#F6CEB4",
        pastelPink: "#FAD4E0",
        pastelSky: "#CDE7F4",
        foreground: "hsl(var(--foreground))",
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        chart: {
          "1": "hsl(var(--chart-1))",
          "2": "hsl(var(--chart-2))",
          "3": "hsl(var(--chart-3))",
          "4": "hsl(var(--chart-4))",
          "5": "hsl(var(--chart-5))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
    },
  },
  plugins: [
    flowbitePlugin, // Flowbiteプラグイン
    require("tailwindcss-animate"),
  ],
};

export default config;
