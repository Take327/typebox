"use client";

import React from "react";
import { ProcessingProvider } from "../../../context/ProcessingContext";
import Backdrop from "../../components/Backdrop";
import DiagnosisPage from "./DiagnosisPage";

/**
 * 診断ページのルートコンポーネント。
 *
 * - `ProcessingProvider` をラップし、診断中の処理状態を管理
 * - `Backdrop` を追加し、処理中の視覚的なフィードバックを提供
 * - `DiagnosisPage` をレンダリング
 *
 * @returns {JSX.Element} 診断ページの JSX 要素
 */
const Page: React.FC = (): JSX.Element => {
  return (
    <ProcessingProvider>
      <Backdrop />
      <DiagnosisPage />
    </ProcessingProvider>
  );
};

export default Page;
