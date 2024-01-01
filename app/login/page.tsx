"use client";
import { Button } from "antd";
import style from "./page.module.css";
import { useEffect, useState } from "react";
import { PoweroffOutlined } from "@ant-design/icons";
import MyInput, {
  t_myinput_return_status,
  t_myinput_status,
} from "@/components/MyInput";
import { signin, signup } from "@/common/api";
import UseSVG from "@/components/usesvg";
import { clearLocalUser, getUser, setLocalUser } from "@/common/user";
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
    const user = await signin(name, pwd);
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
      const msg = await signup(name, nickname, pwd);
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
          <span className={style.userIcon} title={user.nickname}>
            {user.nickname.split("")[0]}
          </span>
          <div className={style.userInfo}>
            <span className={style.userUUID}>UUID: {user.uuid}</span>
            <span className={style.userName}>Account: {user.name}</span>
            <span className={style.userRole}>Level: {user.role}</span>
          </div>
        </div>

        <Button
          title="Logout"
          type="primary"
          icon={<PoweroffOutlined />}
          onClick={() => {
            clearLocalUser();
            setUser(null);
          }}
          className={style["logout-btn"]}
        />
      </>
    );
  }

  function renderSign(isSignUp: boolean) {
    return (
      <>
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
      </>
    );
  }

  function renderView() {
    return (
      <div
        className={`flex justify-center items-center flex-col ${style.view}`}
      >
        {user && active ? renderInfo() : renderSign(!active)}
      </div>
    );
  }
  function renderBtn() {
    if (user && active) return null;
    return (
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
    );
  }
  return (
    <section
      className={`w-full h-full flex justify-center items-center flex-col ${
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
        {renderBtn()}
      </form>
      <div className={style.message}>
        <span>{msg}</span>
      </div>
    </section>
  );
}
