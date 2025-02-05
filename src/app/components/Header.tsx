"use client";

import React from "react";
import Image from "next/image";
import FlowbitAvatar from "../components/Flowbit/FlowbitAvatar";
import { usePathname } from "next/navigation";

export default function Header() {
  const pathname = usePathname();

  // ログインページかどうかを判定
  const isLoginPage = pathname === "/login";

  if (isLoginPage) {
    return null;
  }
  return (
    <header className="relative flex items-center bg-[#f7e4c9] p-4">
      {/* ロゴ（常に中央に固定） */}
      <div className="absolute left-1/2 -translate-x-1/2 flex items-center">
        <Image src="/typebox_logo.svg" alt="ロゴ" width={32} height={32} className="mr-2" />
        <span className="hidden sm:inline font-bold">TypeBox</span>
      </div>

      {/* 右端のアイコン・ログアウトボタン */}
      <nav className="ml-auto flex items-center space-x-4">
        <FlowbitAvatar />
      </nav>
    </header>
  );
}
