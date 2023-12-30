import { AES, enc, mode, pad } from "crypto-js";

const key = enc.Utf8.parse("|a2we##q2/d-e1=2");
const iv = enc.Utf8.parse("089dg|1*h19a//a*");

export function aesEncode2base64(data: string) {
  const msg = enc.Utf8.parse(data);

  return enc.Base64.stringify(
    AES.encrypt(msg, key, {
      iv: iv,
      mode: mode.CBC,
      padding: pad.Pkcs7,
    }).ciphertext
  );
}
export function base642aesDecode(data: string) {
  return AES.decrypt(data, key, {
    iv: iv,
    mode: mode.CBC,
    padding: pad.Pkcs7,
  }).toString(enc.Utf8);
}
