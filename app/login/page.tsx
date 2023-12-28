"use client";
import { Button } from "antd";
import style from "./style.module.css";
import { useEffect, useState } from "react";
import { PoweroffOutlined } from "@ant-design/icons";
import MyInput, {
  t_myinput_return_status,
  t_myinput_status,
} from "../../components/MyInput";
import { signin, signup } from "../../components/api";

type t_active_type = "in" | "up";

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
  const [active, setActive] = useState<t_active_type>("in");
  const [name, setName] = useState<string>("");
  const [pwd, setPwd] = useState<string>("");
  const [nickname, setNickname] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [check, setCheck] = useState(false);

  function checkAll() {
    const n = nameCheck(name);
    const p = pwdCheck(pwd);
    const nc = nicknameCheck(nickname);
    const checkArr = [n, p];

    if (active === "up") {
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
      const user = await signin({ name, nickname, token: "", uuid: "0" }, pwd);
      console.log(user);
    } else {
      const msg = await signup({ name, nickname, token: "", uuid: "0" }, pwd);
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
    const require = active === "up";
    return (
      <div
        className={`flex justify-center items-center flex-col ${style.view}`}
      >
        <MyInput
          value={name}
          label="User Name"
          placeholder="Entry User Name"
          require={require}
          onChange={(val) => {
            setName(val);
            return (require && nameCheck(val)) || void 0;
          }}
        />

        <MyInput
          value={pwd}
          label="Password"
          placeholder="Entry Password"
          type="password"
          require={require}
          onChange={(val) => {
            setPwd(val);
            return (require && pwdCheck(val)) || void 0;
          }}
        />

        {active === "up" ? (
          <MyInput
            value={nickname}
            label="Nickname"
            placeholder="Entry Nickname"
            require={require}
            onChange={(val) => {
              setNickname(val);
              return (require && nicknameCheck(val)) || void 0;
            }}
          />
        ) : null}
      </div>
    );
  }
  return (
    <section className="w-full h-full flex justify-center items-center">
      <form
        className={`${style.card} backdrop-blur p-8 rounded shadow-lg rounded-xl overflow-hidden`}
      >
        <div className={style.tabs}>
          <div
            className={`${style.tab} ${active === "in" ? style.active : ""}`}
            onClick={() => setActive("in")}
          >
            In
          </div>
          <div className={style.tabCenter}>Sign</div>
          <div
            className={`${style.tab} ${active === "up" ? style.active : ""}`}
            onClick={() => setActive("up")}
          >
            Up
          </div>
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
