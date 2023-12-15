import type { Metadata } from "next";
import MenuRoute from "./menu-route";
import Link from "next/link";
import "./globals.css";
import User from "./user";
import Menu from "./menu";

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
          {/* <div className="flex gap-4">
            <Link href="/">
              <i className="fa-solid fa-house icon"></i>
            </Link>
            <Link href="/resume">
              <i className="fa-solid fa-bookmark icon"></i>
            </Link>
            <Link href="https://github.com/4Nameless4/blog">
              <i className="fa-brands fa-github icon"></i>
            </Link>
          </div>
          <div className="flex gap-4">
            <User />
            <MenuRoute />
          </div> */}
        </header>
        <main className="grid p-24 flex-1 overflow-hidden z-0">{children}</main>
      </body>
    </html>
  );
}
