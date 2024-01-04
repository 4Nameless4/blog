"use client";
import { useEffect, useRef, useState } from "react";
import { t_user } from "@/common/types";
import { linkWebsocketServer } from "@/common/api";
import { getUser } from "@/common/user";
import { redirect } from "next/navigation";
import style from "./page.module.css";

interface t_msg {
  time: number;
  user: t_user;
  msg: string;
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

function renderInput(onclick: () => void) {
  return (
    <div>
      <input></input>
      <button onClick={onclick}>send</button>
    </div>
  );
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
    // const ws = linkWebsocketServer();
    // ws.addEventListener("message", (event) => {
    //   console.log("server message");
    //   console.log(event);
    //   // setMsg((msg) => {
    //   //   msg.push({
    //   //     user: { uuid: "asd", nickname: "", name: "" },
    //   //     time: 0,
    //   //     msg: "11111",
    //   //   });
    //   //   return msg.concat([]);
    //   // });
    // });
    // setWs(ws);
    // return () => {
    //   ws.close();
    // };
  }, []);

  return (
    <section className={`${style["chat-room-page"]} w-full h-full`}>
      <div className={style["chat-aside"]}>
        <ul>{renderUserList(users, me)}</ul>
      </div>
      <div className={style["chat-body"]}>
        <div className={style["msg-body"]}>{renderMSGList(messages, me)}</div>
        <div>
          {renderInput(() => {
            const input = inputRef.current;
            if (!input || !ws) return;
            ws.send(input.value);
            input.value = "";
          })}
        </div>
      </div>
    </section>
  );
}
