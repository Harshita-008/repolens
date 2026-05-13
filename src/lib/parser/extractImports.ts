import { RepoFile } from "../git/fileScanner";

export function extractImports(
  files: RepoFile[]
) {
  const dependencies: {
    source: string;
    target: string;
  }[] = [];

  const importRegex =
    /from\\s+[\"'](.+)[\"']/g;

  for (const file of files) {
    const matches = [
      ...file.content.matchAll(importRegex),
    ];

    for (const match of matches) {
      dependencies.push({
        source: file.path,
        target: match[1],
      });
    }
  }

  return dependencies;
}