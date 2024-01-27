import style from "./page.module.css";

export default function ArticlePage(props: { params: { id: string } }) {
  return <div>ArticlePage {props?.params?.id ?? null}</div>;
}
