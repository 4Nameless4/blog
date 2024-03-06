"use client";
import "./globals.css";
import type { Metadata } from "next";
import Menu from "../components/menu";
import { UserContext } from "@/common/context";
import { useUser } from "@/common/hooks";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const userCtx = useUser();
  
  return (
    <html lang="en">
      <head>
        <title>MZW Blog</title>
      </head>
      <body className="min-h-screen flex flex-col">
        <UserContext.Provider value={userCtx}>
          <header className="contents">
            <Menu />
          </header>
          <main className="grid p-24 flex-1 z-0">{children}</main>
        </UserContext.Provider>
      </body>
    </html>
  );
}
