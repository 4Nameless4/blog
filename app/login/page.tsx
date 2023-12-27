"use client";
import { Button, Tabs } from "antd";
import style from "./style.module.css";
import { MutableRefObject, useEffect, useRef, useState } from "react";
import { PoweroffOutlined } from "@ant-design/icons";
import { t_user } from "../user";

async function signin(user: t_user) {
  const res = await fetch(process.env.SERVER + "/user/signin", {
    body: JSON.stringify(user),
  });
  return res.json();
}
async function check(user: t_user) {
  const res = await fetch(process.env.SERVER + "/user/check", {
    body: JSON.stringify(user),
  });
  return res.json();
}
async function signup(user: t_user) {
  const res = await fetch(process.env.SERVER + "/user/signup", {
    body: JSON.stringify(user),
  });
  return res.json();
}

export default function Home() {
  const [active, setActive] = useState(true);
  const nameRef = useRef(null);
  const pwdRef = useRef(null);
  const nickNameRef = useRef(null);
  const [loading, setLoading] = useState(false);

  function login() {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 2000);
  }

  useEffect(() => {
    const signalController = new AbortController();
    window.addEventListener(
      "keyup",
      (e) => {
        if (e.altKey || e.shiftKey || e.ctrlKey) return;
        if (e.code === "Enter") {
          // TODO
          login();
        }
      },
      { signal: signalController.signal }
    );
    return () => {
      signalController.abort();
    };
  }, []);
  function activeTab(active: boolean) {
    setActive(active);
  }
  function renderInput(ref: MutableRefObject<any>, placeholder: string) {
    return (
      <div className={style.textInputContainer}>
        <input
          ref={ref}
          placeholder={placeholder}
          className={style.textInput}
        ></input>
      </div>
    );
  }
  function renderView() {
    return (
      <div
        className={`flex justify-center items-center flex-col ${style.view}`}
      >
        {renderInput(nameRef, "Entry Name")}
        {renderInput(pwdRef, "Entry Password")}
        {active ? renderInput(nickNameRef, "Entry Nickname") : null}
      </div>
    );
  }
  return (
    <section className="w-full h-full flex justify-center items-center">
      <div
        className={`${style.card} backdrop-blur p-8 rounded shadow-lg rounded-xl overflow-hidden`}
      >
        <div className={style.tabs}>
          <div
            className={`${style.tab} ${active ? style.active : ""}`}
            onClick={() => activeTab(true)}
          >
            In
          </div>
          <div className={style.tabCenter}>Sign</div>
          <div
            className={`${style.tab} ${!active ? style.active : ""}`}
            onClick={() => activeTab(false)}
          >
            Up
          </div>
        </div>
        {renderView()}
        <div className={style.btnContainer}>
          <Button
            type="primary"
            icon={
              <div className={style.icon}>
                <PoweroffOutlined />
              </div>
            }
            onClick={login}
            loading={loading}
            className={style.btn}
          />
        </div>
      </div>
    </section>
  );
}
