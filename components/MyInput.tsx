import { ForwardedRef, forwardRef, useState } from "react";
import style from "./MyInput.module.css";

export type t_myinput_status = "error" | "warn" | "none" | "success";
export type t_myinput_return_status = {
  msg?: string;
  status?: t_myinput_status;
};

export default forwardRef(function MyInput(
  opts: {
    value: string;
    placeholder?: string;
    type?: "password" | "text";
    require?: boolean;
    title?: string;
    label?: string;
    onChange?: (value: string) => void | t_myinput_return_status;
  },
  ref: ForwardedRef<HTMLInputElement>
) {
  const {
    type = "text",
    require,
    placeholder = "",
    title = "",
    label = "",
    value,
    onChange,
  } = opts;

  const [msg, setMsg] = useState("");
  const [status, setStatus] = useState<t_myinput_status>("none");

  return (
    <div className={`${style.root} ${style[status]}`} title={title}>
      <div className={style.labelContainer}>
        {require ? <span style={{ color: "red" }}>*</span> : null}
        <span>{label}</span>
      </div>
      <div className={style.inputContainer}>
        <div className={style.textInputContainer}>
          <input
            value={value}
            ref={ref}
            type={type}
            placeholder={placeholder}
            className={style.textInput}
            onChange={(e) => {
              const val = e.currentTarget.value;
              let msg = "";
              let status: t_myinput_status = "none";

              if (onChange) {
                const result = onChange(val);

                if (result) {
                  const m = result.msg;
                  m && (msg = m);
                  const s = result.status;
                  s && (status = s);
                }
              }
              setMsg(msg);
              setStatus(status);
            }}
          ></input>
        </div>
        <div className={style.msg}>{msg}</div>
      </div>
    </div>
  );
});
