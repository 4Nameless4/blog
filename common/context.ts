"use client";
import { createContext } from "react";
import { t_token_user } from "./types";

export const UserContext = createContext<null | t_token_user>(null);
