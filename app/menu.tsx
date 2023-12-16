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
        <Link href="/resume">
          <UseSVG name="file-lines" />
        </Link>
        <Link href="/shop">
          <UseSVG name="shopify" />
        </Link>
        <Link href="/chatroom">
          <UseSVG name="comments" />
        </Link>
      </div>
    </div>
  );
}
