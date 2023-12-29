"use client";
import { Button } from "antd";
import style from "./page.module.css";
import { useEffect, useMemo, useState } from "react";
import { PoweroffOutlined } from "@ant-design/icons";
import MyInput, {
  t_myinput_return_status,
  t_myinput_status,
} from "../../components/MyInput";
import { signin, signup } from "../../components/api";
import UseSVG from "@/components/usesvg";

function strCheck(size: [number, number], match: RegExp) {
  return (
    val: string
  ): Required<t_myinput_return_status> & { value: string } => {
    let msg = "";
    let status: t_myinput_status = "none";
    if (!val) {
      msg = "Place entry name";
      status = "error";
    } else if (!match.test(val)) {
      msg = "Illegal characters are present";
      status = "error";
    } else if (val.length < size[0] || val.length > size[1]) {
      msg = "The name size is 5 - 16";
      status = "error";
    } else {
      msg = "";
      status = "success";
    }
    return {
      value: val,
      msg,
      status,
    };
  };
}

const nameCheck = strCheck([5, 16], /^[a-zA-Z][a-zA-Z0-9]+$/);
const pwdCheck = strCheck([5, 16], /^[a-zA-Z][a-zA-Z0-9.#@*-+]+$/);
const nicknameCheck = strCheck([5, 16], /^[a-zA-Z][a-zA-Z0-9]+$/);

export default function LoginPage() {
  const [active, setActive] = useState<boolean>(true);
  const [name, setName] = useState<string>("");
  const [pwd, setPwd] = useState<string>("");
  const [nickname, setNickname] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [check, setCheck] = useState(false);
  const isSignUp = !active;

  function checkAll() {
    const n = nameCheck(name);
    const p = pwdCheck(pwd);
    const nc = nicknameCheck(nickname);
    const checkArr = [n, p];

    if (!active) {
      checkArr.push(nc);
    }
    if (
      checkArr.every((d) => {
        if (active) {
          return !!d.value;
        } else {
          return d.status === "success";
        }
      })
    ) {
      setCheck(true);
    } else {
      setCheck(false);
    }
  }

  async function click() {
    setLoading(true);
    if (!check) return;
    if (active) {
      const user = await signin(name, pwd);
      console.log(user);
    } else {
      const msg = await signup(name, nickname, pwd);
      console.log(msg);
    }

    setTimeout(() => setLoading(false), 300);
  }

  useEffect(checkAll, [name, pwd, nickname, active]);
  useEffect(() => {
    const signalController = new AbortController();
    window.addEventListener(
      "keyup",
      (e) => {
        if (e.altKey || e.shiftKey || e.ctrlKey) return;
        if (e.key === "Enter") {
          click();
        }
      },
      { signal: signalController.signal }
    );
    return () => {
      signalController.abort();
    };
  });

  function renderView() {
    return (
      <div
        className={`flex justify-center items-center flex-col ${style.view}`}
      >
        <MyInput
          value={name}
          label="User Name"
          placeholder="Entry User Name"
          require={isSignUp}
          onChange={(val) => {
            setName(val);
            return (isSignUp && nameCheck(val)) || void 0;
          }}
        />

        <MyInput
          value={pwd}
          label="Password"
          placeholder="Entry Password"
          type="password"
          require={isSignUp}
          onChange={(val) => {
            setPwd(val);
            return (isSignUp && pwdCheck(val)) || void 0;
          }}
        />

        {isSignUp ? (
          <MyInput
            value={nickname}
            label="Nickname"
            placeholder="Entry Nickname"
            require={isSignUp}
            onChange={(val) => {
              setNickname(val);
              return (isSignUp && nicknameCheck(val)) || void 0;
            }}
          />
        ) : null}
      </div>
    );
  }
  return (
    <section
      className={`w-full h-full flex justify-center items-center ${
        active ? style.active : ""
      }`}
    >
      <form
        className={`${style.card} backdrop-blur p-8 rounded shadow-lg rounded-xl overflow-hidden`}
      >
        <div
          className={style.tab}
          onClick={() => setActive(!active)}
          title={active ? "Sign Up" : "Sign In"}
        >
          <UseSVG name={active ? "signup" : "signin"} />
        </div>
        {renderView()}
        <div className={style.btnContainer}>
          <Button
            type="primary"
            disabled={!check}
            icon={
              <div className={style.icon}>
                <PoweroffOutlined />
              </div>
            }
            onClick={click}
            loading={loading}
            className={style.btn}
          />
        </div>
      </form>
    </section>
  );
}
