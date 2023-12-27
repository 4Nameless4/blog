import style from "./sections.module.css";

export function getDescSec(resumeJSON: Record<string, any> | null) {
  const projects = (resumeJSON && resumeJSON["projects"]) || [];
  const _projects = projects.map((d: any, index: number) => {
    return (
      <article key={index} className={style.sec}>
        <div className={style.title}>
          <h3>{d.name}</h3>
          <span>[{d.duty.join(' | ')}]</span>
          <span>
            {d.startTime}-{d.endTime}
          </span>
        </div>
        <span className={style.structure}>{d.structure.join(" | ")}</span>
        <p className={style.desc}>* {d.desc}</p>
        <p className={style.proformance}>* {d.proformance}</p>
      </article>
    );
  });
  return (
    <section>
      <p>{(resumeJSON && resumeJSON["desc"]) || ""}</p>
      {_projects}
    </section>
  );
}
