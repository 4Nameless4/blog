import "./globals.css";
import type { Metadata } from "next";
import Menu from "../components/menu";

export const metadata: Metadata = {
  title: "MZW Blog",
  description: "Created by NextJS",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col">
        <header className="contents">
          <Menu />
        </header>
        <main className="grid p-24 flex-1 overflow-hidden z-0">{children}</main>
      </body>
    </html>
  );
}
