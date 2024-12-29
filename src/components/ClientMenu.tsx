"use client";

import { useState } from "react";

export default function ClientHeader() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <header className="bg-gray-800 text-white">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        {/* サイト名 */}
        <h1 className="text-lg font-bold">My App</h1>

        {/* ナビゲーション: デスクトップ表示用 */}
        <nav className="hidden md:flex space-x-6">
          <a href="#home" className="hover:text-gray-300">
            ホーム
          </a>
          <a href="#about" className="hover:text-gray-300">
            サービス
          </a>
          <a href="#contact" className="hover:text-gray-300">
            お問い合わせ
          </a>
        </nav>

        {/* ハンバーガーメニュー: モバイル表示用 */}
        <button
          className="md:hidden"
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        >
          <span className="material-icons">menu</span>
        </button>
      </div>

      {/* サイドバー */}
      {isSidebarOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50">
          <div className="fixed top-0 right-0 w-64 h-full bg-gray-900 text-white shadow-lg">
            <button
              className="absolute top-4 right-4"
              onClick={() => setIsSidebarOpen(false)}
            >
              <span className="material-icons">close</span>
            </button>
            <nav className="mt-10 space-y-6">
              <a href="#home" className="block px-4 py-2 hover:bg-gray-700">
                ホーム
              </a>
              <a href="#about" className="block px-4 py-2 hover:bg-gray-700">
                サービス
              </a>
              <a href="#contact" className="block px-4 py-2 hover:bg-gray-700">
                お問い合わせ
              </a>
            </nav>
          </div>
        </div>
      )}
    </header>
  );
}
