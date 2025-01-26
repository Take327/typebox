import typescriptEslintPlugin from "@typescript-eslint/eslint-plugin";
import parser from "@typescript-eslint/parser";
import prettierPlugin from "eslint-plugin-prettier";
import tailwindcssPlugin from "eslint-plugin-tailwindcss";
import { FlatCompat } from "@eslint/eslintrc";
import { dirname } from "path";
import { fileURLToPath } from "url";

// __filename と __dirname の設定
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Flat Config と .eslintrc の互換性設定
const compat = new FlatCompat({
  baseDirectory: __dirname, // プロジェクトのベースディレクトリを指定
  recommendedConfig: {
    eslintRecommended: true, // ESLint推奨設定を使用
  },
});

// ESLint の設定
export default [
  ...compat.extends("eslint:recommended"), // 推奨ルール
  ...compat.extends("plugin:@typescript-eslint/recommended"), // TypeScript推奨ルール
  ...compat.extends("plugin:tailwindcss/recommended"), // TailwindCSS推奨ルール
  ...compat.extends("plugin:prettier/recommended"), // Prettier推奨ルール
  ...compat.extends("plugin:next/core-web-vitals"), // Next.js推奨ルール

  {
    files: ["**/*.{js,ts,jsx,tsx}"], // 対象ファイル
    languageOptions: {
      parser: parser, // TypeScript用のパーサー
      parserOptions: {
        ecmaVersion: "latest", // 最新のECMAScriptを使用
        sourceType: "module",
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    plugins: {
      tailwindcss: tailwindcssPlugin,
      prettier: prettierPlugin,
      "@typescript-eslint": typescriptEslintPlugin,
    },
    rules: {
      "prettier/prettier": "error", // PrettierのエラーをESLintで表示
      "tailwindcss/classnames-order": "error", // TailwindCSSクラス名の順序をエラーに
      "@typescript-eslint/no-unused-vars": "warn", // 未使用変数の警告
      "@typescript-eslint/no-explicit-any": "error", // `any` の使用を禁止
      "@typescript-eslint/no-unsafe-function-type": "warn", // 安全でない関数型の警告
      "@typescript-eslint/no-non-null-assertion": "warn", // 非nullアサーションの警告
    },
    settings: {
      react: {
        version: "detect", // Reactバージョンを自動検出
      },
    },
  },
];
