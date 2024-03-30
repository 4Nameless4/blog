import { t_article_view } from "@/common/types";
import Markdown from "@/components/markdown-viewer";
import { EditOutlined } from "@ant-design/icons";
import Button from "antd/es/button";
import { TextTitle } from "@/components/text_title";
import Link from "next/link";
import style from "./viewPage.module.css";

export default function RenderView(props: { article: t_article_view }) {
  const { title, content, createTime, updateTime, viewCount, types, userID } =
    props.article;

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
          <TextTitle str={title} />
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
      <section className={`${style["content-view"]} card-blur`}>
        <Markdown>{content}</Markdown>
      </section>
    </>
  );
}
