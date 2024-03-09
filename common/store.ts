import { Provider, createContext, useContext, useState } from "react";
import { t_loading_stack } from "./types";

type t_store = {
  state: Record<string, any>;
  setState: (key: string, val: any) => void;
};
const store: Record<string, any> = {
  loadingStack: {},
};
const context = createContext<t_store>({} as any);

const __Store: t_store = {} as any;

export function CreateStore(): {
  Provider: Provider<t_store>;
  store: t_store;
} {
  const [state, setState] = useState(store);

  const obj = {
    Provider: context.Provider,
    store: {
      state: state,
      setState: (key: string, val: any) => {
        const old = state[key];
        if (typeof val === "function") {
          val = val(old);
        }
        if (old === val) return;
        setState({
          ...state,
          [key]: val,
        });
      },
    },
  };
  Object.assign(__Store, obj.store);

  return obj;
}

export function useStore() {
  return __Store;
}

export function setState(key: string, val: any) {
  return __Store.setState(key, val);
}

export function setStateLoading(
  name: string,
  promise: Promise<any>,
  remove: boolean = false
) {
  setState("loadingStack", (old: t_loading_stack) => {
    if (!remove) {
      old[name] = promise;
    } else if (promise === old[name]) {
      delete old[name];
    } else {
      return old;
    }
    return {
      ...old,
    };
  });
}
