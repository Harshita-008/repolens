"use client";

import type { ReactNode } from "react";
import { useMemo, useState } from "react";
import axios from "axios";
import {
  AlertTriangle,
  Boxes,
  CheckCircle2,
  FileDiff,
  GitPullRequest,
  type LucideIcon,
  Loader2,
  ShieldAlert,
  TestTube2,
} from "lucide-react";
import { PrImpactReport } from "@/lib/repositories/types";

interface Props {
  repoName: string;
}

export default function PrImpactAnalyzer({ repoName }: Props) {
  const [diff, setDiff] = useState("");
  const [prUrl, setPrUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [report, setReport] =
    useState<PrImpactReport | null>(null);

  async function analyzeImpact() {
    if ((!diff.trim() && !prUrl.trim()) || loading) return;

    try {
      setError("");
      setLoading(true);
      const response = await axios.post("/api/pr-impact", {
        repoName,
        diff,
        prUrl,
      });

      setReport(response.data);
    } catch (impactError) {
      console.error(impactError);
      setError(
        "Could not analyze this change. Paste a unified diff or enter a public GitHub PR URL for this repository."
      );
    } finally {
      setLoading(false);
    }
  }

  const riskCounts = useMemo(() => {
    const counts = {
      high: 0,
      medium: 0,
      low: 0,
    };

    report?.changedFiles.forEach((file) => {
      counts[file.risk] += 1;
    });

    return counts;
  }, [report]);

  return (
    <section
      id="impact"
      className="scroll-mt-28 rounded-xl border border-zinc-800 bg-zinc-950/70"
    >
      <div className="flex flex-wrap items-start justify-between gap-4 border-b border-zinc-800 px-5 py-4">
        <div className="flex items-start gap-3">
          <div className="grid h-9 w-9 place-items-center rounded-lg border border-zinc-800 bg-black text-cyan-300">
            <GitPullRequest size={17} />
          </div>
          <div>
            <h2 className="text-lg font-semibold">
              PR / Diff Impact Analyzer
            </h2>
            <p className="mt-1 text-sm text-zinc-400">
              Paste a unified git diff or enter a GitHub PR URL to identify
              risk, affected modules, and test focus.
            </p>
          </div>
        </div>

        <span className="rounded-md border border-zinc-800 px-3 py-1 text-xs text-zinc-400">
          {repoName}
        </span>
      </div>

      <div className="grid gap-5 p-5 xl:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]">
        <div className="space-y-4">
          <div className="rounded-lg border border-zinc-800 bg-black p-4">
            <label className="mb-2 block text-sm font-medium text-zinc-200">
              GitHub PR URL
            </label>
            <input
              value={prUrl}
              onChange={(event) => setPrUrl(event.target.value)}
              placeholder="https://github.com/org/repo/pull/123"
              className="min-h-11 w-full rounded-lg border border-zinc-800 bg-zinc-950 px-4 text-sm text-zinc-100 outline-none transition placeholder:text-zinc-600 focus:border-cyan-400"
            />
            <p className="mt-2 text-xs leading-5 text-zinc-500">
              Leave the diff empty to fetch the public PR diff automatically.
            </p>
          </div>

          <div className="rounded-lg border border-zinc-800 bg-black">
            <div className="flex items-center justify-between border-b border-zinc-800 px-4 py-3">
              <span className="inline-flex items-center gap-2 text-sm font-medium text-zinc-200">
                <FileDiff size={15} className="text-cyan-300" />
                Unified diff
              </span>
              <span className="text-xs text-zinc-600">
                {diff.split(/\r?\n/).filter(Boolean).length} lines
              </span>
            </div>

            <textarea
              value={diff}
              onChange={(event) => setDiff(event.target.value)}
              placeholder="Paste a git diff here..."
              className="h-[360px] w-full resize-y bg-black p-4 font-mono text-sm leading-6 text-zinc-200 outline-none placeholder:text-zinc-600"
            />
          </div>

          {error && (
            <div className="flex gap-3 rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-100">
              <AlertTriangle size={17} className="mt-0.5 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <button
            onClick={analyzeImpact}
            disabled={loading || (!diff.trim() && !prUrl.trim())}
            className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-white px-5 py-3 text-sm font-semibold text-black transition hover:bg-zinc-200 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                Analyzing impact
              </>
            ) : (
              <>
                <ShieldAlert size={16} />
                Analyze Impact
              </>
            )}
          </button>
        </div>

        <div className="min-h-[480px] space-y-4">
          {!report ? (
            <div className="grid h-full min-h-[480px] place-items-center rounded-lg border border-dashed border-zinc-800 bg-black/30 p-8 text-center">
              <div>
                <ShieldAlert className="mx-auto mb-3 text-zinc-600" />
                <h3 className="font-medium text-zinc-200">
                  Waiting for a diff
                </h3>
                <p className="mt-2 max-w-sm text-sm leading-6 text-zinc-500">
                  Paste a diff or enter a public GitHub PR URL. The report
                  will summarize review risk, changed files, mapped modules,
                  and test focus for this repository.
                </p>
              </div>
            </div>
          ) : (
            <>
              <div className="rounded-lg border border-cyan-500/30 bg-cyan-500/10 p-4 text-sm leading-6 text-cyan-100">
                {report.summary}
              </div>

              <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
                <ImpactStat
                  label="Files"
                  value={report.changedFiles.length}
                  tone="neutral"
                />
                <ImpactStat
                  label="High"
                  value={riskCounts.high}
                  tone="high"
                />
                <ImpactStat
                  label="Medium"
                  value={riskCounts.medium}
                  tone="medium"
                />
                <ImpactStat
                  label="Modules"
                  value={report.affectedModules.length}
                  tone="neutral"
                />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <Panel title="Review Focus" icon={ShieldAlert}>
                  {report.reviewFocus.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </Panel>
                <Panel title="Suggested Tests" icon={TestTube2}>
                  {report.suggestedTests.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </Panel>
              </div>

              {report.affectedModules.length > 0 && (
                <Panel title="Affected Modules" icon={Boxes}>
                  {report.affectedModules.map((module) => (
                    <li key={module.id}>
                      <span className="font-medium text-zinc-100">
                        {module.label}
                      </span>{" "}
                      <span className="text-zinc-500">
                        {module.category}
                      </span>
                    </li>
                  ))}
                </Panel>
              )}

              <div className="space-y-3">
                {report.changedFiles.map((file) => (
                  <div
                    key={file.path}
                    className="rounded-lg border border-zinc-800 bg-black/30 p-4"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div className="min-w-0 truncate font-medium">
                        {file.path}
                      </div>
                      <RiskBadge risk={file.risk} />
                    </div>

                    <div className="mt-2 text-xs text-zinc-500">
                      +{file.additions} / -{file.deletions}
                    </div>

                    <div className="mt-3 flex flex-wrap gap-2">
                      {file.reasons.map((reason) => (
                        <span
                          key={reason}
                          className="rounded-md border border-zinc-700 px-2 py-1 text-xs text-zinc-300"
                        >
                          {reason}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
}

function ImpactStat({
  label,
  value,
  tone,
}: {
  label: string;
  value: number;
  tone: "neutral" | "high" | "medium";
}) {
  const toneClass =
    tone === "high"
      ? "border-red-500/30 bg-red-500/10 text-red-100"
      : tone === "medium"
        ? "border-amber-500/30 bg-amber-500/10 text-amber-100"
        : "border-zinc-800 bg-black/30 text-zinc-100";

  return (
    <div className={`rounded-lg border p-3 ${toneClass}`}>
      <div className="text-xs opacity-70">{label}</div>
      <div className="mt-1 text-2xl font-semibold">{value}</div>
    </div>
  );
}

function RiskBadge({
  risk,
}: {
  risk: "low" | "medium" | "high";
}) {
  const className =
    risk === "high"
      ? "bg-red-500/15 text-red-200"
      : risk === "medium"
        ? "bg-amber-500/15 text-amber-200"
        : "bg-emerald-500/15 text-emerald-200";

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs ${className}`}
    >
      {risk === "low" ? <CheckCircle2 size={13} /> : <ShieldAlert size={13} />}
      {risk}
    </span>
  );
}

function Panel({
  title,
  icon: Icon,
  children,
}: {
  title: string;
  icon: LucideIcon;
  children: ReactNode;
}) {
  return (
    <div className="rounded-lg border border-zinc-800 bg-black/30 p-4">
      <h3 className="mb-3 flex items-center gap-2 text-sm font-medium text-zinc-100">
        <Icon size={15} className="text-cyan-300" />
        {title}
      </h3>
      <ul className="list-disc space-y-2 pl-4 text-sm leading-6 text-zinc-300">
        {children}
      </ul>
    </div>
  );
}
