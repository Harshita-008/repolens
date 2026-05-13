"use client";

import { useEffect, useState } from "react";
import {
  LayoutDashboard,
  Brain,
  GitBranch,
  MessageSquare,
  FolderTree,
  BookOpen,
  Map,
  Network,
  Files,
} from "lucide-react";

const items = [
  {
    icon: LayoutDashboard,
    label: "Overview",
    id: "top",
  },
  {
    icon: Brain,
    label: "AI Summary",
    id: "summary",
  },
  {
    icon: BookOpen,
    label: "Read First",
    id: "read-first",
  },
  {
    icon: Map,
    label: "Roadmap",
    id: "roadmap",
  },
  {
    icon: GitBranch,
    label: "Architecture",
    id: "architecture",
  },
  {
    icon: Network,
    label: "Heatmap",
    id: "heatmap",
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

export default function Sidebar() {
  const [active, setActive] = useState("top");

  useEffect(() => {
    const sectionIds = items
      .map((item) => item.id)
      .filter((id) => id !== "top");

    function updateActiveSection() {
      if (window.scrollY < 180) {
        setActive("top");
        return;
      }

      const anchorY = window.innerHeight * 0.35;
      let currentSection = sectionIds[0];

      for (const id of sectionIds) {
        const element = document.getElementById(id);

        if (!element) continue;

        const rect =
          element.getBoundingClientRect();

        if (rect.top <= anchorY) {
          currentSection = id;
        }
      }

      setActive(currentSection);
    }

    window.addEventListener(
      "scroll",
      updateActiveSection,
      { passive: true }
    );
    window.addEventListener(
      "resize",
      updateActiveSection
    );

    updateActiveSection();

    return () => {
      window.removeEventListener(
        "scroll",
        updateActiveSection
      );
      window.removeEventListener(
        "resize",
        updateActiveSection
      );
    };
  }, []);

  return (
    <aside className="fixed left-0 top-0 h-screen w-[260px] border-r border-zinc-800 bg-black/60 backdrop-blur-2xl p-6">
      <div className="mb-10">
        <h1 className="text-3xl font-bold">
          RepoLENS
        </h1>

        <p className="text-zinc-500 text-sm mt-2">
          AI Repository Intelligence
        </p>
      </div>

      <div className="space-y-2">
        {items.map((item) => {
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
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                active === item.id
                    ? "bg-white text-black"
                    : "text-zinc-300 hover:bg-zinc-900 hover:text-white"
                }`}
            >
              <Icon size={18} />

              <span>{item.label}</span>
            </button>
          );
        })}
      </div>
    </aside>
  );
}
