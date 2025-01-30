"use client";

import { SessionProvider } from "next-auth/react";
import React from "react";
import { ProcessingProvider } from "../context/ProcessingContext";
import Backdrop from "./components/Backdrop";
import MyPage from "./mypage/MyPage";

/**
 * アプリケーション全体をラップするコンポーネント。
 *
 * このコンポーネントは、以下のプロバイダーを提供します：
 * - セッション管理（`SessionProvider`）
 * - 処理状態管理（`ProcessingProvider`）
 *
 * また、共通のバックドロップと `MyPage` コンポーネントをレンダリングします。
 *
 * @returns {JSX.Element} アプリケーションのラップされたコンポーネント。
 */
const PageWrapper: React.FC = (): React.JSX.Element => {
  return (
    <SessionProvider>
      <ProcessingProvider>
        <Backdrop />
        <MyPage />
      </ProcessingProvider>
    </SessionProvider>
  );
};

export default PageWrapper;
