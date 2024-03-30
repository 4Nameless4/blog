import Markdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import gfm from "remark-gfm";
import { Prism } from "react-syntax-highlighter";
import { atomDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import 'github-markdown-css/github-markdown.css'
import './markdown-viewer.css'

export default function RenderMarkdownView({ children }: { children: string }) {
  return (
    <Markdown
      className="markdown-body"
      rehypePlugins={[rehypeRaw]}
      remarkPlugins={[gfm]}
      components={{
        code(props) {
          const { children, className } = props;
          const match = /language-(\w+)/.exec(className || "");
          return match ? (
            <Prism
              language={match[1].toLowerCase()}
              style={atomDark}
              PreTag="section"
            >
              {String(children).replace(/\n$/, "")}
            </Prism>
          ) : (
            <code className={className}>{children}</code>
          );
        },
      }}
    >
      {children}
    </Markdown>
  );
}
