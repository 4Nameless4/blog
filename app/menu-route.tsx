"use client";
import type { MenuProps } from "antd";
import { Dropdown } from "antd";
import Link from "next/link";

const items: MenuProps["items"] = [
  {
    key: "resume",
    label: <Link href="/resume">简历</Link>,
  },
  {
    key: "chatroom",
    label: <Link href="/chatroom">聊天室</Link>,
  },
  {
    key: "shop",
    label: <Link href="/shop">商店</Link>,
  },
];

export default function MenuRoute() {
  return (
    <aside>
      <Dropdown menu={{ items }}>
        <i className="fa-solid fa-bars cursor-pointer icon"></i>
      </Dropdown>
    </aside>
  );
}
