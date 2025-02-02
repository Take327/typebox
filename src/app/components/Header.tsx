"use client";

import React from "react";
import Image from "next/image";
import { signOut } from "next-auth/react";
import { PiSignOut } from "react-icons/pi";

export default function Header() {
  const handleLogout = async () => {
    await signOut({ callbackUrl: "/login" }); // ログアウト後にログイン画面へリダイレクト
  };

  return (
    <header className="relative flex items-center bg-[#f7e4c9] p-4">
      {/* ロゴ（常に中央に固定） */}
      <div className="absolute left-1/2 -translate-x-1/2 flex items-center">
        <Image src="/typebox_logo.svg" alt="ロゴ" width={32} height={32} className="mr-2" />
        <span className="hidden sm:inline font-bold">TypeBox</span>
      </div>

      {/* ログアウトボタン（右端に配置） */}
      <nav className="ml-auto">
        <button
          onClick={handleLogout}
          className="flex items-center rounded bg-[#f3493a] px-2 py-2 text-white shadow transition-colors duration-300 hover:bg-[#d8362f]"
          aria-label="ログアウト"
        >
          {/* アイコンは常に表示 */}
          <PiSignOut className="sm:mr-2 h-5 w-5" />

          {/* テキストはモバイル時に非表示、PC(sm)以上で表示 */}
          <span className="hidden sm:inline-block">ログアウト</span>
        </button>
      </nav>
    </header>
  );
}
