import { RepoChatContext } from "../chat/types";
import { GraphNode } from "../parser/graph/types";
import {
  ImpactFile,
  PrImpactReport,
} from "../repositories/types";
import { parseDiff } from "./parseDiff";

export function analyzeDiffImpact(input: {
  diff: string;
  context: RepoChatContext;
  graph?: {
    nodes: GraphNode[];
  };
}): PrImpactReport {
  const parsedFiles = parseDiff(input.diff);
  const graphNodes = input.graph?.nodes || [];

  const changedFiles: ImpactFile[] = parsedFiles.map((file) => {
    const reasons = getRiskReasons(file.path, file.additions + file.deletions);
    const risk: ImpactFile["risk"] = reasons.some((reason) =>
      /auth|database|api|config|large/i.test(reason)
    )
      ? "high"
      : reasons.length > 1
        ? "medium"
        : "low";

    return {
      ...file,
      risk,
      reasons,
    };
  });

  const changedPaths = new Set(
    changedFiles.map((file) => file.path)
  );
  const affectedModules = graphNodes
    .filter((node) =>
      node.data.files?.some((file) => changedPaths.has(file))
    )
    .map((node) => ({
      id: node.id,
      label: node.data.label,
      category: node.data.category,
      files: node.data.files || [],
    }));

  const suggestedTests = buildSuggestedTests(changedFiles);
  const reviewFocus = buildReviewFocus(changedFiles, affectedModules.length);

  return {
    changedFiles,
    affectedModules,
    suggestedTests,
    reviewFocus,
    summary: buildSummary(changedFiles, affectedModules.length),
  };
}

function getRiskReasons(path: string, churn: number) {
  const lowerPath = path.toLowerCase();
  const reasons = [];

  if (churn > 120) reasons.push("Large change set");
  if (/api|route|controller|server/.test(lowerPath)) {
    reasons.push("API or server behavior changed");
  }
  if (/auth|session|token|jwt|oauth|credential|permission/.test(lowerPath)) {
    reasons.push("Authentication or authorization area");
  }
  if (/db|database|schema|migration|prisma/.test(lowerPath)) {
    reasons.push("Database or schema area");
  }
  if (/config|env|package\.json|lock/.test(lowerPath)) {
    reasons.push("Configuration or dependency surface");
  }
  if (/test|spec/.test(lowerPath)) {
    reasons.push("Test coverage changed");
  }

  return reasons.length > 0 ? reasons : ["Localized source change"];
}

function buildSuggestedTests(
  files: PrImpactReport["changedFiles"]
) {
  const tests = new Set<string>([
    "Run the app build and lint checks.",
  ]);

  if (files.some((file) => /api|route|server/i.test(file.path))) {
    tests.add("Exercise affected API routes with success and failure cases.");
  }

  if (files.some((file) => /component|page|app\//i.test(file.path))) {
    tests.add("Run a browser smoke test for the changed user flow.");
  }

  if (files.some((file) => /db|schema|migration|prisma/i.test(file.path))) {
    tests.add("Validate migrations and data access paths on a disposable database.");
  }

  if (files.some((file) => /auth|token|jwt|oauth|session/i.test(file.path))) {
    tests.add("Test unauthorized, expired-session, and happy-path access.");
  }

  return Array.from(tests);
}

function buildReviewFocus(
  files: PrImpactReport["changedFiles"],
  moduleCount: number
) {
  const focus = [
    "Confirm the diff matches the intended behavior change.",
    "Check error handling and empty states around changed paths.",
  ];

  if (files.some((file) => file.risk === "high")) {
    focus.unshift("Review high-risk files first before cosmetic changes.");
  }

  if (moduleCount > 2) {
    focus.push("Trace cross-module effects because this change touches several architecture areas.");
  }

  return focus;
}

function buildSummary(
  files: PrImpactReport["changedFiles"],
  moduleCount: number
) {
  const highRiskCount = files.filter(
    (file) => file.risk === "high"
  ).length;

  return `${files.length} changed file${files.length === 1 ? "" : "s"} detected, affecting ${moduleCount} mapped module${moduleCount === 1 ? "" : "s"}. ${highRiskCount} file${highRiskCount === 1 ? "" : "s"} need senior review attention.`;
}
