"use client";
import { FloatButton, Modal, Spin } from "antd";
import { useEffect, useMemo, useRef, useState } from "react";
import Pizzip from "pizzip";
import DocxTemplater from "docxtemplater";
import { saveAs } from "file-saver";
import UseSVG from "../../components/usesvg";
import style from "./page.module.css";
import { getUser } from "@/common/user";
import { useRouter } from "next/navigation";

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

function forSec(arr: string[]) {
  return arr.map((d, i) => {
    return (
      <p className={style.paragraph} key={i}>
        - {d}
      </p>
    );
  });
}

export function getDescSec(resumeJSON: Record<string, any> | null) {
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

function renderNotAllowPage() {
  return (
    <div className="viewbox flex justif-center items-center">Not Allow</div>
  );
}

export default function ResumePage() {
  const router = useRouter();
  const [allow, setAllow] = useState(false);
  const resume = useRef<HTMLElement | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [resumeFillBlob, setResumeFillBlob] = useState<null | Blob>(null);
  const [resumeJSON, setResumeJSON] = useState<null | Record<string, any>>(
    null
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getUser().then((d) => {
      if (!d || d.role !== 1) {
        router.replace("/login");
        setLoading(false);
      } else {
        setAllow(true);
      }
    });
  });
  useEffect(() => {
    if (!allow) return;
    Promise.all([
      fetch(process.env.StaticSERVER + "/resumeinfo").then((r) => r.text()),
      fetch(process.env.StaticSERVER + "/resumeTemplate.docx").then((r) =>
        r.blob()
      ),
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
        setLoading(false);
      });
    });
  }, [allow]);
  useEffect(() => {
    if (!allow) return;
    try {
      const el = resume.current;
      if (!isModalOpen || !el || !resumeFillBlob) return;

      import("docx-preview").then(({ renderAsync }) => {
        renderAsync(resumeFillBlob, el);
      });
    } catch (e) {
      console.error(e);
    }
  }, [isModalOpen, resumeFillBlob, allow]);
  function _download() {
    if (!resumeFillBlob || !allow) return;
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
      <article className={`${style["resume-page-root"]} viewbox`}>
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
        {resumeJSON ? getDescSec(resumeJSON) : null}
        <FloatButton
          icon={<UseSVG name="download" />}
          onClick={() => {
            setIsModalOpen((d) => !d);
          }}
        ></FloatButton>
      </article>
    );
  }
  function renderLoading() {
    return (
      <div className="flex justify-center items-center">
        <Spin />
      </div>
    );
  }
  return loading
    ? renderLoading()
    : allow
    ? renderPage()
    : renderNotAllowPage();
}
