import type { Metadata, Viewport } from "next";
import { IBM_Plex_Sans_Arabic } from "next/font/google";
import "./globals.css";
import ServiceWorkerRegister from "@/components/ServiceWorkerRegister";

const ibmPlexArabic = IBM_Plex_Sans_Arabic({
  subsets: ["arabic"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-ibm-plex",
  display: "swap",
});

export const metadata: Metadata = {
  title: "NextDz | قاعة هادئة، سكرتيرة مرتاحة، زبائن راضون",
  description: "NextDz — نظام إدارة الطوابير والمواعيد الذكي للعيادات، المراكز الطبية والصالونات. قاعة هادئة، سكرتيرة مرتاحة، زبائن راضون بدون طابعات تذاكر ورقية.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "NextDz",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#059669",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning>
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
      </head>
      <body className={`${ibmPlexArabic.variable} min-h-screen bg-[#050507] text-[#F3F4F6] flex flex-col selection:bg-emerald-500/30 selection:text-emerald-300 font-sans antialiased`}>
        <ServiceWorkerRegister />
        {children}
      </body>
    </html>
  );
}
