import type { AnalysisData } from "@/lib/repositories/types";

export function buildArchitectureDoc(data: AnalysisData) {
  return `# ${data.repoName} Architecture

## Summary

${data.summary}

## Read First

${data.readFirst}

## Learning Roadmap

${data.roadmap}

## Health

- Score: ${data.health.score}/100
- Grade: ${data.health.grade}
- Findings: ${data.health.issues.length}

## Important Files

${data.importantFiles.map((file) => `- ${file.path}`).join("\n")}
`;
}
