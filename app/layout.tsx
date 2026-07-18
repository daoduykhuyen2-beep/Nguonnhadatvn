import type { Metadata } from "next";
import { Be_Vietnam_Pro } from "next/font/google";
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

export const metadata: Metadata = {
  title: {
    default: "Nhà Đất Việt Nam",
    template: "%s | Nhà Đất Việt Nam",
  },
  description:
    "Sàn đăng tin bất động sản toàn quốc — nhà phố, đất nền, căn hộ. Đăng tin nhanh, tiếp cận khách mua thật.",
  keywords: ["nhà đất", "bất động sản", "nhà phố", "đăng tin bất động sản", "Việt Nam"],
  icons: { icon: "/logo.png", shortcut: "/logo.png", apple: "/logo.png" },
  openGraph: {
    type: "website",
    locale: "vi_VN",
    siteName: "Nhà Đất Việt Nam",
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
      </body>
    </html>
  );
}
