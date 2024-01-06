"use client";
import { MutableRefObject, useEffect, useRef, useState } from "react";
import { t_user } from "@/common/types";
import { getUser } from "@/common/user";
import { useRouter } from "next/navigation";
import style from "./page.module.css";
import { aesEncode2base64, base642aesDecode } from "@/common/utils";
import { t_result } from "@/common/api";

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
  wsUrl = server.replace(/https?:/, scheme + ":") + "/chatroom/ws";

  console.log(wsUrl);
  const ws = new WebSocket(wsUrl + props);
  return ws;
}

function renderUserList(users: t_user[], me: t_user | null) {
  return users.map((d) => {
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
}

function renderMSGList(messages: t_msg[], me: t_user | null) {
  const msgList = messages.map((d) => {
    let className = style["msg-item"];
    if (me && d.user.uuid === me.uuid) {
      className += " " + style["me"];
    }
    return (
      <div key={String(d.time) + d.user.uuid} className={className}>
        <span className={style["user-icon"]}></span>
        <div className={style["msg-box"]}>
          <span>{d.value}</span>
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
  const router = useRouter();
  const [me, setMe] = useState<null | t_user>(null);
  const [users, setUsers] = useState<t_user[]>([]);
  const [messages, setMsg] = useState<t_msg[]>([]);
  const [ws, setWs] = useState<WebSocket | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    let ws: WebSocket;
    getUser().then((d) => {
      if (!d) {
        router.replace("/login");
        return;
      }

      setMe(d);
      ws = linkWebsocketServer(`?uuid=${d.uuid}`);
      ws.addEventListener("message", (event) => {
        const value = base642aesDecode(event.data);
        const result: t_result<unknown> = JSON.parse(value);

        if (result.code === "1") {
          console.log("msg result");
          const data = result.data as t_msg;
          setMsg((msg) => {
            const newMsg = msg.slice(0);
            newMsg.push(data);
            return newMsg;
          });
        } else if (result.code === "2") {
          console.log("user change");
          const data = result.data as t_user[];
          setUsers(data);
        } else {
          console.log("Unknown message type");
        }
        console.log(result);
      });

      setWs(ws);
    });
    // const me = {
    //   uuid: "9999",
    //   name: "me",
    //   nickname: "me",
    //   role: 2,
    // };
    // setMe(me);

    // let users: t_user[] = [me];
    // for (let i = 0; i < 10; i++) {
    //   users.push({
    //     uuid: String(i),
    //     name: "user" + i,
    //     nickname: "user" + i,
    //     role: 2,
    //   });
    // }
    // setUsers(users);
    // let msg: t_msg[] = [];
    // for (let i = 0; i < 10; i++) {
    //   msg.push({
    //     time: String(i),
    //     user: users[i],
    //     value: "test msg" + i,
    //   });
    // }
    // msg.push({
    //   time: String(999),
    //   user: me,
    //   value: "me msg",
    // });
    // setMsg(msg);

    return () => {
      ws && ws.close();
      setWs(null);
    };
  }, [router]);

  return (
    <section className={`${style["chat-room-page"]} w-full h-full viewbox`}>
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
              JSON.stringify({ user: me.uuid, value: input.value })
            );
            if (isLimit(value)) return;
            ws.send(value);
            input.value = "";
          })}
        </div>
      </div>
    </section>
  );
}
