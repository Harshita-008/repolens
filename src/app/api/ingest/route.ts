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

import {
  generateRepoSummary,
  generateReadFirst,
  generateRoadmap,
} from "@/lib/parser/architectureAnalyzer";

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

    saveRepoContext({
      repoName,
      tree,
      summary,
      roadmap,
      files,
    });

    return NextResponse.json({
      success: true,
      repoName,
      totalFiles: files.length,
      tree,
      graph,
      summary,
      readFirst,
      roadmap,
      heatmap,
      importantFiles,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Failed to analyze repository" },
      { status: 500 }
    );
  }
}
