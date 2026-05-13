import { NextRequest, NextResponse } from "next/server";
import {
  getRepoContext,
  saveRepoContext,
} from "@/lib/chat/repoContextStore";
import { analyzeDiffImpact } from "@/lib/diff/analyzeDiffImpact";
import { fetchGithubPrDiff } from "@/lib/diff/fetchGithubPrDiff";
import { getAnalysis } from "@/lib/repositories/repoAnalysisStore";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const repoName =
      typeof body.repoName === "string" ? body.repoName : "";
    let diff = typeof body.diff === "string" ? body.diff : "";
    const prUrl =
      typeof body.prUrl === "string" ? body.prUrl.trim() : "";

    if (!repoName || (!diff.trim() && !prUrl)) {
      return NextResponse.json(
        { error: "Repository name and diff or PR URL are required." },
        { status: 400 }
      );
    }

    if (!diff.trim() && prUrl) {
      try {
        diff = await fetchGithubPrDiff(prUrl);
      } catch (diffError) {
        return NextResponse.json(
          {
            error:
              diffError instanceof Error
                ? diffError.message
                : "Could not fetch PR diff from GitHub.",
          },
          { status: 400 }
        );
      }
    }

    let context = getRepoContext(repoName);
    const analysis = getAnalysis(repoName);

    if (!context && analysis) {
      saveRepoContext({
        repoName: analysis.repoName,
        tree: analysis.tree,
        summary: analysis.summary,
        roadmap: analysis.roadmap,
        files: analysis.contextFiles,
      });

      context = getRepoContext(repoName);
    }

    if (!context) {
      return NextResponse.json(
        { error: "Analyze or reopen this repository before checking a diff." },
        { status: 404 }
      );
    }

    return NextResponse.json(
      analyzeDiffImpact({
        diff,
        context,
        graph: analysis?.graph,
      })
    );
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Failed to analyze diff impact." },
      { status: 500 }
    );
  }
}
