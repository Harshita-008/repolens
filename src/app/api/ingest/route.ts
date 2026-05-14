import { NextRequest, NextResponse } from "next/server";
import { cloneRepo } from "@/lib/git/cloneRepo";
import { scanRepoFiles } from "@/lib/git/fileScanner";
import { generateRepoTree } from "@/lib/git/repoTree";
import { generateDependencyHeatmap } from "@/lib/parser/dependencyHeatmap";
import { generateGraph } from "@/lib/parser/generateGraph";
import { detectArchitecture } from "@/lib/parser/detectArchitecture";
import { analyzeStructure } from "@/lib/parser/analyzeStructure";
import { findImportantFiles } from "@/lib/parser/findImportantFiles";
import { detectTechStack } from "../../../lib/parser/detectTechStack";
import { saveRepoContext } from "@/lib/chat/repoContextStore";
import { analyzeRepoHealth } from "@/lib/health/analyzeRepoHealth";
import { saveAnalysis } from "@/lib/repositories/repoAnalysisStore";

import {
  generateRepoSummary,
  generateReadFirst,
  generateRoadmap,
} from "@/lib/parser/architectureAnalyzer";

export const runtime = "nodejs";
export const maxDuration = 60;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const { repoUrl } = body;

    if (!repoUrl) {
      return NextResponse.json(
        { error: "Repository URL required" },
        { status: 400 }
      );
    }

    const { repoName, repoPath } =
      await cloneRepo(repoUrl);

    const files = scanRepoFiles(repoPath);
    const tree = generateRepoTree(repoPath);
    const graph = generateGraph(files);
    const architecture = detectArchitecture(files);
    const structure = analyzeStructure(files);
    const dependencies = detectTechStack(repoPath);
    const importantFiles = findImportantFiles(files);

    // await storeRepoEmbeddings(repoName, files);

    const analysisInput = {
      tree,
      files,
      importantFiles,
      structure,
      architecture,
      dependencies,
    };

    const heatmap = generateDependencyHeatmap(files);

    const [
      summary,
      readFirst,
      roadmap,
    ] = await Promise.all([
      generateRepoSummary(analysisInput),
      generateReadFirst(analysisInput),
      generateRoadmap(analysisInput),
    ]);

    const health = analyzeRepoHealth(files, tree);

    saveRepoContext({
      repoName,
      tree,
      summary,
      roadmap,
      files,
    });

    const analysis = saveAnalysis({
      repoName,
      repoUrl,
      analyzedAt: new Date().toISOString(),
      totalFiles: files.length,
      tree,
      graph,
      summary,
      readFirst,
      roadmap,
      heatmap,
      contextFiles: files,
      importantFiles,
      health,
    });

    return NextResponse.json({
      success: true,
      ...analysis,
    });
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Failed to analyze repository";

    console.error(error);

    return NextResponse.json(
      { error: getClientSafeError(message) },
      { status: 500 }
    );
  }
}

function getClientSafeError(message: string) {
  if (message.includes("OPENROUTER_API_KEY")) {
    return "OPENROUTER_API_KEY is missing in the deployment environment.";
  }

  if (message.includes("GEMINI_API_KEY")) {
    return "GEMINI_API_KEY is missing in the deployment environment.";
  }

  if (message.includes("Failed to clone repository")) {
    return "Could not clone the repository. Check that the URL is public and reachable from the deployment.";
  }

  if (message.includes("rate limit")) {
    return "GitHub rate limit was reached. Add GITHUB_TOKEN in the deployment environment or try again later.";
  }

  return "Failed to analyze repository. Check the repository URL, API keys, and deployment function logs.";
}
