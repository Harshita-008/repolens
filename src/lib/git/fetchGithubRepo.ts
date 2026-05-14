import fs from "fs";
import os from "os";
import path from "path";
import {
  IGNORE_FOLDERS,
  IMPORTANT_EXTENSIONS,
  MAX_FILE_SIZE,
} from "../constants";

const MAX_CONTENT_FILES = 250;
const MAX_TREE_FILES = 1200;

interface GithubTreeItem {
  path: string;
  mode: string;
  type: "blob" | "tree" | "commit";
  sha: string;
  size?: number;
  url: string;
}

interface GithubTreeResponse {
  tree: GithubTreeItem[];
  truncated: boolean;
}

interface GithubRepoResponse {
  default_branch: string;
}

export async function fetchGithubRepo(repoUrl: string) {
  const parsed = parseGithubRepoUrl(repoUrl);

  if (!parsed) {
    throw new Error("Only public GitHub repository URLs are supported.");
  }

  const { owner, repo } = parsed;
  const repoMeta = await fetchJson<GithubRepoResponse>(
    `https://api.github.com/repos/${owner}/${repo}`
  );
  const defaultBranch = repoMeta.default_branch;
  const tree = await fetchJson<GithubTreeResponse>(
    `https://api.github.com/repos/${owner}/${repo}/git/trees/${encodeURIComponent(
      defaultBranch
    )}?recursive=1`
  );

  const repoPath = path.join(
    os.tmpdir(),
    "repolens",
    "repos",
    `${repo}-${Date.now()}`
  );

  fs.mkdirSync(repoPath, { recursive: true });

  const treeFiles = tree.tree
    .filter((item) => item.type === "blob")
    .filter((item) => !isIgnoredPath(item.path))
    .slice(0, MAX_TREE_FILES);
  const contentFiles = treeFiles
    .filter(isReadableAnalysisFile)
    .slice(0, MAX_CONTENT_FILES);

  materializeSignalFiles(repoPath, treeFiles);
  await materializeContentFiles(
    repoPath,
    contentFiles,
    owner,
    repo,
    defaultBranch
  );

  return {
    repoName: repo,
    repoPath,
  };
}

function parseGithubRepoUrl(repoUrl: string) {
  try {
    const parsed = new URL(repoUrl);

    if (parsed.hostname !== "github.com") return null;

    const [owner, repoSegment] = parsed.pathname
      .replace(/^\/|\/$/g, "")
      .split("/");
    const repo = repoSegment?.replace(/\.git$/, "");

    if (!owner || !repo) return null;

    return { owner, repo };
  } catch {
    return null;
  }
}

async function fetchJson<T>(url: string): Promise<T> {
  const response = await fetch(url, {
    headers: getGithubHeaders(),
  });

  if (!response.ok) {
    throw new Error(
      `GitHub request failed with ${response.status} ${response.statusText}.`
    );
  }

  return response.json() as Promise<T>;
}

async function fetchText(url: string) {
  const response = await fetch(url, {
    headers: {
      "User-Agent": "RepoLens",
    },
  });

  if (!response.ok) {
    throw new Error(
      `GitHub content request failed with ${response.status} ${response.statusText}.`
    );
  }

  return response.text();
}

function materializeSignalFiles(
  repoPath: string,
  files: GithubTreeItem[]
) {
  for (const file of files.filter(isSignalFile)) {
    writeFile(repoPath, file.path, "");
  }
}

async function materializeContentFiles(
  repoPath: string,
  files: GithubTreeItem[],
  owner: string,
  repo: string,
  branch: string
) {
  for (const file of files) {
    writeFile(
      repoPath,
      file.path,
      await fetchText(buildRawFileUrl(owner, repo, branch, file.path))
    );
  }
}

function getGithubHeaders() {
  const headers: Record<string, string> = {
    Accept: "application/vnd.github+json",
    "User-Agent": "RepoLens",
  };
  const token = process.env.GITHUB_TOKEN;

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  return headers;
}

function buildRawFileUrl(
  owner: string,
  repo: string,
  branch: string,
  filePath: string
) {
  const encodedPath = filePath
    .split("/")
    .map(encodeURIComponent)
    .join("/");

  return `https://raw.githubusercontent.com/${owner}/${repo}/${encodeURIComponent(
    branch
  )}/${encodedPath}`;
}

function writeFile(
  repoPath: string,
  relativePath: string,
  content: string
) {
  const target = path.join(repoPath, relativePath);
  const resolvedRepoPath = path.resolve(repoPath);
  const resolvedTarget = path.resolve(target);

  if (!resolvedTarget.startsWith(resolvedRepoPath)) {
    return;
  }

  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.writeFileSync(target, content, "utf-8");
}

function isReadableAnalysisFile(file: GithubTreeItem) {
  const ext = path.extname(file.path);

  return (
    IMPORTANT_EXTENSIONS.includes(ext) &&
    (file.size || 0) <= MAX_FILE_SIZE &&
    isImportantPath(file.path)
  );
}

function isSignalFile(file: GithubTreeItem) {
  const normalized = file.path.toLowerCase();

  return (
    normalized === "package-lock.json" ||
    normalized === "pnpm-lock.yaml" ||
    normalized === "yarn.lock" ||
    normalized === "bun.lockb" ||
    normalized === "requirements.txt" ||
    normalized.endsWith("dockerfile") ||
    normalized.includes("docker-compose") ||
    /^\.env\.(example|sample)$|\/\.env\.(example|sample)$/.test(
      normalized
    ) ||
    normalized.startsWith(".github/workflows/")
  );
}

function isIgnoredPath(filePath: string) {
  return filePath
    .split("/")
    .some((part) => IGNORE_FOLDERS.includes(part));
}

function isImportantPath(filePath: string) {
  const importantPatterns = [
    "app",
    "api",
    "components",
    "lib",
    "hooks",
    "pages",
    "src",
    "store",
    "state",
    "auth",
    "db",
    "database",
    "models",
    "ai",
    "vector",
    "readme",
    "package.json",
    "config",
  ];
  const normalized = filePath.toLowerCase();

  return importantPatterns.some((pattern) =>
    normalized.includes(pattern)
  );
}
