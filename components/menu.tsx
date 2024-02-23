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
        <Link href="/login" title="login">
          <UseSVG name="user" />
        </Link>
        <Link href="/article" title="article">
          <UseSVG name="article" />
        </Link>
        <Link href="/resume" title="resume">
          <UseSVG name="file-lines" />
        </Link>
        <Link href="/shop" title="shop">
          <UseSVG name="shopify" />
        </Link>
        <Link href="/chatroom" title="chatroom">
          <UseSVG name="comments" />
        </Link>
        <Link href="https://github.com/4Nameless4" title="github">
          <UseSVG name="github" />
        </Link>
      </div>
    </div>
  );
}
