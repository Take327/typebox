import Header from "./components/Header";
import SideMenu from "./components/SideMenu";
import PrelineScript from "./components/PrelineScript";
import "./globals.css";
import { MenuProvider } from "@/context/MenuContext";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <head>
        <title>TypeBox</title>
      </head>
      <body>
        {/* メニューの状態を管理するプロバイダー */}
        <MenuProvider>
          {/* ヘッダーとサイドメニューを全ページで共通表示 */}
          <Header />
          <SideMenu />
          {/* メインコンテンツ */}
          <main>{children}</main>
        </MenuProvider>
        {/* Preline用のスクリプト */}
        <PrelineScript />
      </body>
    </html>
  );
}
