"use client";
import { FloatButton, Modal, Spin } from "antd";
import { renderAsync } from "docx-preview";
import { useEffect, useRef, useState } from "react";

function download(url: string, name: string) {
  const link = document.createElement("a");
  link.download = name;
  link.href = url;
  document.body.appendChild(link);
  link.click();
  link.remove();
}

function getDescSec() {
  const result: JSX.Element[] = [];

  [1, 2, 3].forEach((d) => {
    result.push(<section key={`${d}`}>{d}</section>);
  });

  return result;
}

export default function ResumePage() {
  const resume = useRef<HTMLElement | null>(null);
  const [base64, setBase64] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  // const [blob, setBlob] = useState("");

  useEffect(() => {
    fetch("/resume.zz")
      .then((r) => r.text())
      .then((d) => {
        setBase64(d);
        // const buffer = Buffer.from(d, "base64");
        // const blob = new Blob([buffer]);
        // const url = URL.createObjectURL(blob);
        // console.log(url)
      });
    // fetch("/MCS.exe")
    //   .then((r) => r.blob())
    //   .then((d) => {
    //     setBlob(URL.createObjectURL(d));
    //   });
  }, []);
  useEffect(() => {
    try {
      const el = resume.current;
      if (!el || !base64) return;
      const a = window.atob(base64);
      renderAsync(a, el);
    } catch (e) {
      console.error(e);
    }
  }, [() => resume.current]);

  function _download() {
    if (!base64) return;
    download(`data:application/octet-stream;base64,${base64}`, "resume.docx");
  }

  return (
    <article>
      <Modal
        title="预览"
        open={isModalOpen}
        onOk={_download}
        okText="下载"
        onCancel={() => setIsModalOpen(false)}
        cancelText="取消"
        width="fit-content"
      >
        {base64 ? (
          <section
            ref={resume}
            className="overflow-hidden w-full h-full"
          ></section>
        ) : (
          <Spin />
        )}
      </Modal>
      {getDescSec()}
      <FloatButton
        icon={<i className="fa-solid fa-download"></i>}
        onClick={() => {
          if (isModalOpen) {
            _download();
          }
          setIsModalOpen((d) => !d);
          // if (!base64 || typeof document === undefined) return;
          // const link = document.createElement("a");
          // link.download = "resume.docx";
          // link.href = base64;
          // // link.download = "resume.exe";
          // // link.href = blob;
          // document.body.appendChild(link);
          // link.click();
          // link.remove();
        }}
      />
    </article>
  );
}
