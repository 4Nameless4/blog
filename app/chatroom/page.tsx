"use client";
import { MutableRefObject, useEffect, useRef, useState } from "react";
import { t_user } from "@/common/types";
import { getUser } from "@/common/user";
import { redirect } from "next/navigation";
import style from "./page.module.css";
import { aesEncode2base64, base642aesDecode } from "@/common/utils";

interface t_msg {
  time: number;
  user: t_user;
  msg: string;
}

function linkWebsocketServer() {
  "use client";
  const server = process.env.SERVER || "http://localhost:14513";
  let wsUrl = "";
  const scheme = document.location.protocol === "https:" ? "wss" : "ws";
  wsUrl = server.replace(/https?:/, scheme + ":") + "/chatroom/ws";

  console.log(wsUrl);
  const ws = new WebSocket(wsUrl);
  return ws;
}

function renderUserList(users: t_user[], me: t_user | null) {
  const userList = users.map((d) => {
    let className = style["user-info-item"];
    if (me && d.uuid === me.uuid) {
      className += " " + style["me"];
    }
    return (
      <li key={d.uuid} className={className}>
        {d.nickname}
      </li>
    );
  });
  return userList;
}

function renderMSGList(messages: t_msg[], me: t_user | null) {
  const msgList = messages.map((d) => {
    let className = style["msg-item"];
    if (me && d.user.uuid === me.uuid) {
      className += " " + style["me"];
    }
    return (
      <div key={String(d.time)} className={className}>
        <span className={style["user-icon"]}></span>
        <div className={style["msg-box"]}>
          <span>{d.msg}</span>
        </div>
      </div>
    );
  });
  return msgList;
}

function renderInput(
  inputRef: MutableRefObject<HTMLInputElement | null>,
  onclick: () => void
) {
  return (
    <div>
      <input ref={inputRef}></input>
      <button onClick={onclick}>send</button>
    </div>
  );
}
function getUTF8ByteLength(str: string) {
  const encoder = new TextEncoder();
  return encoder.encode(str).byteLength;
}
function isLimit(str: string) {
  const StrUTF8ByteLength = 1024 * 4;
  const length = getUTF8ByteLength(str);

  return length >= StrUTF8ByteLength;
}
export default function ChatRoomPage() {
  const [me, setMe] = useState<null | t_user>(null);
  const [users, setUsers] = useState<t_user[]>([]);
  const [messages, setMsg] = useState<t_msg[]>([]);
  const [ws, setWs] = useState<WebSocket | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    // getUser().then((d) => {
    //   if (!d) {
    //     redirect("/login");
    //   }
    // });
    const me = {
      uuid: "9999",
      name: "me",
      nickname: "me",
      role: "normal",
    };
    setMe(me);

    let users: t_user[] = [me];
    for (let i = 0; i < 10; i++) {
      users.push({
        uuid: String(i),
        name: "user" + i,
        nickname: "user" + i,
        role: "normal",
      });
    }
    setUsers(users);
    let msg: t_msg[] = [];
    for (let i = 0; i < 10; i++) {
      msg.push({
        time: Date.now() + 1000 * i,
        user: users[i],
        msg: "test msg" + i,
      });
    }
    msg.push({
      time: Date.now() + 1000 * 20 * 60,
      user: me,
      msg: "me msg",
    });
    setMsg(msg);

    // setMe(createTempUser());
    const ws = linkWebsocketServer();
    ws.addEventListener("message", (event) => {
      const value = base642aesDecode(event.data);
      console.log("server message");
      console.log(event);
      console.log(event.data);
      console.log(value);
      setMsg((msg) => {
        msg.push({
          user: { uuid: "asd", nickname: "", name: "", role: "user" },
          time: 0,
          msg: "11111",
        });
        return msg.concat([]);
      });
    });
    setWs(ws);
    return () => {
      ws.close();
      setWs(null);
    };
  }, []);

  return (
    <section className={`${style["chat-room-page"]} w-full h-full`}>
      <div className={style["chat-aside"]}>
        <ul>{renderUserList(users, me)}</ul>
      </div>
      <div className={style["chat-body"]}>
        <div className={style["msg-body"]}>{renderMSGList(messages, me)}</div>
        <div>
          {renderInput(inputRef, () => {
            const input = inputRef.current;
            if (!input || !ws || ws.readyState !== WebSocket.OPEN || !me)
              return;
            const value = aesEncode2base64(
              JSON.stringify({ from: me.uuid, value: input.value })
            );
            console.log("Send");
            console.log({ from: me.uuid, value: input.value });
            ws.send(value);
            input.value = "";
          })}
        </div>
      </div>
    </section>
  );
}
