export interface ParsedDiffFile {
  path: string;
  additions: number;
  deletions: number;
}

export function parseDiff(diff: string): ParsedDiffFile[] {
  const files = new Map<string, ParsedDiffFile>();
  let currentPath = "";

  for (const line of diff.split(/\r?\n/)) {
    if (line.startsWith("diff --git ")) {
      currentPath = parseGitDiffPath(line);
      ensureFile(files, currentPath);
      continue;
    }

    if (line.startsWith("+++ b/")) {
      currentPath = line.replace("+++ b/", "").trim();
      ensureFile(files, currentPath);
      continue;
    }

    if (!currentPath || line.startsWith("+++") || line.startsWith("---")) {
      continue;
    }

    const file = ensureFile(files, currentPath);

    if (line.startsWith("+")) {
      file.additions += 1;
    }

    if (line.startsWith("-")) {
      file.deletions += 1;
    }
  }

  return Array.from(files.values()).filter(
    (file) => file.path && file.path !== "/dev/null"
  );
}

function parseGitDiffPath(line: string) {
  const parts = line.split(" ");
  const target = parts[3] || parts[2] || "";

  return target.replace(/^b\//, "").trim();
}

function ensureFile(
  files: Map<string, ParsedDiffFile>,
  path: string
) {
  if (!files.has(path)) {
    files.set(path, {
      path,
      additions: 0,
      deletions: 0,
    });
  }

  return files.get(path)!;
}
