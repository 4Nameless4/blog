import type { Metadata } from "next";
import MenuRoute from "./menu-route";
import Link from "next/link";
import "./globals.css";
import User from "./user";
import { useReducer } from "react";

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
      <head>
        <link rel="stylesheet" href="/all.min.css"></link>
      </head>
      <body className="min-h-screen flex flex-col">
        <header className="sticky top-0 flex items-center justify-between p-5">
          <div className="flex gap-4">
            <Link href="/">
              <i className="fa-solid fa-house icon"></i>
            </Link>

            <Link href="https://github.com/4Nameless4/blog">
              <i className="fa-brands fa-github icon"></i>
            </Link>
          </div>
          <div className="flex gap-4">
            <User />

            <MenuRoute />
          </div>
        </header>
        <main className="grid p-24 flex-1 overflow-hidden">{children}</main>
      </body>
    </html>
  );
}
