import { RepoFile } from "../git/fileScanner";
import {
  RepoHealthIssue,
  RepoHealthReport,
} from "../repositories/types";

const SECRET_PATTERNS = [
  /api[_-]?key\s*[:=]\s*["'][^"']{16,}/i,
  /secret\s*[:=]\s*["'][^"']{16,}/i,
  /token\s*[:=]\s*["'][^"']{20,}/i,
  /sk-[a-z0-9-_]{20,}/i,
];

export function analyzeRepoHealth(
  files: RepoFile[]
): RepoHealthReport {
  const paths = files.map((file) => file.path.toLowerCase());
  const issues: RepoHealthIssue[] = [];

  const hasReadme = paths.some((file) =>
    file.endsWith("readme.md")
  );
  const hasTests = paths.some((file) =>
    /(^|\/)(__tests__|test|tests|spec)(\/|\.|-)/.test(file)
  );
  const hasCi = paths.some((file) =>
    file.startsWith(".github/workflows/")
  );
  const hasDocker = paths.some(
    (file) =>
      file.endsWith("dockerfile") ||
      file.includes("docker-compose")
  );
  const hasEnvExample = paths.some((file) =>
    /^\.env\.(example|sample)$|\/\.env\.(example|sample)$/.test(
      file
    )
  );
  const packageManagers = detectPackageManagers(paths);

  if (!hasReadme) {
    issues.push({
      id: "missing-readme",
      title: "No README detected",
      severity: "medium",
      detail:
        "A repo without setup and usage docs is harder for new contributors to operate confidently.",
      files: [],
      recommendation:
        "Add a README with setup, scripts, environment variables, and a short architecture overview.",
    });
  }

  if (!hasTests) {
    issues.push({
      id: "missing-tests",
      title: "No obvious test suite",
      severity: "high",
      detail:
        "The scan did not find conventional test folders or test/spec files.",
      files: [],
      recommendation:
        "Add focused tests around core parsing, API routes, and user-critical flows.",
    });
  }

  if (!hasCi) {
    issues.push({
      id: "missing-ci",
      title: "No CI workflow detected",
      severity: "medium",
      detail:
        "Automated lint/build checks make changes reviewable and protect the main branch.",
      files: [],
      recommendation:
        "Add GitHub Actions for linting, type checking, and production build validation.",
    });
  }

  if (!hasEnvExample) {
    issues.push({
      id: "missing-env-example",
      title: "No environment template",
      severity: "medium",
      detail:
        "Developers need to know which secrets and config values are required.",
      files: [],
      recommendation:
        "Add .env.example with placeholder values and no real secrets.",
    });
  }

  issues.push(...detectLargeFiles(files));
  issues.push(...detectPossibleSecrets(files));

  const score = calculateScore(issues);

  return {
    score,
    grade: score >= 90 ? "A" : score >= 75 ? "B" : score >= 60 ? "C" : "D",
    signals: {
      hasReadme,
      hasTests,
      hasCi,
      hasDocker,
      hasEnvExample,
      packageManagers,
    },
    issues: issues.slice(0, 12),
  };
}

function detectPackageManagers(paths: string[]) {
  const managers = [];

  if (paths.includes("package-lock.json")) managers.push("npm");
  if (paths.includes("pnpm-lock.yaml")) managers.push("pnpm");
  if (paths.includes("yarn.lock")) managers.push("yarn");
  if (paths.includes("bun.lockb")) managers.push("bun");
  if (paths.includes("poetry.lock")) managers.push("poetry");
  if (paths.includes("requirements.txt")) managers.push("pip");

  return managers;
}

function detectLargeFiles(
  files: RepoFile[]
): RepoHealthIssue[] {
  return files
    .filter((file) => file.content.split(/\r?\n/).length > 700)
    .slice(0, 5)
    .map((file) => ({
      id: `large-file-${file.path}`,
      title: "Large source file",
      severity: "low",
      detail:
        "Large files can hide multiple responsibilities and slow down reviews.",
      files: [file.path],
      recommendation:
        "Review whether this file can be split by responsibility without changing behavior.",
    }));
}

function detectPossibleSecrets(
  files: RepoFile[]
): RepoHealthIssue[] {
  return files
    .filter((file) =>
      SECRET_PATTERNS.some((pattern) =>
        pattern.test(file.content)
      )
    )
    .slice(0, 5)
    .map((file) => ({
      id: `possible-secret-${file.path}`,
      title: "Possible hardcoded secret",
      severity: "high",
      detail:
        "The scanner found text that resembles a token, key, or secret.",
      files: [file.path],
      recommendation:
        "Move secrets into environment variables and rotate any exposed credentials.",
    }));
}

function calculateScore(issues: RepoHealthIssue[]) {
  const penalty = issues.reduce((total, issue) => {
    if (issue.severity === "high") return total + 18;
    if (issue.severity === "medium") return total + 10;
    return total + 4;
  }, 0);

  return Math.max(0, 100 - penalty);
}
