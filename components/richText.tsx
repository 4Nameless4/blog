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
      className={`${style["root"]} ${className} flex flex-col backdrop-blur-md shadow shadow-black rounded-md`}
    >
      <div className={`${style["header"]} flex gap-2`}>
        <span className="cursor-pointer rounded p-1">Write</span>
        <span className="cursor-pointer rounded p-1">Preview</span>
      </div>
      <textarea
        className={`${style["textarea"]} p-4 border-0 outline-0 box-border bg-transparent`}
        {...textareaProps}
        value={value}
        onChange={(e) => {
          setValue(e.currentTarget.value);
        }}
      ></textarea>
    </div>
  );
}
