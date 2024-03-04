"use client"
import { aesEncode2base64, base642aesDecode } from "./crypto";
import { t_token_user, t_user } from "./types";

export async function request(
  api: string,
  data: string,
  headers?: HeadersInit 
) {
  const token = getUserToken()
  const res = await fetch(process.env.SERVER + api, {
    method: "POST",
    mode: "cors",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json;charset=utf-8",
      "Authorization": token,
      ...headers,
    },
    body: JSON.stringify(aesEncode2base64(data)),
  });
  const json = await res.json();
  return base642aesDecode(json);
}
export async function requestGet(api: string) {
  const res = await fetch(process.env.SERVER + api, {
    method: "GET",
    mode: "cors",
  });
  const text = await res.text();
  return base642aesDecode(text);
}

export function formatZeroToLeft(num: number, length: number = 2) {
  let str = `${num}`;

  for (let i = 0; i < length - str.length; i++) {
    str = "0" + str;
  }

  return str;
}

export function formatDate(date: Date) {
  let month = formatZeroToLeft(date.getMonth() + 1);
  let day = formatZeroToLeft(date.getDate());
  return `${date.getFullYear()}/${month}/${day}`;
}

export function getLocalUser(): t_token_user | null {
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

export function getUserToken() {
  const user = getLocalUser();

  return (user && user.token) || "";
}
