"use client";

import {
  Activity,
  CircleDot,
  FileText,
  type LucideIcon,
  ShieldAlert,
  ShieldCheck,
} from "lucide-react";
import type { AnalysisData } from "@/lib/repositories/types";

interface WorkspaceRailProps {
  data: AnalysisData | null;
  selectedFilePath: string;
}

export default function WorkspaceRail({
  data,
  selectedFilePath,
}: WorkspaceRailProps) {
  return (
    <aside className="hidden xl:block">
      <div className="sticky top-24 space-y-3">
        <div className="rounded-xl border border-zinc-800 bg-zinc-950/80 p-4">
          <div className="mb-3 flex items-center gap-2 text-sm font-medium text-white">
            <Activity size={16} className="text-cyan-300" />
            Workspace Status
          </div>

          {data ? (
            <div className="space-y-3 text-sm">
              <RailRow
                icon={ShieldCheck}
                label="Health"
                value={`${data.health.score}/100`}
              />
              <RailRow
                icon={ShieldAlert}
                label="Findings"
                value={String(data.health.issues.length)}
              />
              <RailRow
                icon={FileText}
                label="Selected file"
                value={selectedFilePath || "None"}
              />
            </div>
          ) : (
            <p className="text-sm leading-6 text-zinc-500">
              Analyze or open a saved repository to activate the review
              workspace.
            </p>
          )}
        </div>

        <div className="rounded-xl border border-zinc-800 bg-zinc-950/80 p-4">
          <div className="mb-3 text-sm font-medium text-white">
            Fast path
          </div>
          <div className="space-y-2">
            {[
              ["Architecture", "architecture"],
              ["Health", "health"],
              ["PR Impact", "impact"],
              ["Chat", "chat"],
              ["Files", "files"],
            ].map(([label, id]) => (
              <button
                key={id}
                onClick={() =>
                  document
                    .getElementById(id)
                    ?.scrollIntoView({ behavior: "smooth" })
                }
                className="flex w-full items-center gap-2 rounded-lg px-2 py-2 text-left text-sm text-zinc-400 transition hover:bg-zinc-900 hover:text-white"
              >
                <CircleDot size={12} />
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </aside>
  );
}

function RailRow({
  icon: Icon,
  label,
  value,
}: {
  icon: LucideIcon;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-lg border border-zinc-800 bg-black/30 p-3">
      <div className="mb-1 flex items-center gap-2 text-xs text-zinc-500">
        <Icon size={13} className="text-cyan-300" />
        {label}
      </div>
      <div className="truncate text-zinc-200">{value}</div>
    </div>
  );
}
