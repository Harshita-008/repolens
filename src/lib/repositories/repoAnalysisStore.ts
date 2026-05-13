import fs from "fs";
import path from "path";
import { analyzeRepoHealth } from "../health/analyzeRepoHealth";
import {
  AnalysisData,
  AnalysisListItem,
} from "./types";

const STORE_DIR = path.join(process.cwd(), ".repolens");
const STORE_FILE = path.join(STORE_DIR, "analyses.json");
const MAX_ANALYSES = 12;

function ensureStore() {
  if (!fs.existsSync(STORE_DIR)) {
    fs.mkdirSync(STORE_DIR, { recursive: true });
  }

  if (!fs.existsSync(STORE_FILE)) {
    fs.writeFileSync(STORE_FILE, "[]", "utf-8");
  }
}

function readStore(): AnalysisData[] {
  ensureStore();

  try {
    const raw = fs.readFileSync(STORE_FILE, "utf-8");
    const parsed = JSON.parse(raw);

    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeStore(analyses: AnalysisData[]) {
  ensureStore();
  fs.writeFileSync(
    STORE_FILE,
    JSON.stringify(analyses, null, 2),
    "utf-8"
  );
}

export function saveAnalysis(
  analysis: AnalysisData
): AnalysisData {
  const analyses = readStore().filter(
    (item) => item.repoName !== analysis.repoName
  );

  analyses.unshift(analysis);
  writeStore(analyses.slice(0, MAX_ANALYSES));

  return analysis;
}

export function getAnalysis(repoName: string) {
  const analysis = readStore().find(
    (analysis) => analysis.repoName === repoName
  );

  return analysis ? normalizeAnalysis(analysis) : undefined;
}

export function listAnalyses(): AnalysisListItem[] {
  return readStore().map(normalizeAnalysis).map((analysis) => ({
    repoName: analysis.repoName,
    repoUrl: analysis.repoUrl,
    analyzedAt: analysis.analyzedAt,
    totalFiles: analysis.totalFiles,
    healthScore: analysis.health.score,
    healthGrade: analysis.health.grade,
    topRisks: Array.from(
      new Set(
        analysis.health.issues
          .filter((issue) => issue.severity !== "low")
          .map((issue) => issue.title)
      )
    ).slice(0, 3),
  }));
}

function normalizeAnalysis(
  analysis: AnalysisData
): AnalysisData {
  return {
    ...analysis,
    health: analyzeRepoHealth(
      analysis.contextFiles || [],
      analysis.tree
    ),
  };
}
