import type { Metadata, Viewport } from "next";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { SITE } from "@/lib/site";
import { withBasePath } from "@/lib/path";

export const metadata: Metadata = {
  metadataBase: new URL(SITE.siteUrl),
  title: {
    default: `${SITE.title} | ${SITE.name}`,
    template: `%s | ${SITE.name}`,
  },
  description: SITE.description,
  manifest: withBasePath("/manifest.webmanifest"),
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: SITE.name,
  },
  openGraph: {
    type: "website",
    siteName: SITE.name,
    title: SITE.title,
    description: SITE.description,
    url: SITE.siteUrl,
  },
  twitter: {
    card: "summary",
    title: SITE.title,
    description: SITE.description,
  },
  icons: {
    icon: withBasePath("/icons/icon-192.png"),
    apple: withBasePath("/icons/icon-192.png"),
  },
};

export const viewport: Viewport = {
  themeColor: "#1f2d49",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body>
        <Header />
        <main className="mx-auto min-h-screen max-w-5xl px-4 py-6">{children}</main>
        <Footer />
        <ServiceWorkerRegister />
      </body>
    </html>
  );
}

// PWA: サービスワーカー登録（クライアントのみ）
function ServiceWorkerRegister() {
  const swPath = withBasePath("/sw.js");
  const code = `if('serviceWorker' in navigator){window.addEventListener('load',function(){navigator.serviceWorker.register('${swPath}').catch(function(){});});}`;
  return <script dangerouslySetInnerHTML={{ __html: code }} />;
}
