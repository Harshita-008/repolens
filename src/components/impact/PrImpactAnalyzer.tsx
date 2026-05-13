"use client";

import type { ReactNode } from "react";
import { useState } from "react";
import axios from "axios";
import { GitPullRequest, ShieldAlert } from "lucide-react";
import { PrImpactReport } from "@/lib/repositories/types";

interface Props {
  repoName: string;
}

export default function PrImpactAnalyzer({ repoName }: Props) {
  const [diff, setDiff] = useState("");
  const [loading, setLoading] = useState(false);
  const [report, setReport] =
    useState<PrImpactReport | null>(null);

  async function analyzeImpact() {
    if (!diff.trim() || loading) return;

    try {
      setLoading(true);
      const response = await axios.post("/api/pr-impact", {
        repoName,
        diff,
      });

      setReport(response.data);
    } finally {
      setLoading(false);
    }
  }

  return (
    <section
      id="impact"
      className="rounded-2xl border border-zinc-800 bg-zinc-900/80 p-6 scroll-mt-24"
    >
      <div className="mb-5 flex items-start justify-between gap-4">
        <div>
          <h2 className="text-2xl font-semibold">
            PR / Diff Impact Analyzer
          </h2>
          <p className="mt-1 text-sm text-zinc-400">
            Paste a unified git diff to identify risk, affected modules, and test focus.
          </p>
        </div>
        <GitPullRequest className="text-cyan-300" />
      </div>

      <textarea
        value={diff}
        onChange={(event) => setDiff(event.target.value)}
        placeholder="Paste a git diff here..."
        className="h-48 w-full resize-y rounded-xl border border-zinc-800 bg-black p-4 font-mono text-sm text-zinc-200 outline-none placeholder:text-zinc-600 focus:border-cyan-500"
      />

      <div className="mt-4 flex justify-end">
        <button
          onClick={analyzeImpact}
          disabled={loading || !diff.trim()}
          className="rounded-xl bg-white px-5 py-3 font-medium text-black disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? "Analyzing..." : "Analyze Impact"}
        </button>
      </div>

      {report && (
        <div className="mt-6 space-y-5">
          <div className="rounded-xl border border-cyan-500/30 bg-cyan-500/10 p-4 text-sm text-cyan-100">
            {report.summary}
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <Panel title="Review Focus">
              {report.reviewFocus.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </Panel>
            <Panel title="Suggested Tests">
              {report.suggestedTests.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </Panel>
          </div>

          <div className="space-y-3">
            {report.changedFiles.map((file) => (
              <div
                key={file.path}
                className="rounded-xl border border-zinc-800 bg-black/30 p-4"
              >
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="min-w-0 truncate font-medium">
                    {file.path}
                  </div>
                  <span
                    className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs ${
                      file.risk === "high"
                        ? "bg-red-500/15 text-red-200"
                        : file.risk === "medium"
                          ? "bg-amber-500/15 text-amber-200"
                          : "bg-emerald-500/15 text-emerald-200"
                    }`}
                  >
                    <ShieldAlert size={13} />
                    {file.risk}
                  </span>
                </div>

                <div className="mt-2 text-xs text-zinc-500">
                  +{file.additions} / -{file.deletions}
                </div>

                <div className="mt-3 flex flex-wrap gap-2">
                  {file.reasons.map((reason) => (
                    <span
                      key={reason}
                      className="rounded-full border border-zinc-700 px-2 py-1 text-xs text-zinc-300"
                    >
                      {reason}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}

function Panel({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <div className="rounded-xl border border-zinc-800 bg-black/30 p-4">
      <h3 className="mb-3 font-medium">{title}</h3>
      <ul className="list-disc space-y-2 pl-4 text-sm text-zinc-300">
        {children}
      </ul>
    </div>
  );
}
