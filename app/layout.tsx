import type { Metadata } from "next";
import { Be_Vietnam_Pro } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import VisitTracker from "@/components/VisitTracker";

const beVietnam = Be_Vietnam_Pro({
  subsets: ["latin", "vietnamese"],
  weight: ["400", "600", "700"],
  variable: "--font-be-vietnam",
  display: "swap",
});

const GA_MEASUREMENT_ID = "G-EGGN0LHY1E";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.nguonnhadatvn.vn"),
  alternates: { canonical: "/" },
  title: {
    default: "Nguồn Nhà Đất Việt Nam",
    template: "%s | Nguồn Nhà Đất Việt Nam",
  },
  description:
    "Sàn đăng tin bất động sản toàn quốc — nhà phố, đất nền, căn hộ. Đăng tin nhanh, tiếp cận khách mua thật.",
  keywords: ["nhà đất", "bất động sản", "nhà phố", "đăng tin bất động sản", "Việt Nam"],
  icons: { icon: "/logo.png", shortcut: "/logo.png", apple: "/logo.png" },
  openGraph: {
    type: "website",
    locale: "vi_VN",
    siteName: "Nguồn Nhà Đất Việt Nam",
    url: "https://www.nguonnhadatvn.vn",
    images: [{ url: "/logo.png", width: 512, height: 512, alt: "Nguồn Nhà Đất Việt Nam" }],
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="vi" className={beVietnam.variable}>
      <body className="min-h-screen bg-paper font-sans text-ink antialiased">
        <Header />
        <main className="min-h-[70vh]">{children}</main>
        <Footer />
        <VisitTracker />
        {/* Google AdSense - ho tro Auto ads (Google tu chen quang cao) */}
        <Script
          id="google-adsense"
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1337313717244533"
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_MEASUREMENT_ID}');
          `}
        </Script>
      </body>
    </html>
  );
}
