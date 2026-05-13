"use client";

import {
  BookOpen,
  FileCode2,
  GitPullRequest,
  Map,
  MessageSquare,
  Network,
  ShieldCheck,
} from "lucide-react";

const tabs = [
  { label: "Overview", id: "dashboard", icon: BookOpen },
  { label: "Architecture", id: "architecture", icon: Network },
  { label: "Health", id: "health", icon: ShieldCheck },
  { label: "PR Impact", id: "impact", icon: GitPullRequest },
  { label: "Chat", id: "chat", icon: MessageSquare },
  { label: "Files", id: "files", icon: FileCode2 },
  { label: "Roadmap", id: "roadmap", icon: Map },
];

export default function WorkspaceTabs() {
  return (
    <div className="overflow-x-auto bg-black py-2 custom-scrollbar">
      <div className="flex min-w-max gap-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;

          return (
            <button
              key={tab.id}
              onClick={() =>
                document
                  .getElementById(tab.id)
                  ?.scrollIntoView({ behavior: "smooth" })
              }
              className="inline-flex h-9 items-center gap-2 rounded-lg border border-zinc-800 bg-zinc-950 px-3 text-sm text-zinc-300 transition hover:border-zinc-600 hover:text-white"
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
