import React from "react";
import { Flowbite } from "flowbite-react";
import customTheme from "./components/Flowbit/customTheme";
import Footer from "./components/Footer";
import HeaderWithMenu from "./components/HeaderWithMenu";
import "./globals.css";

/**
 * サイト情報を定義する定数。
 *
 * サイトのタイトル、説明、URL、OGPタイプを含みます。
 */
const SITE_INFO = {
  /** サイトのタイトル */
  title: "TypeBox",
  /** サイトの説明 */
  description: "TypeBoxはMBTIの診断・蓄積・共有を行うWebアプリケーションです。",
  /** サイトのURL */
  url: "https://typebox-mbti.vercel.app/",
  /** OGPのタイプ */
  ogType: "website",
};

/**
 * 構造化データを定義する定数。
 *
 * Schema.orgの仕様に基づいたWebサイトのメタデータを含みます。
 */
const STRUCTURED_DATA = {
  /** Schema.orgのコンテキスト */
  "@context": "https://schema.org",
  /** Schema.orgのタイプ */
  "@type": "WebSite",
  /** サイト名 */
  name: SITE_INFO.title,
  /** サイトURL */
  url: SITE_INFO.url,
  /** サイトの説明 */
  description: SITE_INFO.description,
};

/**
 * アプリケーション全体のレイアウトを提供するコンポーネント。
 *
 * @param {object} props - コンポーネントに渡されるプロパティ。
 * @param {React.ReactNode} props.children - レイアウト内に表示される子要素。
 * @returns {JSX.Element} アプリケーションのルートレイアウト。
 */
export default function RootLayout({ children }: { children: React.ReactNode }): React.JSX.Element {
  return (
    <html lang="ja">
      <head>
        <title>{SITE_INFO.title}</title>
        <meta name="description" content={SITE_INFO.description} />
        <meta property="og:title" content={SITE_INFO.title} />
        <meta property="og:description" content={SITE_INFO.description} />
        <meta property="og:type" content={SITE_INFO.ogType} />
        <meta property="og:url" content={SITE_INFO.url} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(STRUCTURED_DATA),
          }}
        />
      </head>
      <body className="flex flex-col">
        <HeaderWithMenu />
        <Flowbite theme={{ theme: customTheme }}>
          <main className="min-h-[calc(100vh-42px)] flex-grow bg-gray-100">{children}</main>
        </Flowbite>
        <Footer />
      </body>
    </html>
  );
}
