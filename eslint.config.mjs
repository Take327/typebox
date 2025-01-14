import typescriptEslintPlugin from "@typescript-eslint/eslint-plugin"; // TypeScriptプラグイン
import parser from "@typescript-eslint/parser"; // TypeScriptパーサー
import prettierPlugin from "eslint-plugin-prettier"; // Prettierプラグイン
import tailwindcssPlugin from "eslint-plugin-tailwindcss"; // TailwindCSSプラグイン
import { dirname } from "path";
import { fileURLToPath } from "url";

// __filename と __dirname の設定
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// ESLint の設定
const eslintConfig = [
  {
    files: ["**/*.{js,ts,jsx,tsx}"], // 対象ファイル
    languageOptions: {
      parser: parser, // TypeScript用のパーサー
      parserOptions: {
        ecmaVersion: 2021,
        sourceType: "module",
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    plugins: {
      tailwindcss: tailwindcssPlugin,
      prettier: prettierPlugin,
      "@typescript-eslint": typescriptEslintPlugin, // 修正箇所
    },
    rules: {
      "prettier/prettier": "error", // PrettierのエラーをESLintで表示
      "tailwindcss/classnames-order": "warn", // TailwindCSSクラス名の順序
      "@typescript-eslint/no-unused-vars": "warn", // 未使用変数の警告
      "@typescript-eslint/no-explicit-any": "warn", // `any` の使用に警告
      "@typescript-eslint/no-unsafe-function-type": "warn", // 安全でない関数型の警告
    },
    settings: {
      react: {
        version: "detect", // Reactバージョンを自動検出
      },
    },
  },
];

export default eslintConfig;
