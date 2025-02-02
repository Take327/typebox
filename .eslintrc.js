/** @type {import('eslint').Linter.Config} */
module.exports = {
  root: true,
  extends: ["next/core-web-vitals", "prettier"],
  plugins: ["tailwindcss", "@typescript-eslint"],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
    ecmaFeatures: { jsx: true },
  },
  rules: {
    // Tailwind CSS クラスの順序チェックを一時的に無効化
    "tailwindcss/classnames-order": "off",

    // 非 null アサーション（`!`）の警告を無効化
    "@typescript-eslint/no-non-null-assertion": "off",

    // `any` 型の使用を許可（最適な型を設定するまでの一時措置）
    "@typescript-eslint/no-explicit-any": "off",

    // 未使用の変数警告を無視（使わない変数を整理するまでは一時的に無効化）
    "@typescript-eslint/no-unused-vars": "off",

    // React Hooks の依存配列チェックを無効化（適切な対応が終わるまで）
    "react-hooks/exhaustive-deps": "off",

    // Next.js で `<a>` タグを直接使う警告を無効化（最適な方法を決めるまで）
    "@next/next/no-html-link-for-pages": "off",
  },
  settings: {
    react: { version: "detect" },
  },
};
