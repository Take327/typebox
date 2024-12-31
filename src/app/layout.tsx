import Header from "./components/Header";
import SideMenu from "./components/SideMenu";
import Footer from "./components/Footer";
import PrelineScript from "./components/PrelineScript";
import "./globals.css";
import { MenuProvider } from "@/context/MenuContext";

// メタ情報や構造化データなど共通データを定数化
const SITE_INFO = {
  title: "TypeBox",
  description: "TypeBoxはMBTIの診断・蓄積・共有を行うWebアプリケーションです。",
  url: "https://typebox-mbti.vercel.app/",
  ogType: "website",
};

const STRUCTURED_DATA = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: SITE_INFO.title,
  url: SITE_INFO.url,
  description: SITE_INFO.description,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
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

      <body>
        {/* メニューの状態を管理するプロバイダー */}
        <MenuProvider>
          {/* ヘッダーとサイドメニューを全ページで共通表示 */}
          <Header />
          <SideMenu />
          {/* メインコンテンツ */}
          <main className="flex-grow min-h-[calc(100vh-64px)]">{children}</main>
          {/* Footer */}
          <Footer />
        </MenuProvider>

      </body>
    </html>
  );
}
