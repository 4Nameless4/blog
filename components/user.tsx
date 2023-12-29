"use client";
import { Avatar } from "antd";
import Link from "next/link";

export type t_user = {
  uuid: string;
  name: string;
  nickname: string;
  pwd?: string;
  token?: string;
  role: string; // admin user
};

export function User() {
  return (
    <Link href="/login">
      <Avatar size={64} icon={<i className="fa-regular fa-user icon"></i>} />
    </Link>
  );
}

export function getLocalUser(): string | null {
  const user = sessionStorage.getItem("user");
  let _user = user || null;
  return _user;
}
export function setLocalUser(token: string) {
  sessionStorage.setItem("user", token);
}
