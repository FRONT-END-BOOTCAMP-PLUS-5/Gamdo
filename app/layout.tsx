import "./globals.css";
import { Header, Footer, AuthPageGuard } from "./components";

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
