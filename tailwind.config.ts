import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/flowbite/**/*.js", // Flowbiteのコンポーネントパス
  ],
  theme: {
    extend: {
      colors: {
        primary: '#3498db', // ログインボタンの色
        secondary: '#2ecc71',
      },
    },
  },
  plugins: [
    require('flowbite/plugin'), // Flowbiteのプラグインのみ残す
  ],
} satisfies Config;
