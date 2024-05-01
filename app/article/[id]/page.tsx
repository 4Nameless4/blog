"use client";
import style from "./page.module.css";
import { redirect } from "next/navigation";
import { getArticle } from "@/common/api";
import EditPage from "./editPage";
import { useLoading } from "@/common/hooks";
import { useEffect, useState } from "react";
import ViewPage from "./viewPage";
import { t_article_view, t_token_user } from "@/common/types";
import { useStoreState } from "@/common/store";

export default function ArticlePage(props: {
  params: { id: string };
  searchParams: Record<string, string>;
}) {
  const user = useStoreState<t_token_user>("user");
  const [article, setArticle] = useState<t_article_view | null>(null);
  const articleID = props.params.id;
  const type = props.searchParams.type;

  const { setLoading, render } = useLoading(() => {
    let content = null;
    if (articleID === "new" && !article) {
      content = <EditPage />;
    } else if (type === "edit" && article) {
      content = <EditPage article={article} />;
    } else if (article) {
      content = <ViewPage article={article} editable={!!user} />;
    }
    return <div className={style["article-page-root"]}>{content}</div>;
  });
  useEffect(() => {
    if (articleID === "new") {
      setLoading(false);
    } else {
      getArticle(articleID).then((article) => {
        if (!article) {
          redirect("/article");
        } else {
          setArticle(article);
        }
        setLoading(false);
      });
    }
  }, [articleID, setLoading]);
  return render;
}
