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
      id="dashboard"
      className="rounded-2xl border border-zinc-800 bg-zinc-900/80 p-6 scroll-mt-24"
    >
      <div className="mb-5 flex items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-semibold">
            Persistent Repo Dashboard
          </h2>
          <p className="mt-1 text-sm text-zinc-400">
            Reopen recent analyses without cloning again.
          </p>
        </div>

        <span className="rounded-full border border-zinc-700 px-3 py-1 text-xs text-zinc-400">
          {repos.length} saved
        </span>
      </div>

      {repos.length === 0 ? (
        <div className="rounded-xl border border-dashed border-zinc-700 p-6 text-sm text-zinc-400">
          Analyze a repository to create the first saved workspace.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          {repos.map((repo) => (
            <button
              key={repo.repoName}
              onClick={() => onOpenRepo(repo.repoName)}
              className={`rounded-xl border p-4 text-left transition ${
                activeRepoName === repo.repoName
                  ? "border-cyan-400 bg-cyan-400/10"
                  : "border-zinc-800 bg-black/30 hover:border-zinc-600"
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

                <span className="rounded-full bg-white px-2 py-1 text-xs font-semibold text-black">
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
                  {repo.topRisks.map((risk) => (
                    <span
                      key={risk}
                      className="rounded-full border border-amber-500/30 bg-amber-500/10 px-2 py-1 text-xs text-amber-200"
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
    </section>
  );
}
