"use client";

import React from "react";
import { GroupsMockProvider } from "./GroupsMockProvider";

/**
 * groups配下のレイアウト
 * @param {React.PropsWithChildren} props - 子要素
 * @returns {JSX.Element} - レイアウト
 */
export default function GroupsLayout({ children }: { children: React.ReactNode }): JSX.Element {
  return (
    <GroupsMockProvider>
      <div className="p-4 bg-gray-100 min-h-screen">
        <h1 className="text-2xl font-bold mb-6">グループ管理</h1>
        {children}
      </div>
    </GroupsMockProvider>
  );
}
