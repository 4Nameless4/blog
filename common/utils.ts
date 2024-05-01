"use client";
import { ReadonlyURLSearchParams } from "next/navigation";
import { aesEncode2base64, base642aesDecode } from "./crypto";
import { t_route, t_token_user, t_user } from "./types";
import { deepEqual } from "nameless4-common";

export async function request(url: string, params: RequestInit = {}) {
  const promise = fetch(url, params);
  const res = await promise;

  return res;
}
export async function requestAPI(url: string, params: RequestInit = {}) {
  const token = getUserToken();
  const headers = params.headers || (params.headers = {});
  Object.assign(headers, {
    Authorization: token,
  });
  return request(process.env.SERVER + url, params);
}
export async function requestJSON(
  api: string,
  data?: string,
  headers?: HeadersInit
) {
  const res = await requestAPI(api, {
    method: "POST",
    mode: "cors",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json;charset=utf-8",
      ...headers,
    },
    body: data && JSON.stringify(aesEncode2base64(data)),
  });
  const json = await res.json();
  return base642aesDecode(json);
}
export async function requestGet(api: string) {
  const res = await requestAPI(api, {
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

// ?type=1&name=tom
export function formatSearchStrToObj(searchStr: string) {
  searchStr = searchStr.replace(/^\?/, "");
  const search: Record<string, string> = {};
  let searchArr = searchStr.split("&").filter((d) => !!d);
  searchArr = searchArr.map((d) => {
    const data = d.split("=");
    const key = data[0];
    if (key) {
      search[key] = data[1];
    }
    return key;
  });
  return search;
}

/*
{
  type: 1,
  name: "tom"
}
*/
export function formatSearchObjToStr(
  searchObj: Record<string, string | number>
) {
  const keys = Object.keys(searchObj);
  keys.sort();
  let searchStr = "";
  if (keys.length) {
    searchStr += "?";
    keys.forEach((k, i) => {
      const str = `${k}=${searchObj[k]}`;
      if (i !== 0) {
        searchStr += "&";
      }
      searchStr += str;
    });
  }
  return searchStr;
}

export function formatPath(
  path: string,
  searchStr?: string | Record<string, string>
) {
  // path format
  path = path.trim();
  if (path.length > 1) {
    path = path.replace(/^\//, "").replace(/\/$/, "");
  }
  const arr = path.split("/").filter((d) => !!d);

  // search format
  const search =
    typeof searchStr === "string"
      ? formatSearchStrToObj(searchStr)
      : searchStr || {};

  // fullpath format
  const fullPath = path + formatSearchObjToStr(search);

  return {
    path,
    search,
    fullPath,
    arr,
  };
}

export function matchStr(str: string, strOrRegExpStr: string) {
  if ((str && !strOrRegExpStr) || (!str && strOrRegExpStr)) {
    return false;
  }
  return RegExp(strOrRegExpStr).test(str);
}

export function matchRoute(
  path: string,
  search: string,
  routes: t_route[]
): null | t_route {
  let result: null | t_route = null;
  // init path
  const format = formatPath(path, search);
  path = format.path;
  const fullPath = format.fullPath;
  const currentPathArr = format.arr;
  const currentPathLen = currentPathArr.length;
  const currentPathSet = new Set();
  currentPathArr.forEach((d) => {
    currentPathSet.add(d);
  });

  // each routes
  for (const route of routes) {
    const _format = formatPath(route.path, route.search);
    const _path = _format.path;
    const _fullPath = _format.fullPath;
    if (matchStr(_fullPath, fullPath)) {
      return route;
    }
    if (matchStr(_path, path)) {
      result = route;
    }
    const routeArr = _format.arr;
    const routeLen = routeArr.length;
    if (routeLen >= currentPathLen) {
      continue;
    }

    const children = route.children;
    let index = 0;
    for (const d of currentPathArr) {
      const r = routeArr[index];
      if (!r && children && children.length) {
        const rr = matchRoute(
          currentPathArr.slice(index).join("/"),
          search,
          children
        );
        rr && (result = rr);
      }
      if (!matchStr(r, d)) {
        break;
      }
      result = route;
      if (index >= currentPathLen) {
        break;
      }
      index++;
    }
  }
  return result;
}
