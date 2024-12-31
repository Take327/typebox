'use client';

import { signIn } from "next-auth/react";
import { AiOutlineGithub, AiOutlineGoogle, AiOutlineWindows } from "react-icons/ai";

export default function LoginPage() {
  const handleSignIn = async (provider: string) => {
    try {
      await signIn(provider);
    } catch (error) {
      console.error("ログインエラー:", error);
      alert("ログインに失敗しました。再度お試しください。");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-6 text-center">ログイン</h1>
        <div className="space-y-4">
          {/* GitHubログイン */}
          <button
            className="flex items-center justify-center w-full py-2 text-white bg-gray-800 rounded hover:bg-gray-700 focus:ring-2 focus:ring-offset-2 focus:ring-gray-800"
            onClick={() => handleSignIn("github")}
            aria-label="GitHubでログイン"
          >
            <AiOutlineGithub className="w-5 h-5 mr-2" />
            <span className="font-semibold">GitHubでログイン</span>
          </button>

          {/* Googleログイン */}
          <button
            className="flex items-center justify-center w-full py-2 text-black bg-white border border-gray-300 rounded hover:bg-gray-100 focus:ring-2 focus:ring-offset-2 focus:ring-gray-400"
            onClick={() => handleSignIn("google")}
            aria-label="Googleでログイン"
          >
            <AiOutlineGoogle className="w-5 h-5 mr-2" />
            <span className="font-semibold">Googleでログイン</span>
          </button>

          {/* Microsoftログイン */}
          <button
            className="flex items-center justify-center w-full py-2 text-white bg-blue-600 rounded hover:bg-blue-700 focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            onClick={() => handleSignIn("azure-ad")}
            aria-label="Microsoftでログイン"
          >
            <AiOutlineWindows className="w-5 h-5 mr-2" />
            <span className="font-semibold">Microsoftでログイン</span>
          </button>
        </div>
      </div>
    </div>
  );
}
