"use client";
import { FloatButton, Modal, Spin } from "antd";
import { useEffect, useMemo, useRef, useState } from "react";
import Pizzip from "pizzip";
import DocxTemplater from "docxtemplater";
import { saveAs } from "file-saver";
import { getJSON } from "./get";
import UseSVG from "../usesvg";
import { getDescSec } from "./sections";

function base64ToBytes(base64: string) {
  const binString = window.atob(base64);

  return new TextDecoder().decode(
    Uint8Array.from(binString as any, (m: any) => m.codePointAt(0))
  );
}

function fillResumeTemplate(arraybuffer: ArrayBuffer, json: any) {
  const zip = new Pizzip(arraybuffer);
  const doc = new DocxTemplater(zip, {
    parser(tag) {
      return {
        get(scope) {
          if (tag === ".") {
            return scope;
          }
          if (/%.*%$/g.test(tag)) {
            const value = scope[tag.replace(/%.*%$/g, "")];
            if (Array.isArray(value)) {
              const matched = /%(.*)%$/g.exec(tag);

              return value.join((matched && matched[1]) || ",");
            }
          }
          if (scope) {
            return scope[tag];
          }
          return scope;
        },
      };
    },
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

export default function ResumePage(props:any) {
  console.log(props)
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
      if (!isModalOpen || !el || !resumeFillBlob) return;

      import("docx-preview").then(({ renderAsync }) => {
        renderAsync(resumeFillBlob, el);
      });
    } catch (e) {
      console.error(e);
    }
  }, [isModalOpen, resumeFillBlob]);

  function _download() {
    if (!resumeFillBlob) return;
    saveAs(resumeFillBlob, "resume.docx");
  }

  const dialogContent = useMemo(() => {
    if (resumeFillBlob) {
      return (
        <section
          ref={resume}
          className="overflow-hidden w-full h-full"
        ></section>
      );
    } else {
      return <Spin />;
    }
  }, [resumeFillBlob]);

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
        {dialogContent}
      </Modal>
      {getDescSec(resumeJSON)}
      <FloatButton
        icon={<UseSVG name="download" />}
        onClick={() => {
          setIsModalOpen((d) => !d);
        }}
      ></FloatButton>
    </article>
  );
}
