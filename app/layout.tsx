import "./globals.css";
import { Header, Footer } from "./components";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Header />
        <main className="h-[100vh] bg-[#1D1F28]">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
