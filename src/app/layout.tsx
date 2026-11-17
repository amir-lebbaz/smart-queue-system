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
    <html lang="ar" dir="rtl">
      <body className="min-h-screen bg-[#08131F] text-[#E8EFF3] flex flex-col selection:bg-[#2E4F6B] selection:text-[#E8EFF3] font-sans antialiased">
        <ServiceWorkerRegister />
        {children}
      </body>
    </html>
  );
}
