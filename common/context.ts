"use client";
import { Dispatch, SetStateAction, createContext, useContext } from "react";
import { t_token_user } from "./types";

export const UserContext = createContext<
  | readonly [
      t_token_user | null,
      Dispatch<SetStateAction<t_token_user | null>>
    ]
  | null
>(null);

export function useUserContext() {
  return useContext(UserContext) || [null, () => {}];
}
