export type t_user = {
  uuid: string;
  name: string;
  nickname: string;
  role: number; // admin user
  email?: string;
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
  create_time: number;
  update_time: number;
  user_id: string;
  view_count: number;
  types: string;
};

export type t_article_type = {
  id: string,
  name: string
};

export type t_article_view = t_article & {
  user: t_user;
  typesArr: t_article_type[];
};
