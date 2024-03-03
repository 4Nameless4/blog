import { AES, enc, mode, pad } from "crypto-js";
import type { lib } from "crypto-js";

const key1 = enc.Utf8.parse(process.env.key1 || "");
const key2 = process.env.key2 || "";
const iv = enc.Utf8.parse(process.env.iv || "");
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
