import {
  t_article,
  t_article_type,
  t_article_view,
  t_result,
  t_token_user,
  t_user,
} from "./types";
import { clearLocalUser, getUserToken, request, requestGet, setLocalUser } from "./utils";

export async function logout(token: string) {
  return request("/User/logout", token);
}
export async function signin(name: string, pwd: string) {
  const result = await request("/User/signin", JSON.stringify({ name, pwd }));
  let info: null | t_token_user = null;
  const resultJson: t_result<t_token_user> = JSON.parse(result);
  if (resultJson.code === "1") {
    info = resultJson.data;
  }
  return info;
}
export async function checkUser(token: string) {
  const result = await request("/User/check", token);
  let info: null | t_user = null;
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
  return Promise.all([
    fetch(process.env.StaticSERVER + "/resumeinfo").then((r) => r.json()),
    fetch(process.env.StaticSERVER + "/resumeTemplate.docx")
      .then((r) => r.blob())
      .then((r) => r.arrayBuffer()),
  ]);
}
export async function getArticle(id: string) {
  const result = await requestGet(`/Article/get?id=${id}`);

  let info: null | t_article_view = null;
  const resultJson: t_result<t_article_view> = JSON.parse(result);
  if (resultJson.code === "1") {
    info = resultJson.data;
  }
  return info;
}
export async function getArticleList() {
  const result = await requestGet(`/Article/getAll`);

  let info: null | t_article_view[] = null;
  const resultJson: t_result<t_article_view[]> = JSON.parse(result);
  if (resultJson.code === "1") {
    info = resultJson.data;
  }
  return info;
}
export async function createArticle(
  article: Omit<t_article, "id" | "createTime" | "updateTime" | "viewCount">
) {
  const result = await request(`/Article/create`, JSON.stringify(article));

  let info: null | t_article_view = null;
  const resultJson: t_result<t_article_view> = JSON.parse(result);
  if (resultJson.code === "1") {
    info = resultJson.data;
  }
  return info;
}
export async function updateArticle(
  article: Omit<t_article, "createTime" | "updateTime" | "viewCount">
) {
  const result = await request(`/Article/update`, JSON.stringify(article));

  let info: null | t_article_view[] = null;
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
export async function getArticleTypes() {
  const result = await requestGet(`/Article/types`);

  let info: t_article_type | null = null;
  const resultJson: t_result<t_article_type> = JSON.parse(result);
  if (resultJson.code === "1") {
    info = resultJson.data;
  }
  return info;
}

export async function getUser(): Promise<t_token_user | null> {
  const token = getUserToken();
  let info: t_token_user | null = null;
  if (token) {
    const info = await checkUser(token);
    info && setLocalUser(info, token);
  }
  if (!info) {
    clearLocalUser();
  }
  return info;
}

