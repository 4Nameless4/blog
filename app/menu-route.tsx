"use client";
import type { MenuProps } from "antd";
import { Dropdown } from "antd";
import Link from "next/link";

const items: MenuProps["items"] = [
  {
    key: "login",
    label: <Link href="/login">login</Link>,
  },
  {
    key: "resume",
    label: <Link href="/resume">resume</Link>,
  },
  {
    key: "chatroom",
    label: <Link href="/chatroom">chatroom</Link>,
  },
  {
    key: "shop",
    label: <Link href="/shop">shop</Link>,
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
