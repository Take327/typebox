"use client";

import React from "react";
import Image from "next/image";
import { signOut } from "next-auth/react";
import { useMenu } from "../../context/MenuContext";
import { PiSignOut } from "react-icons/pi";

export default function Header() {
  const { toggleMenu } = useMenu();

  const handleLogout = async () => {
    await signOut({ callbackUrl: "/login" }); // ログアウト後にログイン画面へリダイレクト
  };

  return (
    <header className="flex items-center justify-center bg-[#f7e4c9] p-4">
      {/* ヘッダーコンテンツを最大幅制限して中央揃え */}
      <div className="flex w-full max-w-screen-2xl items-center">
        {/* ハンバーガーメニュー (スマホ表示のみ) */}
        <button onClick={toggleMenu} className="mr-4 text-black sm:hidden" aria-label="メニューを開く">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            className="h-6 w-6"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        {/* ロゴ＆タイトル */}
        <div className="flex flex-1 items-center justify-center text-lg font-bold sm:justify-start">
          <Image
            src="/typebox_logo.svg"
            alt="ロゴ"
            width={32} // 画像幅
            height={32} // 画像高さ
            className="mr-2"
          />
          <span className="hidden sm:inline">TypeBox</span>
        </div>

        {/* ナビゲーション (PC表示のみ) */}
        <nav className="hidden space-x-4 sm:flex">
          <button
            onClick={handleLogout}
            className="flex items-center rounded bg-[#f3493a] px-4 py-2 text-white shadow transition-colors duration-300 hover:bg-[#d8362f]"
            aria-label="ログアウト"
          >
            <PiSignOut className="mr-2 h-5 w-5" />
            ログアウト
          </button>
        </nav>
      </div>
    </header>
  );
}
