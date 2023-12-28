import { AES, enc, mode, pad } from "crypto-js";
import { t_user } from "./user";

export async function signin(user: t_user, pwd: string) {
  const res = await fetch(process.env.SERVER + "/User/signin", {
    method: "POST",
    mode: "cors",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json;charset=utf-8",
    },
    body: `"${aesEncode(JSON.stringify({ ...user, pwd }))}"`,
  });
  return res.json();
}
export async function check(user: t_user) {
  const res = await fetch(process.env.SERVER + "/user/check", {
    method: "POST",
    body: aesEncode(JSON.stringify(user)),
  });
  return res.json();
}
export async function signup(user: t_user, pwd: string) {
  const res = await fetch(process.env.SERVER + "/user/signup", {
    method: "POST",
    body: aesEncode(JSON.stringify({ ...user, pwd })),
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
