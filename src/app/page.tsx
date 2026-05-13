"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import RepoDashboard from "@/components/dashboard/RepoDashboard";
import Sidebar from "@/components/layout/Sidebar";
import CommandPalette from "@/components/workspace/CommandPalette";
import RepoHeader from "@/components/workspace/RepoHeader";
import RepoLaunchPanel from "@/components/workspace/RepoLaunchPanel";
import WorkspaceInspector from "@/components/workspace/WorkspaceInspector";
import WorkspaceTabs from "@/components/workspace/WorkspaceTabs";
import WorkspaceChrome from "@/components/workspace/WorkspaceChrome";
import WorkspaceViewContent from "@/components/workspace/WorkspaceViewContent";
import type { WorkspaceView } from "@/components/workspace/workspaceViews";
import type {
  AnalysisData,
  AnalysisListItem,
} from "@/lib/repositories/types";

export default function HomePage() {
  const [repoUrl, setRepoUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingRepoName, setLoadingRepoName] =
    useState("");
  const [error, setError] = useState("");
  const [data, setData] =
    useState<AnalysisData | null>(null);
  const [savedRepos, setSavedRepos] = useState<
    AnalysisListItem[]
  >([]);
  const [selectedFilePath, setSelectedFilePath] =
    useState<string>("");
  const [activeView, setActiveView] =
    useState<WorkspaceView>("overview");

  useEffect(() => {
    loadSavedRepos();
  }, []);

  async function loadSavedRepos() {
    try {
      const response = await axios.get("/api/repos");
      setSavedRepos(response.data.repos || []);
    } catch (loadError) {
      console.error(loadError);
    }
  }

  function applyAnalysis(nextData: AnalysisData) {
    setData(nextData);
    setActiveView("overview");
    if (nextData.repoUrl) {
      setRepoUrl(nextData.repoUrl);
    }
    setSelectedFilePath(
      nextData.importantFiles?.[0]?.path || ""
    );

    localStorage.setItem("repoName", nextData.repoName);
    localStorage.setItem("repoTree", nextData.tree);
    localStorage.setItem("repoSummary", nextData.summary);
    localStorage.setItem("repoRoadmap", nextData.roadmap);
  }

  function openFile(path: string) {
    setSelectedFilePath(path);
    setActiveView("files");
  }

  async function analyzeRepo(targetRepoUrl?: string) {
    const nextRepoUrl = targetRepoUrl || repoUrl;

    if (!nextRepoUrl.trim() || loading) return;

    try {
      setError("");
      setLoading(true);
      setRepoUrl(nextRepoUrl);

      const response = await axios.post("/api/ingest", {
        repoUrl: nextRepoUrl,
      });

      applyAnalysis(response.data);
      await loadSavedRepos();
    } catch (analyzeError) {
      console.error(analyzeError);
      setError(
        "Could not analyze this repository. Check that the URL is public and your API keys are configured."
      );
    } finally {
      setLoading(false);
    }
  }

  async function openSavedRepo(repoName: string) {
    try {
      setError("");
      setLoadingRepoName(repoName);

      const response = await axios.get(
        `/api/repos/${encodeURIComponent(repoName)}`
      );

      applyAnalysis(response.data);
    } catch (openError) {
      console.error(openError);
      setError(
        "Could not reopen this saved workspace. Try re-analyzing the repository."
      );
    } finally {
      setLoadingRepoName("");
    }
  }

  return (
    <main className="min-h-screen bg-black text-white">
      <CommandPalette
        enabled={Boolean(data)}
        onViewChange={setActiveView}
      />
      <Sidebar
        hasActiveRepo={Boolean(data)}
        activeView={activeView}
        onViewChange={setActiveView}
      />

      <div className="min-h-screen lg:pl-[280px]">
        <div className="mx-auto grid max-w-[1600px] gap-5 px-4 py-5 lg:px-6 xl:grid-cols-[minmax(0,1fr)_280px]">
          <div className="min-w-0 space-y-5">
            {data && (
              <WorkspaceChrome>
                <RepoHeader
                  data={data}
                  loading={loading}
                  onReanalyze={() =>
                    analyzeRepo(data.repoUrl || repoUrl)
                  }
                />
                <WorkspaceTabs
                  activeView={activeView}
                  onViewChange={setActiveView}
                />
              </WorkspaceChrome>
            )}

            {!data && (
              <RepoLaunchPanel
                repoUrl={repoUrl}
                loading={loading}
                error={error}
                onRepoUrlChange={setRepoUrl}
                onAnalyze={() => analyzeRepo()}
              />
            )}

            {data && (
              <WorkspaceViewContent
                view={activeView}
                data={data}
                repoUrl={repoUrl}
                loading={loading}
                error={error}
                savedRepos={savedRepos}
                loadingRepoName={loadingRepoName}
                selectedFilePath={selectedFilePath}
                onRepoUrlChange={setRepoUrl}
                onAnalyze={() => analyzeRepo()}
                onOpenSavedRepo={openSavedRepo}
                onOpenFile={openFile}
                onSelectFile={setSelectedFilePath}
              />
            )}

            {!data && (
              <RepoDashboard
                repos={savedRepos}
                activeRepoName={undefined}
                loadingRepoName={loadingRepoName}
                onOpenRepo={openSavedRepo}
              />
            )}
          </div>

          <WorkspaceInspector
            data={data}
            selectedFilePath={selectedFilePath}
            activeView={activeView}
            onViewChange={setActiveView}
          />
        </div>
      </div>
    </main>
  );
}
