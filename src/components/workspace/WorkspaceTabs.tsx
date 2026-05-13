"use client";

import {
  WorkspaceView,
  workspaceViews,
} from "./workspaceViews";

interface WorkspaceTabsProps {
  activeView: WorkspaceView;
  onViewChange: (view: WorkspaceView) => void;
}

export default function WorkspaceTabs({
  activeView,
  onViewChange,
}: WorkspaceTabsProps) {
  return (
    <div className="overflow-x-auto bg-black py-2 custom-scrollbar">
      <div className="flex min-w-max gap-2">
        {workspaceViews.map((tab) => {
          const Icon = tab.icon;
          const active = activeView === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => onViewChange(tab.id)}
              className={`inline-flex h-9 items-center gap-2 rounded-lg border px-3 text-sm transition ${
                active
                  ? "border-cyan-500/50 bg-cyan-500/10 text-cyan-50"
                  : "border-zinc-800 bg-zinc-950 text-zinc-300 hover:border-zinc-600 hover:text-white"
              }`}
            >
              <Icon size={15} className="text-cyan-300" />
              {tab.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
