"use client";
import { createArticle, deleteArticle, updateArticle } from "@/common/api";
import Button from "antd/es/button";
import style from "./editPage.module.css";
import { useRef } from "react";
import { t_article, t_article_view, t_token_user } from "@/common/types";
import { useRouter } from "next/navigation";
import RenderRichText from "@/components/rich-text";
import { useStoreState } from "@/common/store";

export default function EditPage(props: { article?: t_article_view }) {
  const article = props.article;
  const type = article ? "edit" : "new";
  const form = useRef(null);
  const router = useRouter();
  const user = useStoreState<t_token_user>("user");

  function getFormData(): Omit<
    t_article,
    "viewCount" | "createTime" | "updateTime"
  > {
    const data = new FormData(form.current || undefined);
    return {
      id: article ? article.id : "",
      title: data.get("title") as string,
      content: data.get("content") as string,
      types: "",
      userID: user.uuid
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
        defaultValue={article?.title}
      ></input>
      <RenderRichText
        className={`${style["edit-content"]} card-blur`}
        text={article?.content || ""}
        textareaProps={{
          placeholder: "Please input your article content",
          autoComplete: "off",
          autoCapitalize: "none",
          name: "content",
        }}
      />
      <div className={style["edit-toolbar"]}>
        <Button
          title="Apply"
          onClick={async () => {
            debugger
            const formData = getFormData();
            let articleID = article?.id || ""
            if (article) {
              await updateArticle(formData);
            } else {
              const d = await createArticle(formData);
              articleID = d?.id || "";
            }
            router.push(`/article/${articleID}`);
          }}
        >
          Apply
        </Button>{" "}
        {type === "edit" ? (
          <>
            <Button
              title="Delete"
              // onClick={async () => {
              //   if (!user || !article) return;

              //   const data = getFormData();
              //   data.userID = user.uuid;
              //   deleteArticle(article?.id, user.token);
              // }}
            >
              Delete
            </Button>
            <Button title="Cancle">Cancle</Button>
          </>
        ) : null}
      </div>
    </form>
  );
}
