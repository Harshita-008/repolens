"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import {
  BookOpen,
  GitBranch,
  HeartPulse,
  Map,
  Network,
} from "lucide-react";
import ArchitectureGraph from "@/components/repo/ArchitectureGraph";
import RepoChat from "@/components/chat/RepoChat";
import FilePreview from "@/components/repo/FilePreview";
import RepoDashboard from "@/components/dashboard/RepoDashboard";
import RepoHealthReport from "@/components/health/RepoHealthReport";
import PrImpactAnalyzer from "@/components/impact/PrImpactAnalyzer";
import Sidebar from "@/components/layout/Sidebar";
import DependencyHeatmap from "@/components/DependencyHeatmap";
import CommandPalette from "@/components/workspace/CommandPalette";
import MarkdownInsightSection from "@/components/workspace/MarkdownInsightSection";
import RepoHeader from "@/components/workspace/RepoHeader";
import RepoLaunchPanel from "@/components/workspace/RepoLaunchPanel";
import RepoMetrics from "@/components/workspace/RepoMetrics";
import StructurePanel from "@/components/workspace/StructurePanel";
import WorkspaceInspector from "@/components/workspace/WorkspaceInspector";
import WorkspaceSection from "@/components/workspace/WorkspaceSection";
import WorkspaceTabs from "@/components/workspace/WorkspaceTabs";
import WorkspaceChrome from "@/components/workspace/WorkspaceChrome";
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

    requestAnimationFrame(() => {
      document
        .getElementById("files")
        ?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
    });
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
      <CommandPalette enabled={Boolean(data)} />
      <Sidebar hasActiveRepo={Boolean(data)} />

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
                <WorkspaceTabs />
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
              <div className="space-y-5">
                <RepoMetrics data={data} />

                <RepoLaunchPanel
                  repoUrl={repoUrl}
                  loading={loading}
                  error={error}
                  compact
                  onRepoUrlChange={setRepoUrl}
                  onAnalyze={() => analyzeRepo()}
                />

                <RepoDashboard
                  repos={savedRepos}
                  activeRepoName={data.repoName}
                  loadingRepoName={loadingRepoName}
                  onOpenRepo={openSavedRepo}
                />

                <MarkdownInsightSection
                  id="summary"
                  title="Repository Summary"
                  description="A concise orientation to the system, its responsibilities, and the most important concepts."
                  icon={BookOpen}
                  content={data.summary}
                />

                <MarkdownInsightSection
                  id="read-first"
                  title="Read These Files First"
                  description="The shortest path through the codebase for a developer joining the project."
                  icon={GitBranch}
                  content={data.readFirst}
                />

                <MarkdownInsightSection
                  id="roadmap"
                  title="Learning Roadmap"
                  description="A practical sequence for building confidence in this repository."
                  icon={Map}
                  content={data.roadmap}
                />

                <WorkspaceSection
                  id="architecture"
                  title="Architecture Graph"
                  description="Explore system areas, module ownership, dependencies, and data flow."
                  icon={Network}
                >
                  <ArchitectureGraph
                    graph={data.graph}
                    onOpenFile={openFile}
                  />
                </WorkspaceSection>

                <WorkspaceSection
                  id="heatmap"
                  title="Dependency Heatmap"
                  description="Find files with higher dependency gravity and likely review importance."
                  icon={HeartPulse}
                >
                  <DependencyHeatmap data={data.heatmap} />
                </WorkspaceSection>

                <RepoHealthReport report={data.health} />

                <PrImpactAnalyzer repoName={data.repoName} />

                <section id="chat" className="scroll-mt-28">
                  <RepoChat
                    repoName={data.repoName}
                    onOpenFile={openFile}
                  />
                </section>

                <section id="files" className="scroll-mt-28">
                  <FilePreview
                    files={data.importantFiles}
                    selectedPath={selectedFilePath}
                    onSelectFile={setSelectedFilePath}
                  />
                </section>

                <StructurePanel tree={data.tree} />
              </div>
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
          />
        </div>
      </div>
    </main>
  );
}
