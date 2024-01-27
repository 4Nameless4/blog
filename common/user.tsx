import { t_token_user, t_user } from "./types";
import { checkUser } from "./api";
import { aesEncode2base64, base642aesDecode } from "./utils";

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
