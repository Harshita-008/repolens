"use client";

import { useState } from "react";
import { Clipboard, FileText } from "lucide-react";
import { buildArchitectureDoc } from "@/lib/docs/buildRepoDocs";
import type { AnalysisData } from "@/lib/repositories/types";

interface ExportDocsPanelProps {
  data: AnalysisData;
}

export default function ExportDocsPanel({
  data,
}: ExportDocsPanelProps) {
  const markdown = buildArchitectureDoc(data);
  const [status, setStatus] = useState<"idle" | "copied" | "error">(
    "idle"
  );

  async function copyMarkdown() {
    try {
      if (!navigator.clipboard) {
        throw new Error("Clipboard API unavailable.");
      }

      await navigator.clipboard.writeText(markdown);
      setStatus("copied");
      window.setTimeout(() => setStatus("idle"), 1800);
    } catch {
      setStatus("error");
      window.setTimeout(() => setStatus("idle"), 2400);
    }
  }

  return (
    <section className="rounded-xl border border-zinc-800 bg-zinc-950/70 p-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="grid h-9 w-9 place-items-center rounded-lg border border-zinc-800 bg-black text-cyan-300">
            <FileText size={17} />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-white">
              Generated Docs
            </h2>
            <p className="mt-1 text-xs text-zinc-500">
              Copy architecture, onboarding, health, and file guidance as
              Markdown.
            </p>
          </div>
        </div>

        <button
          onClick={copyMarkdown}
          className="inline-flex h-10 items-center gap-2 rounded-lg border border-zinc-800 bg-black px-3 text-sm text-zinc-200 transition hover:border-zinc-600 hover:text-white"
        >
          <Clipboard size={15} className="text-cyan-300" />
          {status === "copied"
            ? "Copied"
            : status === "error"
              ? "Copy failed"
              : "Copy Markdown"}
        </button>
      </div>
    </section>
  );
}
