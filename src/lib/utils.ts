import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * クラス名を統合し、重複する Tailwind CSS のクラスを最適化する関数。
 *
 * @param {ClassValue[]} inputs - 追加するクラス名の配列。文字列、オブジェクト、配列などが含まれる。
 * @returns {string} 最適化されたクラス名の文字列。
 *
 * @example
 * ```ts
 * cn("text-lg", "font-bold", "text-red-500"); // "text-lg font-bold text-red-500"
 * cn("px-4", "py-2", { "bg-blue-500": true, "bg-red-500": false }); // "px-4 py-2 bg-blue-500"
 * ```
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
