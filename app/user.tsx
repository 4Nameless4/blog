"use client";
import { Avatar } from "antd";
import Link from "next/link";
import { useReducer } from "react";

export type t_user = {
  uuid: string;
  name: string;
  nickname: string;
  token: string;
} | null;

export type t_user_action_login = {
  type: "login";
  name: string;
  pwd: string;
};
export type t_user_action_logout = {
  type: "logout";
};

function reducer(
  state: t_user,
  action: t_user_action_login | t_user_action_logout
): t_user {
  return null;
}

function checkUser(userStorage: string): t_user {
  return null;
}

export function useUser() {
  const userStorage = window.localStorage.getItem("user");

  let user: t_user = (userStorage && checkUser(userStorage)) || null;

  return useReducer(reducer, user);
}

export default function User() {
  return (
    <Link href="/login">
      <Avatar size={64} icon={<i className="fa-regular fa-user icon"></i>} />
    </Link>
  );
}
