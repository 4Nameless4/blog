"use client";
import style from "./page.module.css";
import { useEffect, useRef, useState } from "react";
import { t_result, t_token_user, t_user } from "@/common/types";
import { aesEncode2base64, base642aesDecode } from "@/common/crypto";
import { useStoreState } from "@/common/store";

interface t_msg {
  time: string;
  user: t_user;
  value: string;
}

function linkWebsocketServer(props: string = "") {
  "use client";
  const server = process.env.SERVER || "http://localhost:14513";
  let wsUrl = "";
  const scheme = document.location.protocol === "https:" ? "wss" : "ws";
  wsUrl = server.replace(/https?:/, scheme + ":") + "/Websocket/link";

  const ws = new WebSocket(wsUrl + props);
  return ws;
}

function renderUserList(users: t_user[], me: t_user | null | false) {
  return users.map((d) => {
    let className = style["user-item"];
    if (me && d.uuid === me.uuid) {
      className += " " + style["me"];
    }
    return (
      <li key={d.uuid} className={className}>
        {d.nickname}
      </li>
    );
  });
}

function renderMSGList(messages: t_msg[], me: t_user | null | false) {
  const msgList = messages.map((d) => {
    let className = style["msg-item"];
    if (me && d.user.uuid === me.uuid) {
      className += " " + style["me"];
    }
    return (
      <div key={String(d.time) + d.user.uuid} className={className}>
        <span className={style["user-icon"]}></span>
        <div className={style["msg-box"]}>
          <span className={style["msg"]}>{d.value}</span>
        </div>
      </div>
    );
  });
  return msgList;
}

export default function ChatRoomPage() {
  const user = useStoreState<t_token_user>("user");
  // const [me, setMe] = useState<null | t_user>(null);
  const [users, setUsers] = useState<t_user[]>([]);
  const [messages, setMsg] = useState<t_msg[]>([]);
  const [ws, setWs] = useState<WebSocket | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (!user) return;
    let ws: WebSocket;

    ws = linkWebsocketServer(`?uuid=${user.uuid}`);
    ws.addEventListener("message", (event) => {
      const value = base642aesDecode(event.data);
      const result: t_result<unknown> = JSON.parse(value);

      if (result.code === "1") {
        const data = result.data as t_msg;
        setMsg((msg) => {
          const newMsg = msg.slice(0);
          newMsg.push(data);
          return newMsg;
        });
      } else if (result.code === "2") {
        const data = result.data as t_user[];
        setUsers(data);
      } else {
        console.error("Unknown message type");
      }
    });

    setWs(ws);

    return () => {
      ws && ws.close();
      setWs(null);
    };
  }, [user]);

  function sendMsg() {
    const input = inputRef.current;
    if (!input || !ws || ws.readyState !== WebSocket.OPEN || !user) return;
    const value = aesEncode2base64(
      JSON.stringify({ user: user.uuid, value: input.value })
    );
    const StrUTF8ByteLength = 1024 * 4;
    const encoder = new TextEncoder();
    const length = encoder.encode(value).byteLength;

    if (length >= StrUTF8ByteLength) return;
    ws.send(value);
    input.value = "";
  }

  return (
    <section className={`${style["chat-room-root"]} w-full h-full`}>
      <div className={style["chat-aside"]}>
        <ul className={style["user-list"]}>{renderUserList(users, user)}</ul>
      </div>
      <div className={style["chat-main"]}>
        <div className={style["msg-list"]}>{renderMSGList(messages, user)}</div>
        <div>
          <div>
            <input ref={inputRef}></input>
            <button onClick={sendMsg}>send</button>
          </div>
        </div>
      </div>
    </section>
  );
}
