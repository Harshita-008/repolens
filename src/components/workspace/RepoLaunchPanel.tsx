"use client";

import {
  AlertTriangle,
  ArrowRight,
  FolderGit2,
  Loader2,
} from "lucide-react";
import AnalysisProgress from "@/components/dashboard/AnalysisProgress";

interface RepoLaunchPanelProps {
  repoUrl: string;
  loading: boolean;
  error?: string;
  compact?: boolean;
  onRepoUrlChange: (value: string) => void;
  onAnalyze: () => void;
}

const exampleRepos = [
  "https://github.com/appwrite/demo-todo-with-nextjs",
  "https://github.com/vercel/ai-chatbot",
  "https://github.com/supabase/supabase",
];

export default function RepoLaunchPanel({
  repoUrl,
  loading,
  error,
  compact = false,
  onRepoUrlChange,
  onAnalyze,
}: RepoLaunchPanelProps) {
  if (compact) {
    return (
      <section
        id="top"
        className="rounded-xl border border-zinc-800 bg-zinc-950/70 p-4"
      >
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
          <div className="flex min-w-0 items-center gap-3 lg:w-56">
            <div className="grid h-9 w-9 shrink-0 place-items-center rounded-lg border border-zinc-800 bg-black text-cyan-300">
              <FolderGit2 size={16} />
            </div>
            <div className="min-w-0">
              <div className="text-sm font-medium text-white">
                Analyze another repo
              </div>
              <div className="truncate text-xs text-zinc-500">
                Public GitHub URL
              </div>
            </div>
          </div>

          <input
            value={repoUrl}
            onChange={(event) =>
              onRepoUrlChange(event.target.value)
            }
            placeholder="Paste GitHub repository URL..."
            className="min-h-11 flex-1 rounded-lg border border-zinc-800 bg-black px-4 text-sm text-zinc-100 outline-none transition placeholder:text-zinc-600 focus:border-cyan-400"
          />

          <button
            onClick={onAnalyze}
            disabled={loading || !repoUrl.trim()}
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-white px-4 text-sm font-semibold text-black transition hover:bg-zinc-200 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                Analyzing
              </>
            ) : (
              <>
                Analyze
                <ArrowRight size={16} />
              </>
            )}
          </button>
        </div>

        {error && (
          <div className="mt-3 flex gap-3 rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-100">
            <AlertTriangle size={17} className="mt-0.5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <AnalysisProgress active={loading} />
      </section>
    );
  }

  return (
    <section
      id="top"
      className="rounded-xl border border-zinc-800 bg-zinc-950/80 p-5 shadow-2xl shadow-black/30"
    >
      <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <div>
          <div className="mb-4 inline-flex items-center gap-2 rounded-lg border border-zinc-800 bg-black px-3 py-2 text-xs font-medium text-zinc-300">
            <FolderGit2 size={14} className="text-cyan-300" />
            Repository intelligence workspace
          </div>

          <h1 className="text-3xl font-semibold tracking-tight text-white md:text-4xl">
            Understand, review, and ship unfamiliar code with confidence.
          </h1>

          <p className="mt-3 max-w-2xl text-sm leading-6 text-zinc-400">
            Analyze a public GitHub repository to generate architecture,
            onboarding guidance, health signals, chat context, and PR impact
            review focus in one workspace.
          </p>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <input
              value={repoUrl}
              onChange={(event) =>
                onRepoUrlChange(event.target.value)
              }
              placeholder="Paste GitHub repository URL..."
              className="min-h-12 flex-1 rounded-lg border border-zinc-800 bg-black px-4 text-sm text-zinc-100 outline-none transition placeholder:text-zinc-600 focus:border-cyan-400"
            />

            <button
              onClick={onAnalyze}
              disabled={loading || !repoUrl.trim()}
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-lg bg-white px-5 text-sm font-semibold text-black transition hover:bg-zinc-200 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Analyzing
                </>
              ) : (
                <>
                  Analyze Repo
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </div>

          {error && (
            <div className="mt-4 flex gap-3 rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-100">
              <AlertTriangle size={17} className="mt-0.5 shrink-0" />
              <span>{error}</span>
            </div>
          )}
        </div>

        <div className="rounded-lg border border-zinc-800 bg-black/40 p-4">
          <div className="text-sm font-medium text-zinc-200">
            Try a known repo
          </div>
          <div className="mt-3 space-y-2">
            {exampleRepos.map((example) => (
              <button
                key={example}
                onClick={() => onRepoUrlChange(example)}
                className="block w-full truncate rounded-lg border border-zinc-800 px-3 py-2 text-left text-xs text-zinc-400 transition hover:border-zinc-600 hover:text-zinc-100"
              >
                {example}
              </button>
            ))}
          </div>
        </div>
      </div>

      <AnalysisProgress active={loading} />
    </section>
  );
}
