/**
 * @file layout.tsx
 * @description groups配下のページに共通するレイアウト
 */
"use client";

import React from "react";
import Backdrop from "../components/Backdrop";

/**
 * グループ関連ページのレイアウト
 * @param props.children ページコンテンツ
 */
export default function GroupsLayout({ children }: { children: React.ReactNode }): JSX.Element {
  return (
    <>
      <div className="container mx-auto py-8">{children}</div>
      <Backdrop />
    </>
  );
}
