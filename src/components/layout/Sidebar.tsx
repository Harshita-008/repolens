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
  MessageSquare,
  Network,
  Search,
  ShieldCheck,
} from "lucide-react";

interface SidebarProps {
  hasActiveRepo?: boolean;
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
    id: "dashboard",
    alwaysVisible: true,
  },
  {
    icon: BookOpen,
    label: "Summary",
    id: "summary",
  },
  {
    icon: GitBranch,
    label: "Read First",
    id: "read-first",
  },
  {
    icon: Map,
    label: "Roadmap",
    id: "roadmap",
  },
  {
    icon: Network,
    label: "Architecture",
    id: "architecture",
  },
  {
    icon: ShieldCheck,
    label: "Health",
    id: "health",
  },
  {
    icon: GitPullRequest,
    label: "PR Impact",
    id: "impact",
  },
  {
    icon: MessageSquare,
    label: "Chat",
    id: "chat",
  },
  {
    icon: Files,
    label: "Files",
    id: "files",
  },
  {
    icon: FolderTree,
    label: "Structure",
    id: "structure",
  },
];

export default function Sidebar({
  hasActiveRepo = false,
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

                  document
                    .getElementById(item.id)
                    ?.scrollIntoView({
                      behavior: "smooth",
                    });
                }}
                className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition ${
                  active === item.id
                    ? "bg-white text-black"
                    : "text-zinc-400 hover:bg-zinc-900 hover:text-white"
                }`}
              >
                <Icon size={17} />
                <span>{item.label}</span>
              </button>
            );
          })}
      </nav>
    </aside>
  );
}
