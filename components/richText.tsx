"use client";
import { TextareaHTMLAttributes, useState } from "react";
import style from "./richText.module.css";

export type t_rich_text_props = {
  className: string;
  text: string;
  type?: "preview" | "normal";
  textareaProps?: TextareaHTMLAttributes<HTMLTextAreaElement>;
};

export default function RenderRichText(props: t_rich_text_props) {
  const { text, type = "normal", textareaProps = {}, className } = props;
  const [value, setValue] = useState(text);

  return (
    <div
      className={`${style["root"]} ${className} w-full h-full flex flex-col`}
    >
      <div className={style["header"]}>
        <span>Enter</span>
        <span>Preview</span>
      </div>
      <textarea
        className={`${style["textarea"]} w-full h-full resize-none backdrop-blur-md shadow shadow-black p-4 border-0 outline-0`}
        {...textareaProps}
        value={value}
        onChange={(e) => {
          setValue(e.currentTarget.value);
        }}
      ></textarea>
    </div>
  );
}
