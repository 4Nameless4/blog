"use client";
import style from "./page.module.css";
import { Button } from "antd";
import { useEffect, useState } from "react";
import { PoweroffOutlined } from "@ant-design/icons";
import MyInput, {
  t_myinput_return_status,
  t_myinput_status,
} from "@/components/MyInput";
import UseSVG from "@/components/usesvg";
import { fetchJSON, getUser } from "@/common/utils";
import { clearLocalUser, getLocalUser, setLocalUser } from "@/common/user";
import { t_user } from "@/common/types";

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
  const [msg, setMsg] = useState("");
  const [user, setUser] = useState<null | t_user>(null);
  const [active, setActive] = useState<boolean>(true);
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

  async function login(err: string) {
    let result = "";
    const { data: user } = await fetchJSON(
      "/user",
      { type: "login", data: { name, pwd } },
      { method: "POST" }
    );
    if (user) {
      setUser(user);
      setLocalUser(user, user.token);
      setActive(true);
    } else {
      result = err;
    }
    return result;
  }

  async function clearInput(type: "all" | "password" = "all") {
    if (type === "all") {
      setName("");
      setNickname("");
    }
    setPwd("");
  }

  async function click() {
    let result = "";
    setLoading(true);
    if (!check) return;
    if (active) {
      result = await login("用户名或密码错误");
    } else {
      const { data: msg } = await fetchJSON(
        "/user",
        { type: "signup", data: { name, nickname, pwd } },
        { method: "POST" }
      );
      if (msg) {
        result = await login("注册登陆失败");
      } else {
        result = "已存在用户名";
      }
    }
    clearInput(!result ? "all" : "password");

    setMsg(result);
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
  useEffect(() => {
    getUser().then((d) => {
      if (d) {
        setUser(d);
      }
    });
  }, []);

  function renderInfo() {
    if (!user) return null;
    return (
      <>
        <div>
          <span className={style["user-icon"]} title={user.nickname}>
            {user.nickname.split("")[0]}
          </span>
          <div className={style["user-info"]}>
            <span className={style["user-uuid"]}>UUID: {user.uuid}</span>
            <span className={style["user-name"]}>Account: {user.name}</span>
            <span className={style["user-role"]}>Level: {user.role}</span>
          </div>
        </div>

        <Button
          type="primary"
          title="Logout"
          icon={<PoweroffOutlined />}
          onClick={() => {
            const user = getLocalUser();
            if (user) {
              fetchJSON(
                "user",
                { type: "logout", data: user.token },
                { method: "POST" }
              );
            }
            clearLocalUser();
            setUser(null);
          }}
          className={style["logout-btn"]}
        />
      </>
    );
  }

  function renderSign(isSignUp: boolean) {
    const isBind = active !== isSignUp;
    return (
      <>
        <MyInput
          value={name}
          label="User name"
          innerLabel={"username" + String(isSignUp)}
          placeholder="Entry User Name"
          require={isSignUp}
          onChange={(val) => {
            if (!isBind) return;
            setName(val);
            return (isSignUp && nameCheck(val)) || void 0;
          }}
          icon={<UseSVG name="user2"></UseSVG>}
        />

        <MyInput
          value={pwd}
          label="Password"
          innerLabel={"password" + String(isSignUp)}
          placeholder="Entry Password"
          type="password"
          require={isSignUp}
          onChange={(val) => {
            if (!isBind) return;
            setPwd(val);
            return (isSignUp && pwdCheck(val)) || void 0;
          }}
          icon={<UseSVG name="password"></UseSVG>}
        />

        {isSignUp ? (
          <MyInput
            value={nickname}
            label="Nickname"
            innerLabel={"nickname" + String(isSignUp)}
            placeholder="Entry Nickname"
            require={isSignUp}
            onChange={(val) => {
              if (!isBind) return;
              setNickname(val);
              return (isSignUp && nicknameCheck(val)) || void 0;
            }}
          />
        ) : null}
      </>
    );
  }

  function renderView(type: "in" | "up" | "info" = "in") {
    const isInfo = type === "info";
    const isUp = type === "up";
    return (
      <div className={`${style.viewport}`}>
        <form className={`${style["view-size"]} ${style.view}`}>
          <h3 className={style.title}>
            {isInfo ? "User info" : !isUp ? "Sign in" : "Sign up"}
          </h3>
          {isInfo ? renderInfo() : renderSign(isUp)}
        </form>
      </div>
    );
  }
  function renderBtn() {
    if (user && active) return null;
    return (
      <div className={style["btn-container"]}>
        <Button
          type="primary"
          disabled={!check}
          icon={
            <div className={style["btn-icon"]}>
              <PoweroffOutlined />
            </div>
          }
          onClick={click}
          loading={loading}
          className={style.btn}
        />
      </div>
    );
  }

  return (
    <section
      className={`viewbox ${
        style["login-page-root"]
      } w-full h-full flex justify-center items-center flex-col ${
        active ? style["active"] : ""
      }`}
    >
      <div
        className={`${style.card} backdrop-blur p-8 rounded shadow-lg rounded-xl overflow-hidden relative`}
      >
        <div
          className={style.tab}
          onClick={() => setActive(!active)}
          title={active ? "Check to Sign Up" : "Check to Sign In"}
        >
          <UseSVG name={active ? "signup" : "signin"} />
        </div>
        <div className={`${style["view-size"]} relative`}>
          {renderView(user ? "info" : "in")}
          {renderView("up")}
        </div>
        {renderBtn()}
      </div>
      <div className={style.message}>
        <span>{msg}</span>
      </div>
    </section>
  );
}
