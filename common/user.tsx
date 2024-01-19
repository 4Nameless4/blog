"use client";
import { t_user } from "./types";
import { checkUser } from "./api";
import { aesEncode2base64, base642aesDecode } from "./utils";

export function getLocalUser(): (t_user & { token: string }) | null {
  const userStr = localStorage.getItem("user");
  if (!userStr) {
    return null;
  }
  try {
    const origin = base642aesDecode(userStr);
    return JSON.parse(origin);
  } catch {
    return null;
  }
}
export function setLocalUser(user: t_user, token: string) {
  const userBase = aesEncode2base64(
    JSON.stringify({
      ...user,
      token,
    })
  );
  localStorage.setItem("user", userBase);
}
export function clearLocalUser() {
  localStorage.removeItem("user");
}
export async function getUser(): Promise<t_user | false> {
  const user = getLocalUser();
  let info: t_user | false = false;
  if (user) {
    const checkInfo = await checkUser(user.token || "");
    info = checkInfo;
    info && setLocalUser(info, user.token);
  }
  if (!info) {
    clearLocalUser();
  }
  return info;
}
