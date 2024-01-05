"use server"
import { t_user } from "./types";
import { aesEncode2base64 } from "./utils";

type t_result<T = unknown> = {
  code: string;
  data: T;
  msg: string;
};

export async function request(api: string, data: string) {
  const res = await fetch(process.env.SERVER + api, {
    method: "POST",
    mode: "cors",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json;charset=utf-8",
    },
    body: JSON.stringify(data),
  });
  return res;
}

export async function signin(name: string, pwd: string) {
  const res = await request(
    "/User/signin",
    aesEncode2base64(JSON.stringify({ name, pwd }))
  );
  let info: false | (t_user & { token: string }) = false;
  const result: t_result<t_user & { token: string }> = await res.json();
  if (result.code === "1") {
    info = result.data;
  }
  return info;
}
export async function checkUser(token: string) {
  const res = await request("/User/check", aesEncode2base64(token));
  let info: false | t_user = false;
  const result: t_result<t_user> = await res.json();
  if (result.code === "1") {
    info = result.data;
  }
  return info;
}
export async function signup(name: string, pwd: string, nickname: string) {
  const res = await request(
    "/User/signup",
    aesEncode2base64(JSON.stringify({ name, nickname, pwd }))
  );
  let info: boolean = false;
  const result: t_result<boolean> = await res.json();
  if (result.code === "1") {
    info = result.data;
  }
  return info;
}
