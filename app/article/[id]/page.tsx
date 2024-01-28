import style from "./page.module.css";
import Markdown from "react-markdown";
import { Prism } from "react-syntax-highlighter";
import { dark } from "react-syntax-highlighter/dist/esm/styles/prism";

export default async function ArticlePage(props: { params: { id: string } }) {
  const articleID = props.params.id;
  const markdown = `Here is some JavaScript code:

  \`\`\`html
  console.log('It 111!')
  \`\`\`
  `;

  return (
    <div className="article-page-root">
      <h3>title</h3>
      <section>
        <Markdown
          components={{
            code(props) {
              const { children, className } = props;
              const match = /language-(\w+)/.exec(className || "");
              return match ? (
                <Prism language={match[1]} style={dark}>
                  {String(children).replace(/\n$/, "")}
                </Prism>
              ) : (
                <code className={className}>{children}</code>
              );
            },
          }}
        >
          {markdown}
        </Markdown>
      </section>
    </div>
  );
}
