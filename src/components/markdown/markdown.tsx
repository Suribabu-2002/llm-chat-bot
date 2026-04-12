'use client'

import { type ReactElement, type ReactNode } from "react";
import ReactMarkdown from "react-markdown";
import CodeBlock from "./codeBlock";

export default function MarkdownContent({ content }: Readonly<{ content: string }>) {
  return (
    <ReactMarkdown
      components={{
        h1: ({ children }) => <h1>{children}</h1>,
        h2: ({ children }) => <h2>{children}</h2>,
        h3: ({ children }) => <h3>{children}</h3>,
        p: ({ children }) => <p>{children}</p>,
        ul: ({ children }) => <ul>{children}</ul>,
        ol: ({ children }) => <ol>{children}</ol>,
        li: ({ children }) => <li>{children}</li>,
        blockquote: ({ children }) => <blockquote>{children}</blockquote>,
        hr: () => <hr />,
        a: ({ href, children }) => (
          <a href={href} target="_blank" rel="noreferrer">
            {children}
          </a>
        ),
        pre: ({ children }) => {
          const child = children as ReactElement<{
            className?: string;
            children?: ReactNode;
          }>;
          const language = child?.props?.className?.replace("language-", "") ?? "text";
          const code = String(child?.props?.children ?? "").replace(/\n$/, "");

          return <CodeBlock language={language} code={code} />;
        },
        code: ({ children, className }) => {
          if (className?.startsWith("language-")) {
            return <>{children}</>;
          }

          return <code>{children}</code>;
        },
        table: ({ children }) => (
          <div className="markdown-table-wrap">
            <table>{children}</table>
          </div>
        ),
      }}
    >
      {content}
    </ReactMarkdown>
  );
}