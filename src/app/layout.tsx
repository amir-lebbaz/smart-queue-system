import type { Metadata, Viewport } from "next";
import "./globals.css";
import ServiceWorkerRegister from "@/components/ServiceWorkerRegister";

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
    <html lang="ar" dir="rtl">
      <body className="min-h-screen bg-[#06141B] text-[#CCD0CF] flex flex-col selection:bg-[#253745] selection:text-[#CCD0CF] font-sans antialiased">
        <ServiceWorkerRegister />
        {children}
      </body>
    </html>
  );
}
