"use client";
import { Avatar } from "antd";
import Link from "next/link";
import { t_user } from "./types";
import { checkUser } from "./api";
import { aesEncode2base64, base642aesDecode } from "./utils";

export function User() {
  return (
    <Link href="/login">
      <Avatar size={64} icon={<i className="fa-regular fa-user icon"></i>} />
    </Link>
  );
}

export function getLocalUser(): t_user | null {
  const userStr = sessionStorage.getItem("user");
  if (!userStr) {
    return null;
  }
  return JSON.parse(base642aesDecode(userStr));
}
export function setLocalUser(user: t_user) {
  const userBase = aesEncode2base64(JSON.stringify(user));
  sessionStorage.setItem("user", userBase);
}
export function clearLocalUser() {
  sessionStorage.removeItem("user");
}
export async function getUser(): Promise<t_user | false> {
  const user = getLocalUser();
  let info: t_user | false = false;
  if (user) {
    const checkInfo = await checkUser(user.token || "");
    info = checkInfo;
  }
  if (!info) {
    clearLocalUser();
  }
  return info;
}
