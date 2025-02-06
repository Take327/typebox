"use client";

import { ProcessingProvider } from "@/context/ProcessingContext";
import { SessionProvider } from "next-auth/react";
import Footer from "./components/Footer";
import { Flowbite } from "flowbite-react";
import customTheme from "./components/Flowbit/customTheme";
import Header from "./components/Header";

/**
 * クライアントサイド専用のレイアウトコンポーネント。
 *
 * - `SessionProvider`: NextAuth のセッション管理を提供。
 * - `ProcessingProvider`: アプリケーションの処理状態を管理。
 * - `Flowbite`: Tailwind CSS ベースの UI コンポーネントライブラリ（カスタムテーマ適用）。
 * - `Header` と `Footer`: アプリ共通のヘッダー・フッター。
 *
 * @param {Object} props - コンポーネントのプロパティ。
 * @param {React.ReactNode} props.children - レイアウト内にレンダリングされる子コンポーネント。
 * @returns {JSX.Element} レイアウトコンポーネントの JSX 要素。
 *
 * @example
 * ```tsx
 * <ClientLayout>
 *   <Dashboard />
 * </ClientLayout>
 * ```
 */
export default function ClientLayout({ children }: { children: React.ReactNode }): JSX.Element {
  return (
    <SessionProvider>
      <ProcessingProvider>
        <Header />
        <Flowbite theme={{ theme: customTheme }}>
          <main className="min-h-[calc(100vh-42px)] flex-grow bg-gray-100">{children}</main>
        </Flowbite>
        <Footer />
      </ProcessingProvider>
    </SessionProvider>
  );
}
