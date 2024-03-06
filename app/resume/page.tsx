"use client";
import { FloatButton, Modal, Spin } from "antd";
import { useEffect, useMemo, useRef, useState } from "react";
import Pizzip from "pizzip";
import DocxTemplater from "docxtemplater";
import { saveAs } from "file-saver";
import UseSVG from "../../components/usesvg";
import style from "./page.module.css";
import { useUserContext } from "@/common/context";
import { getResume } from "@/common/api";
import { useLoading } from "@/common/hooks";

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

function forSec(arr: string[]) {
  return arr.map((d, i) => {
    return (
      <p className={style.paragraph} key={i}>
        - {d}
      </p>
    );
  });
}

function getDescSec(resumeJSON: Record<string, any> | null) {
  const projects = (resumeJSON && resumeJSON["projects"]) || [];
  const _projects = projects.map((d: any, index: number) => {
    return (
      <article key={index} className={style["article-sec"]}>
        <div className={style.title}>
          <h3>{d.name}</h3>
          <span>[{d.duty.join("|")}]</span>
        </div>
        <p className={style.paragraph}>{d.desc}</p>
        <h4 className={style.childTitle}># 难点:</h4>
        {forSec(d.difficult)}
        <h4 className={style.childTitle}># 业绩:</h4>
        {forSec(d.proformance)}
      </article>
    );
  });
  return (
    <section>
      <p className={style.paragraph}>
        {(resumeJSON && resumeJSON["desc"]) || ""}
      </p>
      {_projects}
    </section>
  );
}

export default function ResumePage() {
  const [user] = useUserContext();
  const resume = useRef<HTMLElement | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [resumeFillBlob, setResumeFillBlob] = useState<null | Blob>(null);
  const [resumeJSON, setResumeJSON] = useState<null | Record<string, any>>(
    null
  );

  useEffect(() => {
    if (user) {
      getResume().then(([json, arrayBuffer]) => {
        setResumeJSON(json);
        const fillBlob = fillResumeTemplate(arrayBuffer, json);
        setResumeFillBlob(fillBlob);
      });
    }
  }, [user]);

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
  function renderPage() {
    return (
      <article className={`${style["resume-page-root"]}`}>
        {resumeJSON ? getDescSec(resumeJSON) : null}
        <FloatButton
          icon={<UseSVG name="download" />}
          onClick={() => {
            setIsModalOpen((d) => !d);
          }}
        ></FloatButton>
        <div>
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
        </div>
      </article>
    );
  }
  return useLoading(renderPage, !!resumeJSON);
}
