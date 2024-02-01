"use client";
import { createArticle, deleteArticle, updateArticle } from "@/common/api";
import { getUser } from "@/common/utils";
import Button from "antd/es/button";
import style from "./page.module.css";
import { useEffect, useRef, useState } from "react";
import { t_article, t_article_view, t_token_user } from "@/common/types";
import { useRouter } from "next/navigation";

export default function EditPage(props: { article?: t_article_view }) {
  const article = props.article;
  const type = article ? "edit" : "new";
  const [user, setUser] = useState<t_token_user | null>(null);
  const form = useRef(null);
  const router = useRouter();

  useEffect(() => {
    getUser().then((d) => {
      if (!d) {
        router.replace("/login");
        return;
      }
      setUser(d);
    });
  }, [router]);

  function getFormData(): Omit<
    t_article,
    "view_count" | "create_time" | "update_time"
  > {
    const data = new FormData(form.current || undefined);
    return {
      id: "",
      title: data.get("title") as string,
      content: data.get("content") as string,
      types: data.get("types")?.toString() || "",
      user_id: "",
    };
  }

  return (
    <form className={style["edit-root-form"]} ref={form}>
      <input
        className={style["edit-title"]}
        placeholder="Please input your title"
        autoFocus={true}
        autoComplete="off"
        name="title"
      ></input>
      <textarea
        className={style["edit-content"]}
        placeholder="Please input your article content"
        autoComplete="off"
        autoCapitalize="none"
        name="content"
      ></textarea>
      <select
        className={style["edit-content"]}
        defaultValue={["a"]}
        multiple
        name="types"
      >
        <option>a</option>
        <option>b</option>
        <option>c</option>
      </select>
      <div className={style["edit-toolbar"]}>
        <Button
          title="Apply"
          onClick={async () => {
            if (!user) return;

            const formData = getFormData();
            formData.user_id = user.uuid;
            if (article) {
              // todo
              formData.id = article.id;
              updateArticle(formData);
            } else {
              // todo
              createArticle(formData);
            }
          }}
        >
          Apply
        </Button>{" "}
        {type === "edit" ? (
          <>
            <Button
              title="Delete"
              onClick={async () => {
                if (!user || !article) return;

                const data = getFormData();
                data.user_id = user.uuid;
                deleteArticle(article?.id, user.token);
              }}
            >
              Apply
            </Button>
            <Button title="Cancle">Cancle</Button>
          </>
        ) : null}
      </div>
    </form>
  );
}
