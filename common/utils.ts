import { AES, enc, mode, pad } from "crypto-js";
import type { lib } from "crypto-js";
import { clearLocalUser, getLocalUser, setLocalUser } from "./user";
import { t_token_user, t_user } from "./types";

const key1 = enc.Utf8.parse("|a2wemzw2/d-e1=2");
const key2 = "rrSbMerwLYgfq9Hvtgwk8wlCLSWbkKMvf4mEOmhC8SA=";
const iv = enc.Utf8.parse("089dg|1*h19a//a*");

function encode(data: string | lib.WordArray, key: string | lib.WordArray) {
  return AES.encrypt(data, key, {
    iv: iv,
    mode: mode.CBC,
    padding: pad.Pkcs7,
  });
}
function decode(data: string | lib.CipherParams, key: string | lib.WordArray) {
  return AES.decrypt(data, key, {
    iv: iv,
    mode: mode.CBC,
    padding: pad.Pkcs7,
  });
}
export function aesEncode2base64(data: string) {
  const msg = enc.Utf8.parse(data);
  const key = decode(key2, key1);
  return enc.Base64.stringify(encode(msg, key).ciphertext);
}
export function base642aesDecode(data: string) {
  const key = decode(key2, key1);
  return decode(data, key).toString(enc.Utf8);
}

export function base64ToString(base64: string) {
  let binString = "";
  if (Buffer) {
    const buf = new Buffer(base64, "base64");
    binString = buf.toString();
  } else if (!!window) {
    binString = window.atob(base64);
    binString = new TextDecoder().decode(
      Uint8Array.from(binString as any, (m: any) => m.codePointAt(0))
    );
  }
  return binString;
}

export async function getUser(): Promise<t_token_user | false> {
  const user = getLocalUser();
  let info: t_token_user | false = false;
  if (user) {
    const token = user.token;
    const { data: checkInfo } = await fetch("/user", {
      method: "POST",
      body: JSON.stringify({ type: "check", data: token }),
    }).then((d) => d.json());
    info = checkInfo;
    info && setLocalUser(info, token);
  }
  if (!info) {
    clearLocalUser();
  }
  return info;
}

export function fetchJSON(path: string, data: any, options: RequestInit) {
  return fetch(path, {
    body: JSON.stringify(data),
    ...options,
  }).then((d) => d.json());
}

export function formatZeroToLeft(num: number, length: number = 2) {
  let str = `${num}`;

  for (let i = 0; i < length - str.length; i++) {
    str = "0" + str;
  }

  return str;
}

export function formatDate(date: Date, isHour: boolean = false) {
  let month = formatZeroToLeft(date.getMonth() + 1);
  let day = formatZeroToLeft(date.getDate());
  return `${date.getFullYear()}/${month}/${day}`;
}
