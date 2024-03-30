"use client";
import {
  ChangeEvent,
  TextareaHTMLAttributes,
  useEffect,
  useRef,
  useState,
} from "react";
import styles from "./rich-text.module.css";
import Markdown from "./markdown-viewer";

export type t_rich_text_props = {
  className: string;
  text: string;
  type?: "preview" | "normal";
  textareaProps?: TextareaHTMLAttributes<HTMLTextAreaElement>;
  activeTab?: number;
};

function renderEditorView(
  value: TextareaHTMLAttributes<any>["value"],
  onChange: (event: ChangeEvent<HTMLTextAreaElement>) => void,
  textareaProps?: t_rich_text_props["textareaProps"]
) {
  return (
    <textarea
      className={`${styles["textarea"]} p-4 border-0 outline-0 box-border bg-transparent`}
      value={value}
      onChange={onChange}
      {...textareaProps}
    ></textarea>
  );
}

function renderPreview(content: string) {
  return (
    <div className={styles["preview"]}>
      <Markdown>{content}</Markdown>
    </div>
  );
}

export default function RenderRichText(props: t_rich_text_props) {
  const { text, textareaProps = {}, className, activeTab = 0 } = props;
  const [value, setValue] = useState(text);
  const [active, setActive] = useState<null | {
    index: number;
    offsetLeft: number;
    width: number;
  }>(null);
  const headRef = useRef<HTMLDivElement>(null);

  function activeChange(index: number) {
    const head = headRef.current;
    if (!head) return;
    const tabs = head.querySelectorAll("span");
    const activeTab = tabs[index];
    if (!activeTab) return;

    setActive({
      index,
      offsetLeft: activeTab.offsetLeft || 0,
      width: activeTab.clientWidth || 0,
    });
  }

  function renderTitle(index: number, title: string) {
    return (
      <span
        className={`${styles["tab"]} ${
          active && active.index === index && "active"
        } cursor-pointer rounded p-1`}
        onClick={activeChange.bind(null, index)}
      >
        {title}
      </span>
    );
  }

  useEffect(() => {
    activeChange(activeTab);
  }, [activeTab]);

  const tabLineStyle: any = {
    "--tab-line-offset": `${active?.offsetLeft}px`,
    "--tab-line-width": `${active?.width}px`,
  };
  return (
    <div
      className={`${styles["root"]} ${className} flex flex-col`}
    >
      <div className={`${styles["header"]} flex gap-2`} ref={headRef}>
        {renderTitle(0, "Write")}
        {renderTitle(1, "Preview")}
        <div className={`${styles["tab-line"]}`} style={tabLineStyle}></div>
      </div>
      {(active && active.index && renderPreview(value)) ||
        renderEditorView(
          value,
          (e) => setValue(e.currentTarget.value),
          textareaProps
        )}
    </div>
  );
}
