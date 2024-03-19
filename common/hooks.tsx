"use client";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { t_loading_stack, t_token_user } from "./types";
import { Spin } from "antd";
import { routeArr, routes } from "./router";
import { clearLocalUser, getUserToken, matchRoute, setLocalUser } from "./utils";
import { checkUser } from "./api";
import { setStoreState, useStore } from "./store";

export async function getUser(): Promise<t_token_user | null> {
  const token = getUserToken();
  let info: t_token_user | null = null;
  if (token) {
    info = await checkUser(token);
    info && setLocalUser(info, token);
  }
  if (!info) {
    clearLocalUser();
  }
  return info;
}

export function useUser() {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    getUser().then((d) => {
      const match = matchRoute(pathname, routeArr);
      const userRedirect = match && match.userRedirect;
      if (d) {
        setStoreState("user", d);
      } else if (match && userRedirect) {
        router.replace(userRedirect);
      }
    });
  }, [router, pathname]);
}

export function useLoading(
  render: () => JSX.Element,
  flags:
    | string
    | (string | Promise<any> | unknown)[]
    | Promise<any>
    | unknown = []
) {
  const store = useStore();
  const loadingStack: t_loading_stack = store.state.loadingStack || {};
  let [loading, setLoading] = useState(!!flags);

  let loop: (string | Promise<any> | unknown)[] = [];
  if (!Array.isArray(flags)) {
    loop = [flags] as any[];
  } else {
    loop = flags;
  }

  const _flags = [];
  for (const i of loop) {
    if (typeof i === "string" && i in loadingStack) {
      _flags.push(loadingStack[i]);
    } else if (i instanceof Promise) {
      _flags.push(i);
    }
  }

  if (flags) {
    Promise.allSettled(_flags).then(() => {
      setLoading(false);
    });
  }

  const loadingTemplate = (
    <div className="flex justify-center items-center">
      <Spin />
    </div>
  );
  return loading ? loadingTemplate : render();
}
