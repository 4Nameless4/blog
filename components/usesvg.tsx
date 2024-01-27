export type t_use_svg_props = {
  href?: string;
  name: string;
  className?: string;
};
export default function UseSVG({
  href = "/sprite.svg",
  name,
  className = "",
}: t_use_svg_props) {
  return (
    <svg
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      width="100%"
      height="100%"
      preserveAspectRatio="none meet"
    >
      <use href={`${href}/#${name}`}></use>
    </svg>
  );
}
