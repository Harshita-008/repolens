"use client";

import {
  BookOpen,
  GitBranch,
  HeartPulse,
  Map,
  Network,
} from "lucide-react";
import ArchitectureGraph from "@/components/repo/ArchitectureGraph";
import DependencyHeatmap from "@/components/DependencyHeatmap";
import ExportDocsPanel from "@/components/docs/ExportDocsPanel";
import FilePreview from "@/components/repo/FilePreview";
import PrImpactAnalyzer from "@/components/impact/PrImpactAnalyzer";
import RepoDashboard from "@/components/dashboard/RepoDashboard";
import RepoHealthReport from "@/components/health/RepoHealthReport";
import RepoCodeSearch from "@/components/search/RepoCodeSearch";
import TestGapPanel from "@/components/quality/TestGapPanel";
import MarkdownInsightSection from "./MarkdownInsightSection";
import RepoLaunchPanel from "./RepoLaunchPanel";
import RepoMetrics from "./RepoMetrics";
import StructurePanel from "./StructurePanel";
import WorkspaceSection from "./WorkspaceSection";
import type {
  AnalysisData,
  AnalysisListItem,
} from "@/lib/repositories/types";
import type { WorkspaceView } from "./workspaceViews";

interface WorkspaceViewContentProps {
  view: WorkspaceView;
  data: AnalysisData;
  repoUrl: string;
  loading: boolean;
  error: string;
  savedRepos: AnalysisListItem[];
  loadingRepoName: string;
  selectedFilePath: string;
  onRepoUrlChange: (value: string) => void;
  onAnalyze: () => void;
  onOpenSavedRepo: (repoName: string) => void;
  onOpenFile: (path: string) => void;
  onSelectFile: (path: string) => void;
}

export default function WorkspaceViewContent({
  view,
  data,
  repoUrl,
  loading,
  error,
  savedRepos,
  loadingRepoName,
  selectedFilePath,
  onRepoUrlChange,
  onAnalyze,
  onOpenSavedRepo,
  onOpenFile,
  onSelectFile,
}: WorkspaceViewContentProps) {
  if (view === "overview") {
    return (
      <div className="space-y-5">
        <RepoMetrics data={data} />

        <RepoLaunchPanel
          repoUrl={repoUrl}
          loading={loading}
          error={error}
          compact
          onRepoUrlChange={onRepoUrlChange}
          onAnalyze={onAnalyze}
        />

        <RepoDashboard
          repos={savedRepos}
          activeRepoName={data.repoName}
          loadingRepoName={loadingRepoName}
          onOpenRepo={onOpenSavedRepo}
        />

        <ExportDocsPanel data={data} />

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
      </div>
    );
  }

  if (view === "architecture") {
    return (
      <div className="space-y-5">
        <WorkspaceSection
          id="architecture"
          title="Architecture Graph"
          description="Explore system areas, module ownership, dependencies, and data flow."
          icon={Network}
        >
          <ArchitectureGraph
            graph={data.graph}
            onOpenFile={onOpenFile}
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
      </div>
    );
  }

  if (view === "health") {
    return (
      <div className="space-y-5">
        <RepoHealthReport report={data.health} />
        <TestGapPanel data={data} />
      </div>
    );
  }

  if (view === "impact") {
    return <PrImpactAnalyzer repoName={data.repoName} />;
  }

  if (view === "files") {
    return (
      <div className="space-y-5">
        <RepoCodeSearch data={data} onOpenFile={onOpenFile} />

        <section id="files" className="scroll-mt-28">
          <FilePreview
            files={data.importantFiles}
            selectedPath={selectedFilePath}
            onSelectFile={onSelectFile}
          />
        </section>

        <StructurePanel tree={data.tree} />
      </div>
    );
  }

  return (
    <MarkdownInsightSection
      id="roadmap"
      title="Learning Roadmap"
      description="A practical sequence for building confidence in this repository."
      icon={Map}
      content={data.roadmap}
    />
  );
}
