import { RepoFile } from "../git/fileScanner";
import {
  GraphEdge,
  GraphNode,
} from "../parser/graph/types";

export interface RepoHealthIssue {
  id: string;
  title: string;
  severity: "low" | "medium" | "high";
  detail: string;
  files: string[];
  recommendation: string;
}

export interface RepoHealthReport {
  score: number;
  grade: "A" | "B" | "C" | "D";
  signals: {
    hasReadme: boolean;
    hasTests: boolean;
    hasCi: boolean;
    hasDocker: boolean;
    hasEnvExample: boolean;
    packageManagers: string[];
  };
  issues: RepoHealthIssue[];
}

export interface AnalysisData {
  repoName: string;
  repoUrl?: string;
  analyzedAt: string;
  totalFiles: number;
  tree: string;
  graph: {
    nodes: GraphNode[];
    edges: GraphEdge[];
  };
  summary: string;
  readFirst: string;
  roadmap: string;
  heatmap: {
    path: string;
    score: number;
  }[];
  contextFiles: RepoFile[];
  importantFiles: RepoFile[];
  health: RepoHealthReport;
}

export interface AnalysisListItem {
  repoName: string;
  repoUrl?: string;
  analyzedAt: string;
  totalFiles: number;
  healthScore: number;
  healthGrade: RepoHealthReport["grade"];
  topRisks: string[];
}

export interface ImpactFile {
  path: string;
  additions: number;
  deletions: number;
  risk: "low" | "medium" | "high";
  reasons: string[];
}

export interface PrImpactReport {
  changedFiles: ImpactFile[];
  affectedModules: {
    id: string;
    label: string;
    category: string;
    files: string[];
  }[];
  suggestedTests: string[];
  reviewFocus: string[];
  summary: string;
}
