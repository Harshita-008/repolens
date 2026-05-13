"use client";

import ReactMarkdown from "react-markdown";

interface Props {
  content: string;
}

export default function ChatMarkdown({
  content,
}: Props) {
  return (
    <ReactMarkdown
      components={{
        h1: ({ children }) => (
          <h3 className="mb-2 mt-3 text-lg font-semibold text-white first:mt-0">
            {children}
          </h3>
        ),
        h2: ({ children }) => (
          <h3 className="mb-2 mt-3 text-base font-semibold text-white first:mt-0">
            {children}
          </h3>
        ),
        h3: ({ children }) => (
          <h4 className="mb-1.5 mt-3 text-sm font-semibold text-zinc-100 first:mt-0">
            {children}
          </h4>
        ),
        p: ({ children }) => (
          <p className="mb-3 text-[15px] leading-7 text-zinc-200 last:mb-0">
            {children}
          </p>
        ),
        ul: ({ children }) => (
          <ul className="mb-3 list-disc space-y-1.5 pl-5 last:mb-0">
            {children}
          </ul>
        ),
        ol: ({ children }) => (
          <ol className="mb-3 list-decimal space-y-1.5 pl-5 last:mb-0">
            {children}
          </ol>
        ),
        li: ({ children }) => (
          <li className="text-[15px] leading-7 text-zinc-200">
            {children}
          </li>
        ),
        strong: ({ children }) => (
          <strong className="font-semibold text-white">
            {children}
          </strong>
        ),
        code: ({ children }) => (
          <code className="rounded bg-black/40 px-1.5 py-0.5 text-cyan-300">
            {children}
          </code>
        ),
        table: ({ children }) => (
          <div className="mb-3 overflow-x-auto rounded-xl border border-zinc-700">
            <table className="w-full text-left text-sm">
              {children}
            </table>
          </div>
        ),
        th: ({ children }) => (
          <th className="border-b border-zinc-700 bg-zinc-800 px-3 py-2 text-zinc-100">
            {children}
          </th>
        ),
        td: ({ children }) => (
          <td className="border-b border-zinc-800 px-3 py-2 text-zinc-300">
            {children}
          </td>
        ),
      }}
    >
      {content}
    </ReactMarkdown>
  );
}
