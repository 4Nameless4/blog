import style from "./sections.module.css";

function forSec(arr: string[]) {
  return arr.map((d, i) => {
    return (
      <p className={style.p} key={i}>
        - {d}
      </p>
    );
  });
}

export function getDescSec(resumeJSON: Record<string, any> | null) {
  const projects = (resumeJSON && resumeJSON["projects"]) || [];
  const _projects = projects.map((d: any, index: number) => {
    return (
      <article key={index} className={style.sec}>
        <div className={style.title}>
          <h3>{d.name}</h3>
          <span>[{d.duty.join("|")}]</span>
        </div>
        <p className={style.p}>{d.desc}</p>
        <h4 className={style.childTitle}># 难点:</h4>
        {forSec(d.difficult)}
        <h4 className={style.childTitle}># 业绩:</h4>
        {forSec(d.proformance)}
      </article>
    );
  });
  return (
    <section>
      <p className={style.p}>{(resumeJSON && resumeJSON["desc"]) || ""}</p>
      {_projects}
    </section>
  );
}
