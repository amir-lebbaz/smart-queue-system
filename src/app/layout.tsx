import type { Metadata, Viewport } from "next";
import "./globals.css";
import ServiceWorkerRegister from "@/components/ServiceWorkerRegister";

export const metadata: Metadata = {
  title: "نظام الطابور الذكي العام | إفراغ قاعات الانتظار",
  description: "نظام طابور ذكي فائق الخفة مخصص للعيادات، صالونات الحلاقة، ومكاتب الإدارة مع دعم كامل للعمل بدون إنترنت وبدون طابعات تذاكر.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "الطابور الذكي",
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
      <body className="min-h-screen bg-slateNavy-950 text-slateNavy-100 flex flex-col selection:bg-slateNavy-800 selection:text-slateNavy-100 font-sans antialiased">
        <ServiceWorkerRegister />
        {children}
      </body>
    </html>
  );
}
