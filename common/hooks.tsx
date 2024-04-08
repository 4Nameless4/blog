"use client";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { t_token_user } from "./types";
import { Spin } from "antd";
import { routeArr, routes } from "./router";
import {
  clearLocalUser,
  getUserToken,
  matchRoute,
  setLocalUser,
} from "./utils";
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
        router.push(userRedirect);
      }
    });
  }, [router, pathname]);
}

export function useLoading(render: () => JSX.Element) {
  let [loading, setLoading] = useState(true);

  const loadingTemplate = (
    <div className="flex justify-center items-center">
      <Spin />
    </div>
  );
  return {
    loading,
    setLoading,
    render: loading ? loadingTemplate : render(),
  };
}
