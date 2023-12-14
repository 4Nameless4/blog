"use client";
import { useRef } from "react";

export default function Home() {
  const a = useRef(null);
  return (
    <section
      ref={a}
      className="flex flex-col items-center justify-center leading-8 p-8 rounded shadow-lg backdrop-blur"
    ></section>
  );
}
