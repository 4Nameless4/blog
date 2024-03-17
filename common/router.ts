import { NextRequest, NextResponse } from "next/server";
import { t_route } from "./types";

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
  {
    path: "/article",
    icon: "article",
    title: "Article",
    children: [
      {
        path: "new",
        userRedirect: "/login",
      },
    ],
  },
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
