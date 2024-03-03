import { NextRequest, NextResponse } from "next/server";

type t_callback_return = void | NextResponse;
type t_callback_returns = t_callback_return | Promise<t_callback_return>;
type t_callback = (request: NextRequest, path: string) => t_callback_returns;

export type t_route = {
  path: string;
  icon: string;
  title?: string;
  callback?: t_callback | t_callback[];
  userRedirect?: string;
};
// export async function checkUserMiddleware(request: NextRequest) {
//   // const user = await getUser();
//   console.log("********************************************")
//   console.log(request.headers.get("Authorization"))
//   console.log("--------------------------------------------")
//   if (true) {
//     const res = NextResponse.redirect(new URL("/login", request.url));
//     return res;
//   }
// }

const _routes: t_route[] = [
  { path: "/", icon: "house", title: "Home" },
  { path: "/login", icon: "user", title: "Login" },
  { path: "/article", icon: "article", title: "Article" },
  {
    path: "/resume",
    icon: "file-lines",
    title: "Resume",
    userRedirect: "/login",
    // callback: checkUserMiddleware,
  },
  { path: "/shop", icon: "shopify", title: "Shop" },
  {
    path: "/chatroom",
    icon: "comments",
    title: "Chatroom",
    userRedirect: "/login",
    // callback: checkUserMiddleware,
  },
];
const __routes: Record<string, t_route> = {};
_routes.forEach((d) => {
  __routes[d.path] = d;
});
export const routeArr = _routes;

export const routes = __routes;
