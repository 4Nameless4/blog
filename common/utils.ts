import { AES, enc, mode, pad } from "crypto-js";
import type { lib } from "crypto-js";

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
