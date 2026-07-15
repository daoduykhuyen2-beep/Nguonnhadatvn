import type { Metadata } from "next";
import { Be_Vietnam_Pro } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const beVietnam = Be_Vietnam_Pro({
  subsets: ["latin", "vietnamese"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-be-vietnam",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Nguồn Nhà Đất Việt Nam",
    template: "%s | Nguồn Nhà Đất Việt Nam",
  },
  description:
    "Sàn đăng tin bất động sản toàn quốc — nhà phố, đất nền, căn hộ. Đăng tin nhanh, tiếp cận khách mua thật.",
  keywords: ["nhà đất", "bất động sản", "nhà phố", "đăng tin bất động sản", "Việt Nam"],
  openGraph: {
    type: "website",
    locale: "vi_VN",
    siteName: "Nguồn Nhà Đất Việt Nam",
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
      </body>
    </html>
  );
}
