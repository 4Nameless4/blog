import {
  t_article,
  t_article_view,
  t_result,
  t_token_user,
  t_user,
} from "./types";
import { aesEncode2base64, base642aesDecode } from "./utils";

export async function request(api: string, data: string) {
  const res = await fetch(process.env.SERVER + api, {
    method: "POST",
    mode: "cors",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json;charset=utf-8",
    },
    body: JSON.stringify(aesEncode2base64(data)),
  });
  return base642aesDecode(await res.json());
}
export async function requestGet(api: string) {
  const res = await fetch(process.env.SERVER + api, {
    method: "GET",
    mode: "cors",
  });
  return base642aesDecode(await res.text());
}
export async function logout(token: string) {
  return request("/User/logout", token);
}
export async function signin(name: string, pwd: string) {
  const result = await request("/User/signin", JSON.stringify({ name, pwd }));
  let info: false | t_token_user = false;
  const resultJson: t_result<t_token_user> = JSON.parse(result);
  if (resultJson.code === "1") {
    info = resultJson.data;
  }
  return info;
}
export async function checkUser(token: string) {
  const result = await request("/User/check", token);
  let info: false | t_user = false;
  const resultJson: t_result<t_token_user> = JSON.parse(result);
  if (resultJson.code === "1") {
    info = resultJson.data;
  }
  return info;
}
export async function signup(name: string, pwd: string, nickname: string) {
  const result = await request(
    "/User/signup",
    JSON.stringify({ name, nickname, pwd })
  );
  let info: boolean = false;
  const resultJson: t_result<boolean> = JSON.parse(result);
  if (resultJson.code === "1") {
    info = resultJson.data;
  }
  return info;
}
export async function getResume() {
  return await Promise.all([
    fetch(process.env.StaticSERVER + "/resumeinfo").then((r) => r.text()),
    fetch(process.env.StaticSERVER + "/resumeTemplate.docx").then((r) =>
      r.blob()
    ),
  ]);
}
export async function getArticle(id: string) {
  const result = await requestGet(`/Article/get?id=${id}`);

  let info: false | t_article_view = false;
  const resultJson: t_result<t_article_view> = JSON.parse(result);
  if (resultJson.code === "1") {
    info = resultJson.data;
  }
  return info;
}
export async function getArticleList() {
  const result = await requestGet(`/Article/getAll`);

  let info: false | t_article_view[] = false;
  const resultJson: t_result<t_article_view[]> = JSON.parse(result);
  if (resultJson.code === "1") {
    info = resultJson.data;
  }
  return info;
}
export async function createArticle(
  article: Omit<t_article, "id" | "create_time" | "update_time" | "view_count">
) {
  const result = await request(`/Article/create`, JSON.stringify(article));

  let info: false | t_article_view[] = false;
  const resultJson: t_result<t_article_view[]> = JSON.parse(result);
  if (resultJson.code === "1") {
    info = resultJson.data;
  }
  return info;
}
export async function updateArticle(
  article: Omit<t_article, "create_time" | "update_time" | "view_count">
) {
  const result = await request(`/Article/update`, JSON.stringify(article));

  let info: false | t_article_view[] = false;
  const resultJson: t_result<t_article_view[]> = JSON.parse(result);
  if (resultJson.code === "1") {
    info = resultJson.data;
  }
  return info;
}
export async function deleteArticle(articleID: string, userToken: string) {
  const result = await request(
    `/Article/delete`,
    JSON.stringify({
      articleID,
      userToken,
    })
  );

  let info: boolean = false;
  const resultJson: t_result<boolean> = JSON.parse(result);
  if (resultJson.code === "1") {
    info = resultJson.data;
  }
  return info;
}
