"use client";
import { useRouter, usePathname } from "next/navigation";
import { getUser } from "./api";
import { useEffect, useState } from "react";
import { t_token_user } from "./types";
import { Spin } from "antd";
import { routes } from "./router";

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

  return user;
}

export function useLoading(render: () => JSX.Element, flag: boolean) {
  return flag ? (
    render()
  ) : (
    <div className="flex justify-center items-center">
      <Spin />
    </div>
  );
}
