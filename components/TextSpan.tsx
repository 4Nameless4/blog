export type t_text_span_props = {
  str: string;
  className?: string;
  children?: JSX.Element;
};

export function TextSpan(props: t_text_span_props) {
  const { str, children, className } = props;
  return (
    <span className={className} title={str}>
      {str}
      {children}
    </span>
  );
}
