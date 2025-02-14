"use client";

import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import FlowbitAvatar from "../components/Flowbit/FlowbitAvatar";

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();

  // ログインページかどうかを判定
  const isLoginPage = pathname === "/login";

  if (isLoginPage) {
    return null;
  }

  return (
    <header className="relative flex items-center bg-primary-50 p-4">
      {/* ロゴ（常に中央に固定） */}
      <div
        className="absolute left-1/2 -translate-x-1/2 flex items-center cursor-pointer"
        onClick={() => router.push("/")}
      >
        <Image src="/typebox_logo.svg" alt="ロゴ" width={32} height={32} className="mr-2" />
        <span className="hidden sm:inline font-bold">TypeBox</span>
      </div>

      {/* 右端のアイコン・ログアウトボタン */}
      <nav className="ml-auto flex items-center space-x-4 mr-2">
        <FlowbitAvatar />
      </nav>
    </header>
  );
}
