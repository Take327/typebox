"use client";

import React from "react";
import Backdrop from "./components/Backdrop";
import MyPage from "./mypage/MyPage";

/**
 * アプリケーション全体をラップするコンポーネント。
 *
 * このコンポーネントは、以下のプロバイダーを提供します：
 * - 処理状態管理（`ProcessingProvider`）
 *
 * また、共通のバックドロップと `MyPage` コンポーネントをレンダリングします。
 *
 * @returns {JSX.Element} アプリケーションのラップされたコンポーネント。
 */
const PageWrapper: React.FC = (): React.JSX.Element => {
  return (
    <>
      <Backdrop />
      <MyPage />
    </>
  );
};

export default PageWrapper;
