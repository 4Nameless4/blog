"use client";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { t_loading_stack, t_token_user } from "./types";
import { Spin } from "antd";
import { routes } from "./router";
import { clearLocalUser, getUserToken, setLocalUser } from "./utils";
import { checkUser } from "./api";
import { useStore } from "./store";

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
  const [user, setUser] = useState<t_token_user | null>(null);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    getUser().then((d) => {
      const route = routes[pathname];
      const userRedirect = route.userRedirect;
      if (d) {
        setUser(d);
      } else if (route && userRedirect) {
        router.replace(userRedirect);
      }
    });
  }, [router, pathname]);

  return [user, setUser] as const;
}

const loadingTemplate = (
  <div className="flex justify-center items-center">
    <Spin />
  </div>
);

export function useLoading(
  render: () => JSX.Element,
  flags: string | string[] = []
) {
  const store = useStore();
  const loadingStack: t_loading_stack = store.state.loadingStack || {};
  console.log("change", loadingStack);
  let [loading, setLoading] = useState(true);

  if (typeof flags === "string") flags = [flags];

  const _flags = [];
  for (const i of flags) {
    if (i in loadingStack) {
      _flags.push(loadingStack[i]);
    }
  }

  if (_flags.length) {
    Promise.allSettled(_flags).then(() => {
      setLoading(false);
    });
  }

  return loading ? loadingTemplate : render();
}
