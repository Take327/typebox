"use client";

import React from "react";
import { signOut } from "next-auth/react";
import { useMenu } from "../../context/MenuContext";
import { PiSignOut } from "react-icons/pi";

export default function Header() {
  const { toggleMenu } = useMenu();

  const handleLogout = async () => {
    await signOut({ callbackUrl: "/login" }); // ログアウト後にログイン画面へリダイレクト
  };

  return (
    <header className="bg-[#f7e4c9] flex items-center justify-center p-4">
      {/* ヘッダーコンテンツを最大幅制限して中央揃え */}
      <div className="w-full max-w-screen-2xl flex items-center">
        {/* ハンバーガーメニュー (スマホ表示のみ) */}
        <button
          onClick={toggleMenu}
          className="sm:hidden text-black mr-4"
          aria-label="メニューを開く"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>

        {/* ロゴ＆タイトル */}
        <div className="flex-1 flex items-center justify-center sm:justify-start font-bold text-lg">
          <img src="/typebox_logo.svg" alt="ロゴ" className="w-8 h-8 mr-2" />
          <span className="hidden sm:inline">TypeBox</span>
        </div>

        {/* ナビゲーション (PC表示のみ) */}
        <nav className="hidden sm:flex space-x-4">
          <button
            onClick={handleLogout}
            className="flex items-center px-4 py-2 bg-[#f3493a] text-white rounded shadow hover:bg-[#d8362f] transition-colors duration-300"
            aria-label="ログアウト"
          >
            <PiSignOut className="w-5 h-5 mr-2" />
            ログアウト
          </button>
        </nav>
      </div>
    </header>
  );
}
