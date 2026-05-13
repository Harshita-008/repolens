import { RepoFile } from "../git/fileScanner";

export function findImportantFiles(
  files: RepoFile[]
) {
  const important = files.filter(
    (f) =>
      f.path.includes("README") ||
      f.path.includes("package.json") ||
      f.path.includes("layout") ||
      f.path.includes("page") ||
      f.path.includes("api") ||
      f.path.includes("config") ||
      f.path.includes("provider") ||
      f.path.includes("store")
  );

  // REMOVE DUPLICATES
  const uniqueFiles = Array.from(
    new Map(
      important.map((file) => [
        file.path,
        file,
      ])
    ).values()
  );

  return uniqueFiles.slice(0, 8);
}