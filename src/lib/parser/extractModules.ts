import { RepoFile } from "../git/fileScanner";

export interface ModuleNode {
  id: string;
  label: string;
  category: string;
}

export function extractModules(
  files: RepoFile[]
): ModuleNode[] {
  const folders = new Map<
    string,
    number
  >();

  files.forEach((file) => {
    const normalizedPath =
      file.path.replace(/\\/g, "/");

    const parts =
      normalizedPath.split("/");

    // ignore repo root folder

    let topFolder = "";

    if (parts.length >= 2) {
      topFolder = parts[0];

      // handle repos/repo-name/app/...
      if (
        topFolder === "repos" &&
        parts.length >= 3
      ) {
        topFolder = parts[2];
      }
    }

    if (!topFolder) return;

    folders.set(
      topFolder,
      (folders.get(topFolder) || 0) + 1
    );
  });

  console.log(
    "FOLDERS:",
    Array.from(folders.entries())
  );

  const modules: ModuleNode[] = [];

  folders.forEach((count, folder) => {
    if (count < 2) return;

    modules.push({
      id: folder.toLowerCase(),
      label: `${folder}/`,
      category:
        classifyFolder(folder),
    });
  });

  console.log(
    "MODULES:",
    modules
  );

  return modules;
}

function classifyFolder(
  folder: string
) {
  const name = folder.toLowerCase();

  if (
    [
      "app",
      "pages",
      "components",
      "ui",
    ].includes(name)
  ) {
    return "frontend";
  }

  if (
    [
      "api",
      "server",
      "backend",
      "routes",
      "controllers",
    ].includes(name)
  ) {
    return "backend";
  }

  if (
    [
      "db",
      "database",
      "prisma",
      "models",
    ].includes(name)
  ) {
    return "data";
  }

  if (
    [
      "auth",
      "security",
    ].includes(name)
  ) {
    return "security";
  }

  if (
    [
      "ai",
      "agents",
      "llm",
      "vector",
    ].includes(name)
  ) {
    return "ai";
  }

  if (
    [
      "hooks",
      "store",
      "state",
      "context",
    ].includes(name)
  ) {
    return "feature";
  }

  return "service";
}