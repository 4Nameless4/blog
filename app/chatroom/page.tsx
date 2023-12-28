"use client";
import { useEffect, useRef, useState } from "react";
import { t_user, createTempUser } from "../../components/user";

interface t_msg {
  time: number;
  user: t_user;
  msg: string;
}

function renderUserList(users: t_user[], me: t_user | null) {
  const userList = users.map((d) => {
    let className = "";
    if (me && d.uuid === me.uuid) {
      className = "me";
    }
    return <li key={d.uuid}>{d.nickname}</li>;
  });
  return userList;
}

function renderMSGList(messages: t_msg[], me: t_user | null) {
  const msgList = messages.map((d) => {
    let className = "";
    if (me && d.user.uuid === me.uuid) {
      className = "me";
    }
    return (
      <p key={String(d.time)} className={className}>
        {d.msg}
      </p>
    );
  });
  return msgList;
}

export default function ChatRoomPage() {
  const [me, setMe] = useState<null | t_user>(null);
  const [users, setUsers] = useState<t_user[]>([]);
  const [messages, setMsg] = useState<t_msg[]>([]);
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    setMe(createTempUser());

    // const ws = new WebSocket("ws://localhost:6060");
    // ws.addEventListener("message", (event) => {
    //   console.log("message");
    //   // setMsg((msg) => {
    //   //   msg.push({
    //   //     user: { uuid: "asd", nickname: "", name: "" },
    //   //     time: 0,
    //   //     msg: "11111",
    //   //   });
    //   //   return msg.concat([]);
    //   // });
    // });
    // return () => {
    //   ws.close();
    // };
  }, []);

  return (
    <section className="ChatRoomPage">
      <input></input>
      <button
        onClick={() => {
          // const input = inputRef.current;
          // if (!input) return;
          // ws.send(input.value);
          // input.value = "";
        }}
      >
        send
      </button>
      <div>
        <ul>{renderUserList(users, me)}</ul>
      </div>
      <div>{renderMSGList(messages, me)}</div>
    </section>
  );
}
