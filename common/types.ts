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
