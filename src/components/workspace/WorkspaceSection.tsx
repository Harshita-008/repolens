"use client";

import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";

interface WorkspaceSectionProps {
  id: string;
  title: string;
  description?: string;
  icon?: LucideIcon;
  children: ReactNode;
  action?: ReactNode;
  className?: string;
}

export default function WorkspaceSection({
  id,
  title,
  description,
  icon: Icon,
  children,
  action,
  className = "",
}: WorkspaceSectionProps) {
  return (
    <section
      id={id}
      className={`scroll-mt-28 rounded-xl border border-zinc-800 bg-zinc-950/70 shadow-2xl shadow-black/20 ${className}`}
    >
      <div className="flex flex-wrap items-start justify-between gap-4 border-b border-zinc-800 px-5 py-4">
        <div className="flex min-w-0 items-start gap-3">
          {Icon && (
            <div className="grid h-9 w-9 shrink-0 place-items-center rounded-lg border border-zinc-800 bg-black text-cyan-300">
              <Icon size={17} />
            </div>
          )}

          <div className="min-w-0">
            <h2 className="text-lg font-semibold text-white">
              {title}
            </h2>
            {description && (
              <p className="mt-1 text-sm leading-6 text-zinc-400">
                {description}
              </p>
            )}
          </div>
        </div>

        {action}
      </div>

      <div className="p-5">{children}</div>
    </section>
  );
}
