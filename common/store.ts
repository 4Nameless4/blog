import { Provider, createContext, useContext, useState } from "react";

type t_store = {
  state: Record<string, any>;
  setState: (key: string, val: any) => void;
};
const store: Record<string, any> = {
  user: null,
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

export function setStoreState(key: string, val: any) {
  return __Store.setState(key, val);
}

export function readStoreState<T>(key: string): T {
  return __Store.state[key];
}

export function useStoreState<T>(key: string): T {
  const store = useContext(context);
  return store.state[key];
}
