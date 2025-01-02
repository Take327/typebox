import "./globals.css";
import Footer from "./components/Footer";
import HeaderWithMenu from "./components/HeaderWithMenu";

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
      <body className="flex flex-col">
        <HeaderWithMenu />
        <main className="flex-grow min-h-[calc(100vh-42px)] bg-gray-100">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
