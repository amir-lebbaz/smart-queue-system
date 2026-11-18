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
  themeColor: "#313c45",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl" className={ibmPlexArabic.variable}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+Arabic:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen font-sans antialiased text-[#313c45] bg-[#f7f9fb] selection:bg-[#778ca4]/25 selection:text-[#313c45]">
        <ServiceWorkerRegister />
        {children}
      </body>
    </html>
  );
}
