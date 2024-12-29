"use client";

import { useMenu } from "@/context/MenuContext";

export default function SideMenu() {
  const { isOpen, toggleMenu } = useMenu();

  return (
    <>
      {/* グレー背景オーバーレイ */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-[59]"
          onClick={toggleMenu}
        ></div>
      )}

      {/* サイドバー */}
      <div
        id="hs-offcanvas-example"
        className={`fixed top-0 start-0 bottom-0 z-[60] w-64 bg-white border-e border-gray-200 pt-7 pb-10 overflow-y-auto transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
        role="dialog"
        tabIndex={-1}
        aria-label="Sidebar"
      >
        <div className="px-6">
          <a
            className="flex-none font-semibold text-xl text-black focus:outline-none focus:opacity-80"
            href="#"
            aria-label="Brand"
          >
            Menu
          </a>
        </div>
        <nav
          className="hs-accordion-group p-6 w-full flex flex-col flex-wrap"
          data-hs-accordion-always-open
        >
          <ul className="space-y-1.5">
            <li>
              <a
                className="flex items-center gap-x-3.5 py-2 px-2.5 bg-gray-100 text-sm text-gray-700 rounded-lg hover:bg-gray-100"
                href="#"
              >
                <svg
                  className="w-6 h-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                  <polyline points="9 22 9 12 15 12 15 22" />
                </svg>
                Dashboard
              </a>
            </li>
            <li>
              <a
                className="flex items-center gap-x-3.5 py-2 px-2.5 text-sm text-gray-700 rounded-lg hover:bg-gray-100"
                href="#"
              >
                Users
              </a>
            </li>
            <li>
              <a
                className="flex items-center gap-x-3.5 py-2 px-2.5 text-sm text-gray-700 rounded-lg hover:bg-gray-100"
                href="#"
              >
                Projects
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </>
  );
}
