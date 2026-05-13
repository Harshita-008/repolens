"use client";

import { ChatSource } from "./SourceChips";

interface Props {
  sources?: ChatSource[];
  onOpenFile?: (path: string) => void;
}

export default function SourceSnippetPanel({
  sources = [],
  onOpenFile,
}: Props) {
  if (sources.length === 0) return null;

  return (
    <div className="mt-4 space-y-3 border-t border-zinc-800 pt-4">
      <div className="text-xs font-medium uppercase tracking-wide text-zinc-500">
        Evidence
      </div>

      {sources.slice(0, 3).map((source) => (
        <div
          key={`${source.path}-${source.startLine}`}
          className="overflow-hidden rounded-xl border border-zinc-800 bg-black/60"
        >
          <button
            onClick={() => onOpenFile?.(source.path)}
            className="flex w-full items-center justify-between gap-3 border-b border-zinc-800 px-3 py-2 text-left text-xs text-cyan-200 hover:bg-zinc-900"
          >
            <span className="truncate">{source.path}</span>
            <span className="shrink-0 text-zinc-500">
              {source.startLine}-{source.endLine}
            </span>
          </button>

          <pre className="max-h-36 overflow-auto whitespace-pre-wrap p-3 text-xs leading-5 text-zinc-300 custom-scrollbar">
            {source.snippet || "Snippet unavailable for this source."}
          </pre>
        </div>
      ))}
    </div>
  );
}
