"use client";

import { useEffect, useState } from "react";
import {
  BookOpen,
  Brain,
  Files,
  FolderTree,
  GitBranch,
  GitPullRequest,
  LayoutDashboard,
  Map,
  Network,
  Search,
  ShieldCheck,
} from "lucide-react";
import type { WorkspaceView } from "@/components/workspace/workspaceViews";

interface SidebarProps {
  hasActiveRepo?: boolean;
  activeView?: WorkspaceView;
  onViewChange?: (view: WorkspaceView) => void;
}

const items = [
  {
    icon: LayoutDashboard,
    label: "Start",
    id: "top",
    alwaysVisible: true,
  },
  {
    icon: Brain,
    label: "Saved Repos",
    id: "saved-repos",
    view: "overview",
    alwaysVisible: true,
  },
  {
    icon: BookOpen,
    label: "Overview",
    id: "overview",
    view: "overview",
  },
  {
    icon: GitBranch,
    label: "Read First",
    id: "overview",
    view: "overview",
  },
  {
    icon: Map,
    label: "Roadmap",
    id: "roadmap",
    view: "roadmap",
  },
  {
    icon: Network,
    label: "Architecture",
    id: "architecture",
    view: "architecture",
  },
  {
    icon: ShieldCheck,
    label: "Health",
    id: "health",
    view: "health",
  },
  {
    icon: GitPullRequest,
    label: "PR Impact",
    id: "impact",
    view: "impact",
  },
  {
    icon: Files,
    label: "Files",
    id: "files",
    view: "files",
  },
  {
    icon: FolderTree,
    label: "Structure",
    id: "structure",
    view: "files",
  },
];

export default function Sidebar({
  hasActiveRepo = false,
  activeView,
  onViewChange,
}: SidebarProps) {
  const [active, setActive] = useState("top");

  useEffect(() => {
    const sectionIds = items
      .map((item) => item.id)
      .filter((id) => id !== "top");

    function updateActiveSection() {
      if (window.scrollY < 160) {
        setActive("top");
        return;
      }

      const anchorY = window.innerHeight * 0.32;
      let currentSection = sectionIds[0];

      for (const id of sectionIds) {
        const element = document.getElementById(id);

        if (!element) continue;

        const rect = element.getBoundingClientRect();

        if (rect.top <= anchorY) {
          currentSection = id;
        }
      }

      setActive(currentSection);
    }

    window.addEventListener("scroll", updateActiveSection, {
      passive: true,
    });
    window.addEventListener("resize", updateActiveSection);

    updateActiveSection();

    return () => {
      window.removeEventListener("scroll", updateActiveSection);
      window.removeEventListener("resize", updateActiveSection);
    };
  }, []);

  return (
    <>
    <header className="sticky top-0 z-50 border-b border-zinc-800 bg-zinc-950/95 px-4 py-3 backdrop-blur-xl lg:hidden">
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <div className="text-lg font-semibold tracking-tight text-white">
            RepoLENS
          </div>
          <div className="truncate text-xs text-zinc-500">
            Repository intelligence workspace
          </div>
        </div>

        <button
          onClick={() => {
            if (!hasActiveRepo) return;
            window.dispatchEvent(
              new KeyboardEvent("keydown", {
                key: "k",
                ctrlKey: true,
              })
            );
          }}
          disabled={!hasActiveRepo}
          className="inline-flex shrink-0 items-center gap-2 rounded-lg border border-zinc-800 bg-black px-3 py-2 text-xs text-zinc-300 transition hover:border-zinc-600 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Search size={14} />
          Ctrl K
        </button>
      </div>
    </header>

    <aside className="fixed left-0 top-0 z-40 hidden h-screen w-[280px] border-r border-zinc-800 bg-zinc-950/95 p-4 backdrop-blur-xl lg:block">
      <div className="mb-5 rounded-xl border border-zinc-800 bg-black/40 p-4">
        <h1 className="text-2xl font-semibold tracking-tight text-white">
          RepoLENS
        </h1>
        <p className="mt-1 text-xs leading-5 text-zinc-500">
          Repository intelligence for onboarding, review, and architecture
          discovery.
        </p>
      </div>

      <button
        onClick={() => {
          if (!hasActiveRepo) return;
          window.dispatchEvent(
            new KeyboardEvent("keydown", {
              key: "k",
              ctrlKey: true,
            })
          );
        }}
        disabled={!hasActiveRepo}
        className="mb-4 flex w-full items-center justify-between rounded-lg border border-zinc-800 bg-black px-3 py-2 text-left text-sm text-zinc-400 transition hover:border-zinc-600 hover:text-zinc-100 disabled:cursor-not-allowed disabled:opacity-50"
      >
        <span className="inline-flex items-center gap-2">
          <Search size={15} />
          Command
        </span>
        <span className="rounded border border-zinc-800 px-1.5 py-0.5 text-[11px]">
          Ctrl K
        </span>
      </button>

      <nav className="space-y-1">
        {items
          .filter((item) => item.alwaysVisible || hasActiveRepo)
          .map((item) => {
            const Icon = item.icon;
            const itemView = item.view as WorkspaceView | undefined;
            const isActive =
              itemView && activeView
                ? activeView === itemView &&
                  item.label === getPrimaryLabelForView(activeView)
                : !hasActiveRepo && active === item.id;

            return (
              <button
                key={item.label}
                onClick={() => {
                  setActive(item.id);
                  if (item.id === "top") {
                    window.scrollTo({
                      top: 0,
                      behavior: "smooth",
                    });

                    return;
                  }

                  if (itemView) {
                    onViewChange?.(itemView);
                    window.scrollTo({
                      top: 0,
                      behavior: "smooth",
                    });

                    return;
                  }

                  document
                    .getElementById(item.id)
                    ?.scrollIntoView({
                      behavior: "smooth",
                    });
                }}
                className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition ${
                  isActive
                    ? "border border-cyan-500/40 bg-cyan-500/10 text-cyan-50 shadow-[0_0_22px_rgba(34,211,238,0.12)]"
                    : "border border-transparent text-zinc-400 hover:border-zinc-800 hover:bg-zinc-900 hover:text-white"
                }`}
              >
                <Icon
                  size={17}
                  className={isActive ? "text-cyan-300" : ""}
                />
                <span>{item.label}</span>
              </button>
            );
          })}
      </nav>
    </aside>
    </>
  );
}

function getPrimaryLabelForView(view: WorkspaceView) {
  if (view === "overview") return "Overview";
  if (view === "architecture") return "Architecture";
  if (view === "health") return "Health";
  if (view === "impact") return "PR Impact";
  if (view === "files") return "Files";
  return "Roadmap";
}
