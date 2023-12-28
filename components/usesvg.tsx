export type t_use_svg_props = {
  href?: string;
  name: string;
};
export default function UseSVG({ href = "sprite.svg", name }: t_use_svg_props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="100%"
      height="100%"
      preserveAspectRatio="none meet"
    >
      <use href={`${href}/#${name}`}></use>
    </svg>
  );
}
