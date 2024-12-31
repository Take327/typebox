"use client";

import { signIn } from "next-auth/react";
import { AiOutlineGithub } from "react-icons/ai";
import GoogleIcon from "../components/icons/GoogleIcon";
import MicrosoftIcon from "../components/icons/MicrosoftIcon";

export default function LoginPage() {
  const handleSignIn = async (provider: string) => {
    try {
      await signIn(provider,{ callbackUrl: "/" });
    } catch (error) {
      console.error("ログインエラー:", error);
      alert("ログインに失敗しました。再度お試しください。");
    }
  };

  return (
    <div className="flex flex-col items-center pt-16">
      <div className="flex">
        <img src="/typebox_logo.svg" alt="ロゴ" className="w-8 h-8 mr-2" />
        <h1 className="text-2xl font-bold mb-6 text-center">TypeBox</h1>
      </div>
      <div className="mx-6 p-6 w-9/12 max-w-md bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-6 text-center">ログイン</h1>
        <div className="space-y-4">
          {/* 共通のボタンコンポーネント */}
          <AuthButton
            onClick={() => handleSignIn("github")}
            bgColor="bg-gray-800"
            hoverColor="hover:bg-gray-700"
            ringColor="focus:ring-gray-800"
            icon={<AiOutlineGithub className="w-5 h-5" />}
            label="Sign in with GitHub"
          />

          <AuthButton
            onClick={() => handleSignIn("google")}
            bgColor="bg-white"
            hoverColor="hover:bg-gray-50"
            ringColor="focus:ring-gray-400"
            textColor="text-gray-700"
            borderColor="border border-gray-300"
            icon={<GoogleIcon className="w-5 h-5" />}
            label="Sign in with Google"
          />

          <AuthButton
            onClick={() => handleSignIn("azure-ad")}
            bgColor="bg-white"
            hoverColor="hover:bg-gray-50"
            ringColor="focus:ring-gray-400"
            textColor="text-gray-700"
            borderColor="border border-gray-300"
            icon={<MicrosoftIcon className="w-5 h-5" />}
            label="Sign in with Microsoft"
          />
        </div>
      </div>
    </div>
  );
}

interface AuthButtonProps {
  onClick: () => void;
  bgColor: string;
  hoverColor: string;
  ringColor: string;
  textColor?: string;
  borderColor?: string;
  icon: React.ReactNode;
  label: string;
}

const AuthButton: React.FC<AuthButtonProps> = ({
  onClick,
  bgColor,
  hoverColor,
  ringColor,
  textColor = "text-white",
  borderColor = "",
  icon,
  label,
}) => (
  <button
    className={`flex items-center justify-center w-full py-2 ${textColor} ${bgColor} ${borderColor} rounded-md ${hoverColor} focus:outline-none focus:ring-2 focus:ring-offset-2 ${ringColor}`}
    onClick={onClick}
    aria-label={label}
  >
    <div className="flex items-center space-x-2 min-w-44">
      {icon}
      <span className="text-sm font-medium">{label}</span>
    </div>
  </button>
);
