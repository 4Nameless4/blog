import { redirect } from "next/navigation";
import style from "./page.module.css";
import Markdown from "react-markdown";
import { Prism } from "react-syntax-highlighter";
import { dark } from "react-syntax-highlighter/dist/esm/styles/prism";
import { getArticle } from "@/common/api";
import EditPage from "./editPage";

async function renderView(id: string) {
  const data = await getArticle(id);

  if (!data) {
    redirect("/article");
    return null;
  }

  const {
    title,
    content,
    create_time,
    update_time,
    view_count,
    types,
    user_id,
  } = data;

  return (
    <>
      <h3>{title}</h3>
      <div>
        <span>Create Time: {create_time}</span>
        <span>View Count: {view_count}</span>
        <span>Update Time: {update_time}</span>
      </div>
      <section>
        <Markdown
          components={{
            code(props) {
              const { children, className } = props;
              const match = /language-(\w+)/.exec(className || "");
              return match ? (
                <Prism language={match[1]} style={dark}>
                  {String(children).replace(/\n$/, "")}
                </Prism>
              ) : (
                <code className={className}>{children}</code>
              );
            },
          }}
        >
          {content}
        </Markdown>
      </section>
    </>
  );
}
export default async function ArticlePage(props: {
  params: { id?: string };
  searchParams: Record<string, string>;
}) {
  const articleID = props.params.id;
  const type = props.searchParams.type;

  let content = null;
  if (articleID && type === "edit") {
    content = <EditPage type="edit" />;
  } else if (articleID === "new") {
    content = <EditPage type="new" />;
  } else if (articleID) {
    content = await renderView(articleID);
  }

  return <div className={style["article-page-root"]}>{content}</div>;
}
