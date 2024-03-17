"use client";
import Button from "antd/es/button";
import style from "./page.module.css";
import Link from "next/link";
import { getArticleList } from "@/common/api";
import { t_article_view, t_token_user } from "@/common/types";
import { formatDate } from "@/common/utils";
import { PlusOutlined, EditOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import { TextTitle } from "@/components/text_title";
import { useStoreState } from "@/common/store";

function renderActicleList(
  list: t_article_view[] | null | false | undefined,
  props: { hasUser?: boolean } = {}
) {
  const editBtn = props.hasUser
    ? (d: t_article_view) => (
        <Button
          className={style["edit-btn"]}
          title="Edit article"
          shape="circle"
        >
          <Link href={`/article/${d.id}?type=edit`}>
            <EditOutlined />
          </Link>
        </Button>
      )
    : null;

  if (list) {
    return list.map((d) => {
      const date = new Date(d.updateTime);
      return (
        <div className={style["item"]} key={d.id + d.userID}>
          <Link className={style["item-card"]} href={`/article/${d.id}`}>
            <h2>
              <TextTitle str={d.title} />
            </h2>
            <p className={style["item-content"]}>
              <TextTitle str={d.content} />
            </p>
            <div className={style["item-info"]}>
              <span>{d.user.nickname}</span>
              <span>{formatDate(date)}</span>
            </div>
          </Link>
          {editBtn && editBtn(d)}
        </div>
      );
    });
  }

  return null;
}

function renderCreateBtn() {
  return (
    <div className={`${style["item-new"]}`}>
      <Link href="/article/new">
        <Button type="primary" className={style["new-btn"]} title="Create new">
          <PlusOutlined />
        </Button>
      </Link>
    </div>
  );
}

export default function ArticleOverviewPage() {
  const [list, setList] = useState<null | t_article_view[]>(null);
  const user = useStoreState<t_token_user>("user");

  useEffect(() => {
    getArticleList().then((_l) => {
      setList(_l);
      // setUser(_u);
    });
  }, []);

  return (
    <div className={style["article-overview-page-root"]}>
      <div className={style["overview-top-bar"]}>
        <TextTitle str="ArticleOverview" />
      </div>
      <section className={style["grid-container"]}>
        {user ? renderCreateBtn() : null}
        {renderActicleList(list, { hasUser: !!user })}
      </section>
    </div>
  );
}
