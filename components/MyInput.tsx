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
    icon?: JSX.Element;
    // label for input id
    innerLabel?: string;
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
    icon,
    innerLabel,
    onChange,
  } = opts;

  const [msg, setMsg] = useState("");
  const [status, setStatus] = useState<t_myinput_status>("none");

  return (
    <div
      className={`${style.root} ${style[status]} ${
        innerLabel ? style.innerLabel : ""
      }`}
      title={title || label}
    >
      <div className={style.labelContainer}>
        {require ? <span style={{ color: "red" }}>*</span> : null}
        <span>{innerLabel ? "" : label}</span>
      </div>
      <div className={style.inputContainer}>
        <label className={style.textInputContainer} htmlFor={innerLabel}>
          <input
            id={innerLabel}
            value={value}
            ref={ref}
            type={type}
            placeholder={placeholder}
            className={style.textInput}
            autoComplete={type === "password" ? "off" : undefined}
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
          <span className={style.textInputInnerText}>
            {innerLabel ? label : ""}
          </span>
          <div className={style.icon}>{icon}</div>
        </label>
        <div className={style.msg}>{msg}</div>
      </div>
    </div>
  );
});
