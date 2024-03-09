"use client";
import "./globals.css";
import Menu from "../components/menu";
import { UserContext } from "@/common/context";
import { useLoading, useUser } from "@/common/hooks";
import { CreateStore } from "@/common/store";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const userCtx = useUser();
  const { Provider, store } = CreateStore();

  return (
    <Provider value={store}>
      <html lang="en">
        <head>
          <title>MZW Blog</title>
        </head>
        <body className="min-h-screen flex flex-col">
          <UserContext.Provider value={userCtx}>
            <header className="contents">
              <Menu />
            </header>
            <main className="grid p-24 flex-1 z-0">
              {useLoading(
                () => (
                  <>{children}</>
                ),
                ["checkUser"]
              )}
            </main>
          </UserContext.Provider>
        </body>
      </html>
    </Provider>
  );
}
