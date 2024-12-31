'use client'; // この宣言を追加

import { signIn } from "next-auth/react";

export default function LoginPage() {
  return (
    <div>
      <h1>ログイン</h1>
      <button onClick={() => signIn("github")}>GitHubでログイン</button>
      <button onClick={() => signIn("google")}>Googleでログイン</button>
      <button onClick={() => signIn("azure-ad")}>Microsoftでログイン</button>
    </div>
  );
}
