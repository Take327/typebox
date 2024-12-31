'use client';

import { signIn } from "next-auth/react";

export default function LoginPage() {
  return (
    <div className="flex flex-col items-center min-h-screen bg-primary">
      <h1 className="text-2xl font-bold mb-6">ログイン</h1>
      <div className="space-y-4">
        <button
          className="w-64 py-2 text-white bg-black rounded hover:opacity-90"
          onClick={() => signIn("github")}
        >
          GitHubでログイン
        </button>
        <button
          className="w-64 py-2 text-black bg-white border border-gray-300 rounded hover:bg-gray-100"
          onClick={() => signIn("google")}
        >
          Googleでログイン
        </button>
        <button
          className="w-64 py-2 text-white bg-secondary rounded hover:opacity-90"
          onClick={() => signIn("azure-ad")}
        >
          Microsoftでログイン
        </button>
      </div>
    </div>
  );
}
