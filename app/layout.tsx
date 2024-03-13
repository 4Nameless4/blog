"use client";
import "./globals.css";
import Menu from "../components/menu";
import { useLoading, useUser } from "@/common/hooks";
import { CreateStore } from "@/common/store";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { Provider, store } = CreateStore();
  useUser();

  return (
    <Provider value={store}>
      <html lang="en">
        <head>
          <title>MZW Blog</title>
        </head>
        <body className="min-h-screen flex flex-col">
          <header className="contents">
            <Menu />
          </header>
          <main className="grid p-24 flex-1 z-0">
            {children}
            {/* {useLoading(
                () => (
                  <>{children}</>
                ),
                ["checkUser"]
              )} */}
          </main>
        </body>
      </html>
    </Provider>
  );
}
