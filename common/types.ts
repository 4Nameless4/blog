import { NextRequest, NextResponse } from "next/server";

export type t_user = {
  uuid: string;
  name: string;
  nickname: string;
  role: number; // admin user
  email?: string;
  createTime: number;
};

export type t_token_user = t_user & { token: string };

export type t_result<T = unknown> = {
  code: string;
  data: T;
  msg: string;
};

export type t_article = {
  id: string;
  title: string;
  content: string;
  createTime: number;
  updateTime: number;
  userID: string;
  viewCount: number;
  types: string;
};

export type t_article_type = {
  id: string;
  name: string;
};

export type t_article_view = t_article & {
  user: t_user;
  typesArr: t_article_type[];
};

type t_callback_return = void | NextResponse;
type t_callback_returns = t_callback_return | Promise<t_callback_return>;
type t_callback = (request: NextRequest, path: string) => t_callback_returns;

export type t_route = {
  path: string;
  icon?: string;
  title?: string;
  callback?: t_callback | t_callback[];
  userRedirect?: string;
  children?: t_route[];
};