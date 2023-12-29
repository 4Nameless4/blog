import { AES, enc, mode, pad } from "crypto-js";
import { t_user } from "./user";

export async function signin(name: string, pwd: string) {
  const res = await fetch(process.env.SERVER + "/User/signin", {
    method: "POST",
    mode: "cors",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json;charset=utf-8",
    },
    body: JSON.stringify(aesEncode(JSON.stringify({ name, pwd }))),
  });
  return res.json();
}
export async function check(token: string) {
  const res = await fetch(process.env.SERVER + "/user/check", {
    method: "POST",
    body: JSON.stringify(aesEncode(token)),
  });
  return res.json();
}
export async function signup(name: string, pwd: string, nickname: string) {
  const res = await fetch(process.env.SERVER + "/user/signup", {
    method: "POST",
    body: JSON.stringify(aesEncode(JSON.stringify({ name, nickname, pwd }))),
  });
  return res.json();
}

export function aesEncode(data: string) {
  const msg = enc.Utf8.parse(data);
  const key = enc.Utf8.parse("|a2we##q2/d-e1=2");
  const iv = enc.Utf8.parse("089dg|1*h19a//a*");

  return enc.Base64.stringify(
    AES.encrypt(msg, key, {
      iv: iv,
      mode: mode.CBC,
      padding: pad.Pkcs7,
    }).ciphertext
  );
}
