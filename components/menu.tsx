import Link from "next/link";
import style from "./menu.module.css";
import UseSVG from "./usesvg";

export default function Menu() {
  return (
    <div className={style.root}>
      <Link href="/" className={style.btn}>
        <UseSVG name="house" />
      </Link>
      <div className={style.list}>
        <Link href="/article">
          <UseSVG name="github" />
        </Link>
        <Link href="/resume">
          <UseSVG name="file-lines" />
        </Link>
        <Link href="/shop">
          <UseSVG name="shopify" />
        </Link>
        <Link href="/chatroom">
          <UseSVG name="comments" />
        </Link>
        <Link href="/login">
          <UseSVG name="user" />
        </Link>
        <Link href="https://github.com/4Nameless4">
          <UseSVG name="github" />
        </Link>
      </div>
    </div>
  );
}
