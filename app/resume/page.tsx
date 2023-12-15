"use client";
import { FloatButton, Modal, Spin } from "antd";
import { renderAsync } from "docx-preview";
import { useEffect, useRef, useState } from "react";
import Pizzip from "pizzip";
import DocxTemplater from "docxtemplater";
import { saveAs } from "file-saver";
import { getJSON } from "./get";

function base64ToBytes(base64: string) {
  const binString = window.atob(base64);

  return new TextDecoder().decode(
    Uint8Array.from(binString as any, (m: any) => m.codePointAt(0))
  );
}

function fillResumeTemplate(arraybuffer: ArrayBuffer, json: any) {
  const zip = new Pizzip(arraybuffer);
  const doc = new DocxTemplater(zip, {
    nullGetter() {
      return "";
    },
  }).setData(json || {});
  doc.render();
  const blob = doc.getZip().generate({
    type: "blob",
    mimeType:
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  });
  return blob;
}

export default function ResumePage() {
  const resume = useRef<HTMLElement | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [resumeFillBlob, setResumeFillBlob] = useState<null | Blob>(null);
  const [resumeJSON, setResumeJSON] = useState<null | Record<string, any>>(
    null
  );

  useEffect(() => {
    Promise.all([
      getJSON(),
      fetch("/resumeTemplate.docx").then((r) => r.blob()),
    ]).then(([json, blob]) => {
      if (!blob) return;
      let jsonObj = {};
      try {
        jsonObj = JSON.parse(base64ToBytes(json));
      } catch (e) {}

      setResumeJSON(jsonObj);
      blob.arrayBuffer().then((d) => {
        const fillBlob = fillResumeTemplate(d, jsonObj);
        setResumeFillBlob(fillBlob);
      });
    });
  }, []);
  useEffect(() => {
    try {
      const el = resume.current;
      if (!el || !resumeFillBlob) return;
      renderAsync(resumeFillBlob, el);
    } catch (e) {
      console.error(e);
    }
  }, [() => resume.current]);

  function _download() {
    if (!resumeFillBlob) return;
    saveAs(resumeFillBlob, "resume.docx");
    // if (!base64) return;
    // download(`data:application/octet-stream;base64,${base64}`, "resume.docx");
  }
  function getDescSec() {
    const data = (resumeJSON && resumeJSON["projects"]) || [];

    return data.map((d: any, index: number) => {
      return <section key={index}>{d.name}</section>;
    });
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
        {resumeFillBlob ? (
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
          setIsModalOpen((d) => !d);
        }}
      />
    </article>
  );
}
