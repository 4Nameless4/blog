// "use client";
import Button from "antd/es/button";
import style from "./page.module.css";
import Link from "next/link";
import { getArticleList } from "@/common/api";
import { t_article_view } from "@/common/types";
import { formatDate } from "@/common/utils";
import { PlusOutlined } from "@ant-design/icons";

function renderActicleList(list: t_article_view[] | null | false | undefined) {
  if (list) {
    const itemClass = style["item"];
    return list.map((d) => {
      const date = new Date(d.updateTime);
      return (
        <Link
          key={d.id + d.userID}
          className={itemClass}
          href={`/article/${d.id}`}
        >
          <h2 className={style["item-title"]}>{d.title}</h2>
          <p className={style["item-content"]}>{d.content}</p>
          <div className={style["item-info"]}>
            <span>{d.user.nickname}</span>
            <span>{formatDate(date)}</span>
          </div>
        </Link>
      );
    });
  }

  return null;
}

export default async function ArticleOverviewPage() {
  const list = await getArticleList();

  return (
    <div className={style["article-overview-page-root"]}>
      <div className={style["overview-top-bar"]}>
        <span className={style["overview-title"]}>ArticleOverview</span>
      </div>
      <section className={style["grid-container"]}>
        <div className={`${style["item"]} ${style["item-new"]}`}>
          <Button
            type="primary"
            className={style["new-btn"]}
            title="Create new"
          >
            <Link
              className={`${style["item"]} ${style["item-new"]}`}
              href="/article/new"
            >
              <PlusOutlined className={style["new-btn-icon"]} />
            </Link>
          </Button>
        </div>
        {renderActicleList(list)}
      </section>
    </div>
  );
}
