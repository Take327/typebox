/**
 * OAuth エラーページ
 * OAuth 認証エラーが発生した場合に表示されるページ
 */

import { useSearchParams } from "next/navigation";
import Link from "next/link";

export default function AuthErrorPage() {
  const searchParams = useSearchParams();
  const errorType = searchParams.get("error");

  const errorMessages: Record<string, string> = {
    OAuthCallback: "認証プロバイダからの応答に問題が発生しました。",
    Configuration: "認証設定に問題があります。",
    AccessDenied: "アクセスが拒否されました。",
    Default: "認証時にエラーが発生しました。",
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white shadow-lg rounded-lg p-6 max-w-md">
        <h1 className="text-2xl font-bold text-red-600">ログインエラー</h1>
        <p className="mt-4 text-gray-700">
          {errorMessages[errorType as keyof typeof errorMessages] || errorMessages.Default}
        </p>
        <div className="mt-6">
          <Link href="/login" className="text-blue-600 hover:underline">
            ログイン画面に戻る
          </Link>
        </div>
      </div>
    </div>
  );
}
