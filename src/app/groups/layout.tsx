/**
 * @file layout.tsx
 * @description groups配下のページに共通するレイアウト
 */
"use client";

import React from "react";

/**
 * グループ関連ページのレイアウト
 * @param props.children ページコンテンツ
 */
export default function GroupsLayout({ children }: { children: React.ReactNode }): JSX.Element {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">グループ管理</h1>
      {children}
    </div>
  );
}
