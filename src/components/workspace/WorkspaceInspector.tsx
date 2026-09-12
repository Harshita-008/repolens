"use client";

import {
  AlertTriangle,
  ArrowRight,
  FileCode2,
  FolderGit2,
  type LucideIcon,
  Package,
  Route,
} from "lucide-react";
import type { AnalysisData } from "@/lib/repositories/types";
import {
  WorkspaceView,
  workspaceViews,
} from "./workspaceViews";

interface WorkspaceInspectorProps {
  data: AnalysisData | null;
  selectedFilePath: string;
  activeView: WorkspaceView;
  onViewChange: (view: WorkspaceView) => void;
}

export default function WorkspaceInspector({
  data,
  selectedFilePath,
  activeView,
  onViewChange,
}: WorkspaceInspectorProps) {
  const activeLabel =
    workspaceViews.find((view) => view.id === activeView)?.label ||
    "Workspace";

  return (
    <aside className="hidden xl:block">
      <div className="sticky top-24 space-y-3">
        <div className="rounded-xl border border-zinc-800 bg-zinc-950/80 p-4">
          <div className="mb-3 flex items-center gap-2 text-sm font-medium text-white">
            <FileCode2 size={16} className="text-cyan-300" />
            Inspector
          </div>

          {data ? (
            <div className="space-y-3">
              <InspectorCard
                icon={FolderGit2}
                label="Current view"
                value={activeLabel}
                detail={getViewDetail(activeView, data)}
              />
              <InspectorCard
                icon={FolderGit2}
                label="Active repo"
                value={data.repoName}
                detail={`${data.totalFiles} files analyzed`}
              />
              <InspectorCard
                icon={FileCode2}
                label="Selected file"
                value={selectedFilePath || "No file selected"}
                detail="Open files from graph or file explorer"
              />
              <InspectorCard
                icon={AlertTriangle}
                label="Top review signal"
                value={
                  data.health.issues[0]?.title ||
                  "No major issue detected"
                }
                detail={
                  data.health.issues[0]?.recommendation ||
                  "Health report has no blocking findings"
                }
              />
              <InspectorCard
                icon={Package}
                label="Package managers"
                value={
                  data.health.signals.packageManagers.join(", ") ||
                  "Not detected"
                }
                detail="Detected from scanned config files"
              />
            </div>
          ) : (
            <p className="text-sm leading-6 text-zinc-500">
              Analyze or open a saved repository to activate file and review
              context here.
            </p>
          )}
        </div>

        <div className="rounded-xl border border-zinc-800 bg-zinc-950/80 p-4">
          <div className="mb-3 flex items-center gap-2 text-sm font-medium text-white">
            <Route size={16} className="text-cyan-300" />
            Next actions
          </div>
          <div className="space-y-2">
            {[
              ["Review architecture", "architecture"],
              ["Check health findings", "health"],
              ["Analyze a diff", "impact"],
              ["Inspect files", "files"],
            ].map(([label, id]) => {
              const view = id as WorkspaceView;

              return (
              <button
                key={id}
                onClick={() => onViewChange(view)}
                className="flex w-full items-center justify-between rounded-lg px-2 py-2 text-left text-sm text-zinc-400 transition hover:bg-zinc-900 hover:text-white"
              >
                {label}
                <ArrowRight size={13} />
              </button>
              );
            })}
          </div>
        </div>
      </div>
    </aside>
  );
}

function getViewDetail(
  activeView: WorkspaceView,
  data: AnalysisData
) {
  if (activeView === "architecture") {
    return `${data.graph.nodes.length} nodes and ${data.graph.edges.length} relationships`;
  }

  if (activeView === "health") {
    return `${data.health.issues.length} health findings, grade ${data.health.grade}`;
  }

  if (activeView === "impact") {
    return "Paste a diff or GitHub PR URL for review focus";
  }

  if (activeView === "files") {
    return `${data.importantFiles.length} important files available`;
  }

  if (activeView === "roadmap") {
    return "Developer learning path for this repository";
  }

  return "Summary, read-first guide, saved repos, and metrics";
}

function InspectorCard({
  icon: Icon,
  label,
  value,
  detail,
}: {
  icon: LucideIcon;
  label: string;
  value: string;
  detail: string;
}) {
  return (
    <div className="rounded-lg border border-zinc-800 bg-black/30 p-3">
      <div className="mb-2 flex items-center gap-2 text-xs text-zinc-500">
        <Icon size={13} className="text-cyan-300" />
        {label}
      </div>
      <div className="truncate text-sm font-medium text-zinc-100">
        {value}
      </div>
      <div className="mt-1 line-clamp-2 text-xs leading-5 text-zinc-500">
        {detail}
      </div>
    </div>
  );
}
