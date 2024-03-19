import style from "./richText.module.css";

export type t_rich_text_props = {
  text: string;
  type: "preview" | "normal";
};

export default function renderRichText(props: t_rich_text_props) {
  const { text, type } = props;
  return (
    <div className={style["root"]}>
      <textarea>{text}</textarea>
    </div>
  );
}
