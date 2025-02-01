/**
 * @file tailwind.config.ts
 * @description Tailwind + Flowbiteのカスタマイズ設定
 */

import flowbitePlugin from "flowbite/plugin";
import type { Config } from "tailwindcss";

const config: Config = {
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
        // マテリアルデザインのPrimaryカラーとして扱う薄いベージュ系（例：ヘッダーなど）
        primary: {
          50: "#f7e4c9", // ヘッダー用
          100: "#f7e4c9", // 必要に応じて追加
          200: "#f6ceb4", // フッター用
        },
        // ボタンやスイッチなど強調したい要素に用いるアクセントカラー
        accent: {
          DEFAULT: "#81d8d0",
          light: "#a3e5de", // ホバー時などに使用する例
          dark: "#5bc2ba", // アクティブ時などに使用する例
        },
        // 全体的な背景カラー
        background: "#f3f4f6",

        //タイプチャート
        pastelTeal: "#81D8D0",
        pastelPeach: "#F6CEB4",
        pastelPink: "#FAD4E0",
        pastelSky: "#CDE7F4",

        // 必要であれば単純にカラー名として定義しておき、ユーティリティクラスで使用することも可
        // "81d8d0": "#81d8d0",
        // "f6ceb4": "#f6ceb4",
        // "f7e4c9": "#f7e4c9",
      },
      // フォントや他の拡張設定があればここに追加
    },
  },
  plugins: [
    flowbitePlugin, // Flowbiteプラグイン
  ],
};

export default config;
