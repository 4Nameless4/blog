import Link from "next/link";
import style from "./menu.module.css";
import User from "./user";

export default function Menu() {
  return (
    <div className={style.root}>
      <Link href="/" className={style.btn}>
        <img src="house.svg"></img>
      </Link>
      <div className={style.list}>
        <div>
          <Link href="/resume">
            <img src="file-lines.svg"></img>
          </Link>
        </div>
        <div>
          <Link href="/shop">
            <img src="shopify.svg"></img>
          </Link>
        </div>
        <div>
          <Link href="/chatroom">
            <img src="comments.svg"></img>
          </Link>
        </div>
      </div>
    </div>
  );
}
