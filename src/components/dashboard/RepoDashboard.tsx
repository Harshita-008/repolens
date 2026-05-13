"use client";

import { Clock, FolderGit2, ShieldCheck } from "lucide-react";
import { AnalysisListItem } from "@/lib/repositories/types";

interface Props {
  repos: AnalysisListItem[];
  activeRepoName?: string;
  loadingRepoName?: string;
  onOpenRepo: (repoName: string) => void;
}

export default function RepoDashboard({
  repos,
  activeRepoName,
  loadingRepoName,
  onOpenRepo,
}: Props) {
  return (
    <section
      id="saved-repos"
      className="scroll-mt-28 rounded-xl border border-zinc-800 bg-zinc-950/70"
    >
      <div className="flex items-center justify-between gap-4 border-b border-zinc-800 px-5 py-4">
        <div>
          <h2 className="text-lg font-semibold text-white">
            Saved Workspaces
          </h2>
          <p className="mt-1 text-sm text-zinc-400">
            Reopen recent analyses without cloning again.
          </p>
        </div>

        <span className="rounded-full border border-zinc-700 px-3 py-1 text-xs text-zinc-400">
          {repos.length} saved
        </span>
      </div>

      <div className="p-5">
        {repos.length === 0 ? (
          <div className="rounded-lg border border-dashed border-zinc-700 p-6 text-sm text-zinc-400">
            Analyze a repository to create the first saved workspace.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
            {repos.map((repo) => (
              <button
                key={repo.repoName}
                onClick={() => onOpenRepo(repo.repoName)}
                className={`rounded-lg border p-4 text-left transition ${
                  activeRepoName === repo.repoName
                    ? "border-cyan-400 bg-cyan-400/10"
                    : "border-zinc-800 bg-black/30 hover:border-zinc-600 hover:bg-black/50"
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <FolderGit2 size={16} className="shrink-0 text-zinc-400" />
                      <span className="truncate font-medium">
                        {repo.repoName}
                      </span>
                    </div>
                    <p className="mt-2 truncate text-xs text-zinc-500">
                      {repo.repoUrl || "Local analysis"}
                    </p>
                  </div>

                  <span className="rounded-md bg-white px-2 py-1 text-xs font-semibold text-black">
                    {repo.healthGrade}
                  </span>
                </div>

                <div className="mt-4 flex flex-wrap gap-3 text-xs text-zinc-400">
                  <span className="inline-flex items-center gap-1">
                    <ShieldCheck size={14} />
                    {repo.healthScore}/100
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <Clock size={14} />
                    {new Date(repo.analyzedAt).toLocaleString()}
                  </span>
                </div>

                {repo.topRisks.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {repo.topRisks.map((risk, index) => (
                      <span
                        key={`${risk}-${index}`}
                        className="rounded-md border border-amber-500/30 bg-amber-500/10 px-2 py-1 text-xs text-amber-200"
                      >
                        {risk}
                      </span>
                    ))}
                  </div>
                )}

                {loadingRepoName === repo.repoName && (
                  <div className="mt-3 text-xs text-cyan-300">
                    Opening saved workspace...
                  </div>
                )}
              </button>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
