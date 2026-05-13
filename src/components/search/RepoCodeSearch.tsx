"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import type { AnalysisData } from "@/lib/repositories/types";

interface RepoCodeSearchProps {
  data: AnalysisData;
  onOpenFile: (path: string) => void;
}

export default function RepoCodeSearch({
  data,
  onOpenFile,
}: RepoCodeSearchProps) {
  const [query, setQuery] = useState("");

  const results = useMemo(() => {
    const normalizedQuery = query.toLowerCase().trim();

    if (!normalizedQuery) return [];

    return data.importantFiles
      .map((file) => {
        const haystack = `${file.path}\n${file.content}`.toLowerCase();
        const index = haystack.indexOf(normalizedQuery);

        return {
          file,
          index,
        };
      })
      .filter((item) => item.index >= 0)
      .slice(0, 6)
      .map(({ file, index }) => ({
        path: file.path,
        snippet: file.content.slice(
          Math.max(0, index - 120),
          Math.min(file.content.length, index + 320)
        ),
      }));
  }, [data.importantFiles, query]);

  return (
    <section className="rounded-xl border border-zinc-800 bg-zinc-950/70">
      <div className="border-b border-zinc-800 px-5 py-4">
        <h2 className="text-lg font-semibold text-white">
          Code Search
        </h2>
        <p className="mt-1 text-sm text-zinc-400">
          Search important files by path or code text.
        </p>
      </div>

      <div className="p-5">
        <div className="flex items-center gap-2 rounded-lg border border-zinc-800 bg-black px-3 py-2">
          <Search size={15} className="text-cyan-300" />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search auth, API routes, todo creation..."
            className="w-full bg-transparent text-sm text-zinc-100 outline-none placeholder:text-zinc-600"
          />
        </div>

        {query && (
          <div className="mt-4 space-y-3">
            {results.length === 0 ? (
              <div className="rounded-lg border border-zinc-800 bg-black/30 p-4 text-sm text-zinc-500">
                No important-file matches found.
              </div>
            ) : (
              results.map((result) => (
                <button
                  key={result.path}
                  onClick={() => onOpenFile(result.path)}
                  className="block w-full rounded-lg border border-zinc-800 bg-black/30 p-4 text-left transition hover:border-zinc-600"
                >
                  <div className="truncate text-sm font-medium text-zinc-100">
                    {result.path}
                  </div>
                  <pre className="mt-2 max-h-24 overflow-hidden whitespace-pre-wrap text-xs leading-5 text-zinc-500">
                    {result.snippet}
                  </pre>
                </button>
              ))
            )}
          </div>
        )}
      </div>
    </section>
  );
}
