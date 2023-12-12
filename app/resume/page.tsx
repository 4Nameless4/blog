"use client";
import { FloatButton } from "antd";
import { renderAsync } from "docx-preview";
import { useEffect, useRef } from "react";

export default function ResumePage() {
  const ref = useRef<HTMLElement | null>(null);

  return (
    <section className="overflow-hidden w-full h-full">
      <article ref={ref}></article>
      <FloatButton
      // href="./resume.docx"
      />
    </section>
  );
}
