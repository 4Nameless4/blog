// "use client";
import Button from "antd/es/button";
import style from "./page.module.css";
import Link from "next/link";
import { getArticleList } from "@/common/api";
import { t_article_view } from "@/common/types";

function renderActicleList(list: t_article_view[] | null | false | undefined) {
  if (list) {
    const itemClass = style["item"];
    return list.map((d) => {
      return (
        <div key={d.id + d.user_id} className={itemClass}>
          <span>{d.title}</span>
          <p>{d.content}</p>
          <div>
            <span>{d.update_time}</span>
            <span>{d.user.nickname}</span>
            <span>{d.view_count}</span>
          </div>
        </div>
      );
    });
  }

  return null;
}

export default async function ArticleOverviewPage() {
  const list = await getArticleList();

  return (
    <div className={style["article-overview-page-root"]}>
      ArticleOverview
      <Button title="New">
        <Link href="/article/new">New</Link>
      </Button>
      <section className={style["grid-container"]}>
        {renderActicleList(list)}
      </section>
    </div>
  );
}
