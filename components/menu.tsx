import Link from "next/link";
import style from "./menu.module.css";
import UseSVG from "./usesvg";
import { routeArr, t_route } from "@/common/router";

function createRouteItem(route: t_route) {
  const { path, icon, title = "" } = route;
  return (
    <Link
      key={path}
      href={path}
      className={style.btn}
      title={title}
    >
      {icon ? <UseSVG name={icon} /> : null}
    </Link>
  );
}

export default function Menu() {
  const len = routeArr.length;

  const items: JSX.Element[] = [];
  for (let i = 1; i < len; i++) {
    items.push(createRouteItem(routeArr[i]));
  }

  return (
    <div className={style.root}>
      {createRouteItem(routeArr[0])}
      <div className={style.list}>
        {items}
        {createRouteItem({
          path: "https://github.com/4Nameless4",
          icon: "github",
          title: "Github",
        })}
      </div>
    </div>
  );
}
