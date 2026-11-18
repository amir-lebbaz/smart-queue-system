import type { Metadata, Viewport } from "next";
import { IBM_Plex_Sans_Arabic } from "next/font/google";
import "./globals.css";
import ServiceWorkerRegister from "@/components/ServiceWorkerRegister";

const ibmPlexArabic = IBM_Plex_Sans_Arabic({
  subsets: ["arabic"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-ibm-plex-arabic",
  display: "swap",
});

export const metadata: Metadata = {
  title: "NextDZ | قاعة هادئة، سكرتيرة مرتاحة، زبائن راضون",
  description: "NextDZ — نظام إدارة الطوابير الذكي بدون أجهزة أو طابعات ورقية للعيادات، الصالونات، ومكاتب التوثيق. حوّل هاتف كل زائر إلى تذكرة ذكية.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "NextDZ",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#06141B",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl" className={ibmPlexArabic.variable} suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var saved = localStorage.getItem('smart_queue_theme');
                  if (saved === 'frozen') {
                    document.documentElement.setAttribute('data-theme', 'frozen');
                    document.documentElement.classList.add('theme-frozen');
                  } else {
                    document.documentElement.setAttribute('data-theme', 'arctic');
                    document.documentElement.classList.remove('theme-frozen');
                  }
                } catch(e) {}
              })();
            `,
          }}
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+Arabic:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen font-sans antialiased text-slateNavy-100 bg-slateNavy-950 selection:bg-slateNavy-800 selection:text-slateNavy-100">
        <ServiceWorkerRegister />
        {children}
      </body>
    </html>
  );
}
