import type { NextRequest } from "next/server";
import { routeArr, t_route } from './common/router'

const callbacks: Record<string, t_route["callback"]> = {}
routeArr.forEach((d) => {
  if (d.callback) {
    callbacks[d.path] = d.callback
  }
})

export default function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname
  const match = callbacks[path]
  if (Array.isArray(match)) {
    const len = match.length
    for (let i = 0; i < len; i++) {
      match[i](request, path)
    }
  } else if (match) {
    match(request, path)
  }
}
