// "use server"
import { t_user } from "./types";
import { aesEncode2base64, base642aesDecode } from "./utils";

export type t_result<T = unknown> = {
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
  const result: string = base642aesDecode(await res.json());
  const resultJson: t_result<t_user & { token: string }> = JSON.parse(result);
  if (resultJson.code === "1") {
    info = resultJson.data;
  }
  return info;
}
export async function checkUser(token: string) {
  const res = await request("/User/check", aesEncode2base64(token));
  let info: false | t_user = false;
  const result: string = base642aesDecode(await res.json());
  const resultJson: t_result<t_user & { token: string }> = JSON.parse(result);
  if (resultJson.code === "1") {
    info = resultJson.data;
  }
  return info;
}
export async function signup(name: string, pwd: string, nickname: string) {
  const res = await request(
    "/User/signup",
    aesEncode2base64(JSON.stringify({ name, nickname, pwd }))
  );
  let info: boolean = false;
  const result: string = base642aesDecode(await res.json());
  const resultJson: t_result<boolean> = JSON.parse(result);
  if (resultJson.code === "1") {
    info = resultJson.data;
  }
  return info;
}
