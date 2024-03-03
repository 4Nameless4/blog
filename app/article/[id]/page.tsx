import { redirect } from "next/navigation";
import style from "./page.module.css";
import Markdown from "react-markdown";
import { Prism } from "react-syntax-highlighter";
import { dark } from "react-syntax-highlighter/dist/esm/styles/prism";
import { getArticle } from "@/common/api";
import EditPage from "./editPage";
import Link from "next/link";
import { EditOutlined } from "@ant-design/icons";
import Button from "antd/es/button";
import { TextTitle } from "@/components/text_title";

async function renderView(id: string) {
  const data = await getArticle(id);

  if (!data) {
    redirect("/article");
    return null;
  }

  const { title, content, createTime, updateTime, viewCount, types, userID } =
    data;

  const edit = (
    <Button shape="circle">
      <Link href="?type=edit">
        <EditOutlined />
      </Link>
    </Button>
  );

  return (
    <>
      <div className={style["title-view"]}>
        <h3>
          <TextTitle str={title}/>
        </h3>
        {edit}
      </div>
      <div className={style["meta-view"]}>
        <span>
          Create Time: {new Date(`${createTime} UTC`).toLocaleString()}
        </span>
        <span>View Count: {viewCount}</span>
        <span>
          Update Time: {new Date(`${updateTime} UTC`).toLocaleString()}
        </span>
      </div>
      <section className={style["content-view"]}>
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
  params: { id: string };
  searchParams: Record<string, string>;
}) {
  const articleID = props.params.id;
  const type = props.searchParams.type;

  let content = null;

  if (articleID === "new") {
    content = <EditPage />;
  } else {
    const article = await getArticle(articleID);
    if (article) {
      if (type === "edit") {
        content = <EditPage article={article} />;
      } else if (articleID) {
        content = await renderView(articleID);
      }
    }
  }

  return <div className={style["article-page-root"]}>{content}</div>;
}
