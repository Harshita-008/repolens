"use client";

import {
  AlertTriangle,
  CheckCircle2,
  ShieldCheck,
} from "lucide-react";
import { RepoHealthReport as HealthReport } from "@/lib/repositories/types";

interface Props {
  report: HealthReport;
}

export default function RepoHealthReport({ report }: Props) {
  const severityCounts = {
    high: report.issues.filter((issue) => issue.severity === "high")
      .length,
    medium: report.issues.filter((issue) => issue.severity === "medium")
      .length,
    low: report.issues.filter((issue) => issue.severity === "low")
      .length,
  };
  const signals = [
    ["README", report.signals.hasReadme],
    ["Tests", report.signals.hasTests],
    ["CI", report.signals.hasCi],
    ["Docker", report.signals.hasDocker],
    [".env example", report.signals.hasEnvExample],
  ];

  return (
    <section
      id="health"
      className="scroll-mt-28 rounded-xl border border-zinc-800 bg-zinc-950/70"
    >
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-zinc-800 px-5 py-4">
        <div>
          <h2 className="text-lg font-semibold">
            Repository Health
          </h2>
          <p className="mt-1 text-sm text-zinc-400">
            Generic production-readiness signals from the scanned codebase.
          </p>
          <p className="mt-2 text-xs text-zinc-500">
            Score reflects {severityCounts.high} high,{" "}
            {severityCounts.medium} medium, and {severityCounts.low} low
            finding{report.issues.length === 1 ? "" : "s"}.
          </p>
        </div>

        <div className="flex items-center gap-3 rounded-xl border border-zinc-800 bg-black/40 px-4 py-3">
          <ShieldCheck className="text-cyan-300" />
          <div>
            <div className="text-2xl font-bold">
              {report.score}/100
            </div>
            <div className="text-xs text-zinc-500">
              Grade {report.grade}
            </div>
          </div>
        </div>
      </div>

      <div className="p-5">
        <div className="mb-6 grid grid-cols-2 gap-3 md:grid-cols-5">
          {signals.map(([label, active]) => (
            <div
              key={label as string}
              className="rounded-lg border border-zinc-800 bg-black/30 p-3"
            >
              <div className="mb-2">
                {active ? (
                  <CheckCircle2 size={18} className="text-emerald-300" />
                ) : (
                  <AlertTriangle size={18} className="text-amber-300" />
                )}
              </div>
              <div className="text-sm font-medium">{label}</div>
              <div className="mt-1 text-xs text-zinc-500">
                {active ? "Detected" : "Not found"}
              </div>
            </div>
          ))}
        </div>

        <div className="space-y-3">
          {report.issues.length === 0 ? (
            <div className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 p-4 text-sm text-emerald-100">
              No major repo health issues detected in the scanned files.
            </div>
          ) : (
            report.issues.map((issue) => (
              <div
                key={issue.id}
                className="rounded-lg border border-zinc-800 bg-black/30 p-4"
              >
                <div className="flex flex-wrap items-center gap-2">
                  <span
                    className={`rounded-md px-2 py-1 text-xs font-medium ${
                      issue.severity === "high"
                        ? "bg-red-500/15 text-red-200"
                        : issue.severity === "medium"
                          ? "bg-amber-500/15 text-amber-200"
                          : "bg-zinc-700 text-zinc-200"
                    }`}
                  >
                    {issue.severity}
                  </span>
                  <h3 className="font-medium">{issue.title}</h3>
                </div>
                <p className="mt-2 text-sm text-zinc-400">
                  {issue.detail}
                </p>
                <p className="mt-2 text-sm text-zinc-300">
                  {issue.recommendation}
                </p>
                {issue.files.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {issue.files.map((file) => (
                      <span
                        key={file}
                        className="rounded-md border border-zinc-700 px-2 py-1 text-xs text-zinc-400"
                      >
                        {file}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  );
}
