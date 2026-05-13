import type { AnalysisData } from "@/lib/repositories/types";

export interface TestGap {
  path: string;
  priority: "high" | "medium" | "low";
  suggestedTestPath: string;
  reason: string;
}

export function detectTestGaps(data: AnalysisData): TestGap[] {
  const allPaths = extractPathsFromTree(data.tree);
  const testPaths = new Set(allPaths.filter(isTestPath));

  return data.importantFiles
    .filter((file) => isTestableSource(file.path))
    .filter((file) => !hasNearbyTest(file.path, testPaths))
    .slice(0, 8)
    .map((file) => ({
      path: file.path,
      priority: getPriority(file.path),
      suggestedTestPath: suggestTestPath(file.path),
      reason: getReason(file.path),
    }));
}

function extractPathsFromTree(tree: string) {
  const stack: string[] = [];
  const paths: string[] = [];

  for (const line of tree.split(/\r?\n/)) {
    const match = line.match(/^(\s*)- (.+)$/);

    if (!match) continue;

    const depth = Math.floor(match[1].length / 2);
    const name = match[2].trim();

    stack[depth] = name;
    stack.length = depth + 1;

    paths.push(stack.join("/"));
  }

  return paths;
}

function isTestableSource(path: string) {
  return (
    /\.(ts|tsx|js|jsx)$/.test(path) &&
    !isTestPath(path) &&
    !/next-env/i.test(path)
  );
}

function hasNearbyTest(path: string, testPaths: Set<string>) {
  const normalized = normalizeSourcePath(path);

  return Array.from(testPaths).some((testPath) =>
    normalizeSourcePath(testPath) === normalized
  );
}

function isTestPath(path: string) {
  return (
    /(^|\/)(__tests__|test|tests|spec)(\/|$)/i.test(path) ||
    /\.(test|spec)\.[cm]?[jt]sx?$/i.test(path)
  );
}

function normalizeSourcePath(path: string) {
  return path
    .replace(/\/__tests__\//i, "/")
    .replace(/\.(test|spec)\.[cm]?[jt]sx?$/i, "")
    .replace(/\.[cm]?[jt]sx?$/i, "");
}

function getPriority(path: string): TestGap["priority"] {
  if (/api|route|auth|session|jwt|database|db/i.test(path)) {
    return "high";
  }

  if (/page|component|store|hook/i.test(path)) {
    return "medium";
  }

  return "low";
}

function suggestTestPath(path: string) {
  return path.replace(/\.(tsx|ts|jsx|js)$/, ".test.$1");
}

function getReason(path: string) {
  if (/api|route/i.test(path)) {
    return "API behavior should cover success, failure, and invalid input cases.";
  }

  if (/auth|session|jwt/i.test(path)) {
    return "Auth logic needs happy-path and unauthorized edge-case coverage.";
  }

  if (/component|page/i.test(path)) {
    return "User-facing UI should have rendering and interaction smoke coverage.";
  }

  return "Important source file has no nearby test detected.";
}
