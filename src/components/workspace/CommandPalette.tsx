"use client";

import { useEffect, useMemo, useState } from "react";
import {
  BookOpen,
  FileText,
  GitPullRequest,
  Map,
  MessageSquare,
  Network,
  Search,
  ShieldCheck,
} from "lucide-react";

interface CommandPaletteProps {
  enabled: boolean;
}

const commands = [
  { label: "Open Summary", id: "summary", icon: FileText },
  { label: "Open Read First", id: "read-first", icon: BookOpen },
  { label: "Open Roadmap", id: "roadmap", icon: Map },
  { label: "Open Architecture", id: "architecture", icon: Network },
  { label: "Open Health", id: "health", icon: ShieldCheck },
  { label: "Open PR Impact", id: "impact", icon: GitPullRequest },
  { label: "Open Chat", id: "chat", icon: MessageSquare },
  { label: "Open Files", id: "files", icon: FileText },
];

export default function CommandPalette({
  enabled,
}: CommandPaletteProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (!enabled) return;

      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setOpen((current) => !current);
      }

      if (event.key === "Escape") {
        setOpen(false);
      }
    }

    window.addEventListener("keydown", onKeyDown);

    return () => window.removeEventListener("keydown", onKeyDown);
  }, [enabled]);

  const filteredCommands = useMemo(
    () =>
      commands.filter((command) =>
        command.label.toLowerCase().includes(query.toLowerCase())
      ),
    [query]
  );

  if (!enabled || !open) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 px-4 pt-24 backdrop-blur-sm">
      <div className="mx-auto max-w-xl overflow-hidden rounded-xl border border-zinc-800 bg-zinc-950 shadow-2xl shadow-black">
        <div className="flex items-center gap-3 border-b border-zinc-800 px-4 py-3">
          <Search size={17} className="text-zinc-500" />
          <input
            autoFocus
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Jump to a workspace section..."
            className="w-full bg-transparent text-sm text-zinc-100 outline-none placeholder:text-zinc-600"
          />
          <span className="rounded border border-zinc-800 px-2 py-1 text-xs text-zinc-500">
            Esc
          </span>
        </div>

        <div className="max-h-80 overflow-auto p-2 custom-scrollbar">
          {filteredCommands.map((command) => {
            const Icon = command.icon;

            return (
              <button
                key={command.id}
                onClick={() => {
                  setOpen(false);
                  document
                    .getElementById(command.id)
                    ?.scrollIntoView({ behavior: "smooth" });
                }}
                className="flex w-full items-center gap-3 rounded-lg px-3 py-3 text-left text-sm text-zinc-300 transition hover:bg-zinc-900 hover:text-white"
              >
                <Icon size={16} className="text-cyan-300" />
                {command.label}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
