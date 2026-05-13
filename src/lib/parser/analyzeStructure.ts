import { RepoFile } from "../git/fileScanner";

export function analyzeStructure(
  files: RepoFile[]
) {
  const folders = new Map<string, number>();

  files.forEach((file) => {
    const parts = file.path.replaceAll("\\", "/").split("/");

    if (parts.length > 1) {
      const folder = parts[1];

      folders.set(
        folder,
        (folders.get(folder) || 0) + 1
      );
    }
  });

  return Array.from(folders.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([name, count]) => ({
      name,
      count,
    }));
}