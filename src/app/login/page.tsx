"use client"; // 全体をクライアントサイドで動作させる
import Image from "next/image";
import { signIn } from "next-auth/react";
import { AiOutlineGithub } from "react-icons/ai";
import GoogleIcon from "../components/icons/GoogleIcon";
import MicrosoftIcon from "../components/icons/MicrosoftIcon";
import AuthButton from "../components/AuthButton";

export default function LoginPage() {
  const handleSignIn = async (provider: string) => {
    try {
      await signIn(provider, { callbackUrl: "/" });
    } catch (error) {
      console.error("ログインエラー:", error);
      alert("ログインに失敗しました。再度お試しください。");
    }
  };

  return (
    <div className="flex flex-col items-center pt-16">
      <div className="flex items-center mb-6">
        <Image
          src="/typebox_logo.svg"
          alt="ロゴ"
          width={32} // 画像幅
          height={32} // 画像高さ
          className="mr-2"
        />
        <h1 className="text-center text-2xl font-bold">TypeBox</h1>
      </div>
      <div className="mx-6 w-9/12 max-w-md rounded-lg bg-white p-6 shadow-md">
        <h1 className="mb-6 text-center text-2xl font-bold">ログイン</h1>
        <div className="space-y-4">
          <AuthButton
            onClick={() => handleSignIn("github")}
            bgColor="bg-gray-800"
            hoverColor="hover:bg-gray-700"
            ringColor="focus:ring-gray-800"
            icon={<AiOutlineGithub className="h-5 w-5" />}
            label="Sign in with GitHub"
          />
          <AuthButton
            onClick={() => handleSignIn("google")}
            bgColor="bg-white"
            hoverColor="hover:bg-gray-50"
            ringColor="focus:ring-gray-400"
            textColor="text-gray-700"
            borderColor="border border-gray-300"
            icon={<GoogleIcon />}
            label="Sign in with Google"
          />
          <AuthButton
            onClick={() => handleSignIn("azure-ad")}
            bgColor="bg-white"
            hoverColor="hover:bg-gray-50"
            ringColor="focus:ring-gray-400"
            textColor="text-gray-700"
            borderColor="border border-gray-300"
            icon={<MicrosoftIcon />}
            label="Sign in with Microsoft"
          />
        </div>
      </div>
    </div>
  );
}
