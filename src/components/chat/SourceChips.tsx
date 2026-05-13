"use client";

export interface ChatSource {
  path: string;
  startLine: number;
  endLine: number;
}

interface Props {
  sources?: ChatSource[];
  onOpenFile?: (path: string) => void;
}

export default function SourceChips({
  sources = [],
  onOpenFile,
}: Props) {
  if (sources.length === 0) return null;

  const uniqueSources = sources.filter(
    (source, index, allSources) =>
      allSources.findIndex(
        (item) => item.path === source.path
      ) === index
  );

  return (
    <div className="mt-4 flex flex-wrap gap-2 border-t border-zinc-800 pt-3">
      {uniqueSources.slice(0, 6).map((source) => (
        <button
          key={source.path}
          onClick={() => onOpenFile?.(source.path)}
          className="max-w-full truncate rounded-full border border-cyan-500/30 bg-cyan-500/10 px-3 py-1 text-xs text-cyan-200 hover:border-cyan-400"
          title={`${source.path}:${source.startLine}-${source.endLine}`}
        >
          {source.path}
        </button>
      ))}
    </div>
  );
}
