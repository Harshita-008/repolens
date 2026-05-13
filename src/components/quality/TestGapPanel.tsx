"use client";

import { AlertTriangle, TestTube2 } from "lucide-react";
import { detectTestGaps } from "@/lib/quality/detectTestGaps";
import type { AnalysisData } from "@/lib/repositories/types";

interface TestGapPanelProps {
  data: AnalysisData;
}

export default function TestGapPanel({ data }: TestGapPanelProps) {
  const gaps = detectTestGaps(data);

  return (
    <section className="rounded-xl border border-zinc-800 bg-zinc-950/70">
      <div className="flex items-start gap-3 border-b border-zinc-800 px-5 py-4">
        <div className="grid h-9 w-9 place-items-center rounded-lg border border-zinc-800 bg-black text-cyan-300">
          <TestTube2 size={17} />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-white">
            Test Gap Detector
          </h2>
          <p className="mt-1 text-sm text-zinc-400">
            Important files that do not appear to have nearby tests.
          </p>
        </div>
      </div>

      <div className="p-5">
        {gaps.length === 0 ? (
          <div className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 p-4 text-sm text-emerald-100">
            No obvious test gaps detected in the important files.
          </div>
        ) : (
          <div className="space-y-3">
            {gaps.map((gap) => (
              <div
                key={gap.path}
                className="rounded-lg border border-zinc-800 bg-black/30 p-4"
              >
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="min-w-0 truncate font-medium text-zinc-100">
                    {gap.path}
                  </div>
                  <span
                    className={`rounded-md px-2 py-1 text-xs ${
                      gap.priority === "high"
                        ? "bg-red-500/15 text-red-200"
                        : gap.priority === "medium"
                          ? "bg-amber-500/15 text-amber-200"
                          : "bg-zinc-800 text-zinc-300"
                    }`}
                  >
                    {gap.priority}
                  </span>
                </div>
                <p className="mt-2 text-sm leading-6 text-zinc-400">
                  {gap.reason}
                </p>
                <div className="mt-3 flex items-center gap-2 rounded-lg border border-zinc-800 bg-black px-3 py-2 text-xs text-zinc-400">
                  <AlertTriangle size={13} className="text-cyan-300" />
                  Suggested: {gap.suggestedTestPath}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
