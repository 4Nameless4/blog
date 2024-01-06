import startsCss from "./stars.module.css";
import solarCss from "./solar.module.css";

export function Stars() {
  return (
    <div className={startsCss.root}>
      <div className={solarCss.space}>
        <div className={startsCss.stars}></div>
        <div className={startsCss.stars2}></div>
        <div className={startsCss.stars3}></div>
        <div className={solarCss["solar-syst"]}>
          <div className={solarCss.sun}></div>
          <div className={solarCss.mercury}></div>
          <div className={solarCss.venus}></div>
          <div className={solarCss.earth}></div>
          <div className={solarCss.mars}></div>
          <div className={solarCss.jupiter}></div>
          <div className={solarCss.saturn}></div>
          <div className={solarCss.uranus}></div>
          <div className={solarCss.neptune}></div>
          <div className={solarCss.pluto}></div>
          <div className={solarCss["asteroids-belt"]}></div>
        </div>
      </div>
    </div>
  );
}
