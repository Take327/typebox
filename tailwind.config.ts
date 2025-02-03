/**
 * @file tailwind.config.ts
 * @description Tailwind + Flowbite + shadcn/ui のカスタマイズ設定
 */

import flowbitePlugin from "flowbite/plugin";
import type { Config } from "tailwindcss";
import preset from "./tailwind-preset"; // 追加したプリセットを適用

const config: Config = {
  darkMode: ["class"],
  presets: [preset], // shadcn/ui のプリセット適用
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/flowbite/**/*.js",
    "./node_modules/@shadcn/ui/**/*.js", // shadcn/ui のコンポーネントも対象にする
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: "#f7e4c9",
          100: "#f7e4c9",
          200: "#f6ceb4",
        },
        accent: {
          DEFAULT: "#81d8d0",
          light: "#a3e5de",
          dark: "#5bc2ba",
        },
        background: "#f3f4f6",
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        foreground: "hsl(var(--foreground))", // ← 追加

        pastelTeal: "#81D8D0",
        pastelPeach: "#F6CEB4",
        pastelPink: "#FAD4E0",
        pastelSky: "#CDE7F4",
      },
    },
  },
  plugins: [flowbitePlugin, require("tailwindcss-animate")],
};

export default config;
