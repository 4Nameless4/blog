"use client";
import { Avatar } from "antd";
import Link from "next/link";

export type t_user = {
  uuid: string;
  name: string;
  nickname: string;
  token: string;
};

export type t_user_action_login = {
  type: "login";
  name: string;
  pwd: string;
};
export type t_user_action_logout = {
  type: "logout";
};

export function createTempUser(): t_user {
  return {
    uuid: `temp-${Date.now()}`,
    nickname: "nickname",
    name: "name",
    token: "",
  };
}

async function checkUser(token: string): Promise<t_user | null> {
  const server = process.env.SERVER || "http://localhost:8080";
  const result = await fetch(server + "/checkuser", {
    body: "",
  }).then((d) => d.json());
  return null;
}

export async function getUser(): Promise<t_user | null> {
  const user = sessionStorage.getItem("user");
  let _user = null;
  if (user) {
    _user = JSON.parse(user);
    const check = await checkUser(_user);
    return check;
  } else {
    // const user = createTempUser();
    // sessionStorage.setItem("user", JSON.stringify(user));
    // _user = user;
  }

  return null;
}

export function User() {
  return (
    <Link href="/login">
      <Avatar size={64} icon={<i className="fa-regular fa-user icon"></i>} />
    </Link>
  );
}
