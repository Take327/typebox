"use client";

import React, { createContext, useContext, useState } from "react";

/**
 * 処理中状態を管理するコンテキストの型定義
 */
type ProcessingContextType = {
  isProcessing: boolean; // 現在の処理中ステータス（true: 処理中, false: 非処理中）
  setProcessing: (value: boolean) => void; // 処理中状態を更新する関数
};

/**
 * 処理中状態を管理するコンテキストを作成
 */
const ProcessingContext = createContext<ProcessingContextType | undefined>(undefined);

/**
 * 処理中状態を管理するプロバイダーコンポーネント
 *
 * @param {React.ReactNode} children - コンテキストを適用する子コンポーネント
 * @returns {JSX.Element} - コンテキストプロバイダーをラップした要素
 */
export const ProcessingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isProcessing, setIsProcessing] = useState(false); // 処理中状態を管理するステート

  /**
   * 処理中状態を更新する関数
   *
   * @param {boolean} value - 設定する処理中ステータス
   */
  const setProcessing = (value: boolean) => {
    setIsProcessing(value);
  };

  return <ProcessingContext.Provider value={{ isProcessing, setProcessing }}>{children}</ProcessingContext.Provider>;
};

/**
 * 処理中状態を取得するためのカスタムフック
 *
 * @returns {ProcessingContextType} - `isProcessing`（処理中フラグ）と `setProcessing`（更新関数）を提供
 * @throws {Error} - `ProcessingProvider` の外で呼び出された場合はエラーをスロー
 */
export const useProcessing = (): ProcessingContextType => {
  const context = useContext(ProcessingContext);

  if (!context) {
    throw new Error("useProcessing must be used within a ProcessingProvider"); // コンテキストが提供されていない場合はエラー
  }

  return context;
};
