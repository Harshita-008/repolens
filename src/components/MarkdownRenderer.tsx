// components/MarkdownRenderer.tsx

import ReactMarkdown from "react-markdown";

interface Props {
  content: string;
}

export default function MarkdownRenderer({
  content,
}: Props) {
  return (
    <ReactMarkdown
      components={{
        h1: ({ children }) => (
          <h1 className="text-3xl font-bold mt-10 mb-6 text-white">
            {children}
          </h1>
        ),

        h2: ({ children }) => (
          <h2 className="text-xl font-semibold mt-6 mb-2 text-white">
            {children}
          </h2>
        ),

        h3: ({ children }) => (
          <h3 className="text-lg font-medium mt-4 mb-1 text-zinc-100">
            {children}
          </h3>
        ),

        p: ({ children }) => (
          <p className="text-zinc-300 leading-7 mb-2">
            {children}
          </p>
        ),

        ul: ({ children }) => (
          <ul className="space-y-1 mb-4 list-disc pl-5">
            {children}
          </ul>
        ),

        li: ({ children }) => (
          <li className="text-zinc-300">
            {children}
          </li>
        ),

        strong: ({ children }) => (
          <strong className="text-white font-semibold">
            {children}
          </strong>
        ),

        code: ({ children }) => (
          <code className="bg-zinc-800 px-1 py-0.5 rounded text-cyan-300">
            {children}
          </code>
        ),
        hr: () => null,
      }}
    >
      {content}
    </ReactMarkdown>
  );
}