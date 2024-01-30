// "use client";
import Button from "antd/es/button";
import style from "./page.module.css";
import Link from "next/link";

export default function ArticleOverviewPage() {
  return (
    <section>
      ArticleOverview
      <Button title="New">
        <Link href="/article/new">New</Link>
      </Button>
    </section>
  );
}
