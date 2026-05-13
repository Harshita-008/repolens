"use client";

import {
  AlertTriangle,
  Braces,
  FileCode2,
  GitBranch,
  ShieldCheck,
} from "lucide-react";
import type { AnalysisData } from "@/lib/repositories/types";

interface RepoMetricsProps {
  data: AnalysisData;
}

export default function RepoMetrics({ data }: RepoMetricsProps) {
  const apiFiles = data.tree
    .split(/\r?\n/)
    .filter((line) => /api|route|server/i.test(line)).length;

  const highRisks = data.health.issues.filter(
    (issue) => issue.severity === "high"
  ).length;

  const metrics = [
    {
      label: "Files analyzed",
      value: data.totalFiles,
      detail: `${data.importantFiles.length} read-first files`,
      icon: FileCode2,
    },
    {
      label: "Architecture nodes",
      value: data.graph.nodes.length,
      detail: `${data.graph.edges.length} relationships`,
      icon: GitBranch,
    },
    {
      label: "Health score",
      value: `${data.health.score}`,
      detail: `Grade ${data.health.grade}`,
      icon: ShieldCheck,
    },
    {
      label: "Risk areas",
      value: highRisks,
      detail: `${data.health.issues.length} total findings`,
      icon: AlertTriangle,
    },
    {
      label: "API signals",
      value: apiFiles,
      detail: "routes and server files",
      icon: Braces,
    },
  ];

  return (
    <section
      id="dashboard"
      className="grid scroll-mt-28 gap-3 sm:grid-cols-2 xl:grid-cols-5"
    >
      {metrics.map((metric) => {
        const Icon = metric.icon;

        return (
          <div
            key={metric.label}
            className="rounded-xl border border-zinc-800 bg-zinc-950/70 p-4"
          >
            <div className="mb-4 flex items-center justify-between">
              <Icon size={18} className="text-cyan-300" />
              <span className="text-xs text-zinc-600">
                {metric.label}
              </span>
            </div>
            <div className="text-3xl font-semibold text-white">
              {metric.value}
            </div>
            <div className="mt-1 text-xs text-zinc-500">
              {metric.detail}
            </div>
          </div>
        );
      })}
    </section>
  );
}
