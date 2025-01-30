"use client";
/**
 * OAuth エラーページ
 * OAuth 認証エラーが発生した場合に表示されるページ
 */

import Link from "next/link";

export default function AuthErrorPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white shadow-lg rounded-lg p-6 max-w-md">
        <h1 className="text-2xl font-bold text-red-600">ログインエラー</h1>
        <div className="mt-6">
          <Link href="/login" className="text-blue-600 hover:underline">
            ログイン画面に戻る
          </Link>
        </div>
      </div>
    </div>
  );
}
