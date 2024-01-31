"use client";
import { createArticle } from "@/common/api";
import { getUser } from "@/common/utils";
import Button from "antd/es/button";
import style from "./page.module.css";
import { useEffect, useRef, useState } from "react";
import { t_user } from "@/common/types";
import { useRouter } from "next/navigation";

export default function EditPage(props: { type: "edit" | "new" }) {
  const type = props.type;
  const [user, setUser] = useState<t_user | null>(null);
  const form = useRef(null);
  const router = useRouter();

  useEffect(() => {
    getUser().then((d) => {
      if (!d) {
        router.replace("/login");
        return;
      }
      setUser(d);
    });
  }, []);

  function getFormData() {
    const data = new FormData(form.current || undefined);
    return {
      title: data.get("title") as string,
      content: data.get("content") as string,
      types: data.get("types")?.toString() || "",
      user_id: "",
    };
  }

  return (
    <form className={style["edit-root-form"]} ref={form}>
      <input
        className={style["edit-title"]}
        placeholder="Please input your title"
        autoFocus={true}
        autoComplete="off"
        name="title"
      ></input>
      <textarea
        className={style["edit-content"]}
        placeholder="Please input your article content"
        autoComplete="off"
        autoCapitalize="none"
        name="content"
      ></textarea>
      <select
        className={style["edit-content"]}
        defaultValue={["a"]}
        multiple
        name="types"
      >
        <option>a</option>
        <option>b</option>
        <option>c</option>
      </select>
      <div className={style["edit-toolbar"]}>
        <Button
          title="Apply"
          onClick={async () => {
            if (!user) return;

            const data = getFormData();
            data.user_id = user.uuid;
            if (type === "edit") {
              // todo
            } else if (type === "new") {
              // todo
              createArticle(data);
            }
          }}
        >
          Apply
        </Button>
        {type === "edit" ? <Button title="Cancle">Cancle</Button> : null}
      </div>
    </form>
  );
}
