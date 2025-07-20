import "./globals.css";
import { Header, Footer, AuthPageGuard } from "./components";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "장면의 온도",
  description: "당신의 취향의 딱 맞는 영화 추천 서비스",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Header />
        <main className="bg-[#1D1F28] py-10 min-h-[calc(100vh-88px)] h-full">
          <AuthPageGuard>{children}</AuthPageGuard>
        </main>
        <Footer />
      </body>
    </html>
  );
}
