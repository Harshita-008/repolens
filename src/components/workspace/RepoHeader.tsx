"use client";

import {
  ExternalLink,
  FileText,
  GitBranch,
  type LucideIcon,
  RefreshCw,
  ShieldCheck,
} from "lucide-react";
import type { AnalysisData } from "@/lib/repositories/types";

interface RepoHeaderProps {
  data: AnalysisData;
  loading: boolean;
  onReanalyze: () => void;
}

export default function RepoHeader({
  data,
  loading,
  onReanalyze,
}: RepoHeaderProps) {
  return (
    <div className="sticky top-0 z-30 -mx-3 border-b border-zinc-800 bg-black/85 px-3 py-3 backdrop-blur-xl">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="truncate text-lg font-semibold text-white">
              {data.repoName}
            </h2>
            <span className="rounded-md border border-zinc-800 px-2 py-1 text-xs text-zinc-400">
              {data.totalFiles} files
            </span>
            <span className="rounded-md border border-emerald-500/30 bg-emerald-500/10 px-2 py-1 text-xs text-emerald-200">
              Grade {data.health.grade}
            </span>
          </div>

          <div className="mt-1 flex min-w-0 flex-wrap items-center gap-3 text-xs text-zinc-500">
            {data.repoUrl && (
              <a
                href={data.repoUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex max-w-[420px] items-center gap-1 truncate transition hover:text-cyan-300"
              >
                <ExternalLink size={13} />
                <span className="truncate">{data.repoUrl}</span>
              </a>
            )}
            {data.analyzedAt && (
              <span>
                Analyzed {new Date(data.analyzedAt).toLocaleString()}
              </span>
            )}
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <HeaderStat
            icon={ShieldCheck}
            label="Health"
            value={`${data.health.score}/100`}
          />
          <HeaderStat
            icon={GitBranch}
            label="Modules"
            value={String(data.graph.nodes.length)}
          />
          <HeaderStat
            icon={FileText}
            label="Important"
            value={String(data.importantFiles.length)}
          />
          <button
            onClick={onReanalyze}
            disabled={loading}
            className="inline-flex h-10 items-center gap-2 rounded-lg border border-zinc-800 bg-zinc-950 px-3 text-sm text-zinc-200 transition hover:border-zinc-600 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <RefreshCw
              size={15}
              className={loading ? "animate-spin" : ""}
            />
            Re-analyze
          </button>
        </div>
      </div>
    </div>
  );
}

function HeaderStat({
  icon: Icon,
  label,
  value,
}: {
  icon: LucideIcon;
  label: string;
  value: string;
}) {
  return (
    <div className="hidden h-10 items-center gap-2 rounded-lg border border-zinc-800 bg-zinc-950 px-3 md:flex">
      <Icon size={14} className="text-cyan-300" />
      <span className="text-xs text-zinc-500">{label}</span>
      <span className="text-sm font-medium text-zinc-100">{value}</span>
    </div>
  );
}
