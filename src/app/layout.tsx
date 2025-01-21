import { Flowbite } from "flowbite-react";
import customTheme from "./components/Flowbit/customTheme";
import Footer from "./components/Footer";
import HeaderWithMenu from "./components/HeaderWithMenu";
import "./globals.css";

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

export default function RootLayout({ children }: { children: React.ReactNode }) {
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
