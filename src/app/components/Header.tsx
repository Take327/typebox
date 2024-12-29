"use client";

import React from "react";
import { useMenu } from "../../context/MenuContext";

export default function Header() {
  const { toggleMenu } = useMenu();

  return (
    <header className="bg-[#f7e4c9] flex items-center p-4">
      {/* ハンバーガーメニュー (スマホ表示のみ) */}
      <button
        onClick={toggleMenu}
        className="sm:hidden text-black mr-4 absolute"
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
        <a href="#" className="hover:text-[#f6ceb4]">
          ホーム
        </a>
        <a href="#" className="hover:text-[#f6ceb4]">
          サービス
        </a>
        <a href="#" className="hover:text-[#f6ceb4]">
          お問い合わせ
        </a>
      </nav>
    </header>
  );
}
