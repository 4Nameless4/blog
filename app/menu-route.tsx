"use client";
import type { MenuProps } from "antd";
import { Dropdown } from "antd";
import Link from "next/link";

const items: MenuProps["items"] = [
  {
    key: "chatroom",
    label: (
      <Link href="/chatroom">
        <i className="fa-solid fa-comments">聊天室</i>
      </Link>
    ),
  },
  {
    key: "shop",
    label: (
      <Link href="/shop">
        <i className="fa-solid fa-cart-shopping">商店</i>
      </Link>
    ),
  },
];

export default function MenuRoute() {
  return (
    <aside>
      <Dropdown menu={{ items }} trigger={["click"]}>
        <i className="fa-solid fa-bars cursor-pointer icon"></i>
      </Dropdown>
    </aside>
  );
}
