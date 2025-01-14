"use client";

import Link from "next/link";
import { useMenu } from "../../context/MenuContext";

export default function SideMenu() {
  const { isOpen, toggleMenu } = useMenu();

  return (
    <>
      {/* グレー背景オーバーレイ */}
      {isOpen && <div className="fixed inset-0 z-[59] bg-black bg-opacity-50" onClick={toggleMenu}></div>}

      {/* サイドバー */}
      <div
        id="hs-offcanvas-example"
        className={`fixed bottom-0 start-0 top-0 z-[60] w-64 overflow-y-auto border-e border-gray-200 bg-white pb-10 pt-7 transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
        role="dialog"
        tabIndex={-1}
        aria-label="Sidebar"
      >
        <div className="px-6">
          <span className="flex-none text-xl font-semibold text-black focus:opacity-80 focus:outline-none">
            メニュー
          </span>
        </div>
        <nav className="hs-accordion-group flex w-full flex-col flex-wrap p-6" data-hs-accordion-always-open>
          <ul className="space-y-1.5">
            <li>
              <Link
                href="/"
                className="flex items-center gap-x-3.5 rounded-lg bg-gray-100 px-2.5 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                <svg
                  className="h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                  <polyline points="9 22 9 12 15 12 15 22" />
                </svg>
                マイページ
              </Link>
            </li>
            <li>
              <Link
                href="/diagnosis/start"
                className="flex items-center gap-x-3.5 rounded-lg px-2.5 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                診断を開始
              </Link>
            </li>
            <li>
              <Link
                href="/notifications"
                className="flex items-center gap-x-3.5 rounded-lg px-2.5 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                通知
              </Link>
            </li>
            <li>
              <Link
                href="/groups"
                className="flex items-center gap-x-3.5 rounded-lg px-2.5 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                グループ管理
              </Link>
            </li>
            <li>
              <Link
                href="/profile"
                className="flex items-center gap-x-3.5 rounded-lg px-2.5 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                プロフィール
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </>
  );
}
