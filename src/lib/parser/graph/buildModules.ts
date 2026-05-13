import { RepoFile } from "../../git/fileScanner";
import { classifyFile } from "./classifyFile";
import {
  ArchitectureModule,
  GraphCategory,
} from "./types";

const FOLDER_CATEGORY_HINTS: Record<
  string,
  GraphCategory
> = {
  app: "frontend",
  pages: "frontend",
  components: "frontend",
  ui: "frontend",
  hooks: "frontend",
  store: "frontend",
  stores: "frontend",
  state: "frontend",
  context: "frontend",
  providers: "frontend",
  api: "backend",
  routes: "backend",
  server: "backend",
  controllers: "backend",
  lib: "logic",
  services: "logic",
  parser: "logic",
  utils: "logic",
  auth: "security",
  middleware: "security",
  db: "data",
  database: "data",
  prisma: "data",
  models: "data",
  ai: "ai",
  agents: "ai",
  vector: "ai",
  prompts: "ai",
  storage: "data",
  uploads: "data",
  billing: "service",
  payments: "service",
};

const STRUCTURAL_SEGMENTS = new Set([
  "src",
  "app",
  "pages",
]);

const FILE_SEGMENT_REGEX =
  /\.[a-z0-9]+$/i;

export function buildSystemModules(
  files: RepoFile[]
): ArchitectureModule[] {
  const modules = new Map<
    string,
    ArchitectureModule
  >();

  for (const file of files) {
    for (const detectedModule of classifyFile(file)) {
      const existing =
        modules.get(detectedModule.id);

      if (existing) {
        existing.files.push(
          ...detectedModule.files
        );
        continue;
      }

      modules.set(detectedModule.id, {
        ...detectedModule,
        files: [...detectedModule.files],
      });
    }
  }

  return Array.from(modules.values())
    .filter((architectureModule) =>
      architectureModule.id === "project"
        ? modules.size === 1
        : true
    )
    .sort(
      (a, b) =>
        b.files.length - a.files.length
    );
}

export function buildFolderModules(
  files: RepoFile[]
): ArchitectureModule[] {
  const folders = new Map<
    string,
    Set<string>
  >();

  for (const file of files) {
    const folder = getMeaningfulModulePath(
      file.path
    );

    if (!folder) continue;

    if (!folders.has(folder)) {
      folders.set(folder, new Set());
    }

    folders.get(folder)?.add(file.path);
  }

  return Array.from(folders.entries())
    .map(([folder, folderFiles]) => ({
      id: `folder:${folder}`,
      label: `${folder}/`,
      category: classifyFolder(folder),
      kind: "module" as const,
      description: describeFolderModule(
        folder,
        folderFiles.size
      ),
      files: Array.from(folderFiles),
    }))
    .filter((module) => module.files.length > 0)
    .sort(
      (a, b) =>
        b.files.length - a.files.length
    )
    .slice(0, 28);
}

export function getMeaningfulFolder(
  filePath: string
): string {
  return getMeaningfulModulePath(filePath)
    .split("/")[0];
}

export function getMeaningfulModulePath(
  filePath: string
): string {
  const parts = filePath
    .replace(/\\/g, "/")
    .split("/")
    .filter(Boolean);

  const cleanParts =
    parts[0]?.toLowerCase() === "src"
      ? parts.slice(1)
      : parts;

  const apiIndex =
    cleanParts.findIndex(
      (part, index) =>
        part.toLowerCase() === "api" ||
        (part.toLowerCase() === "pages" &&
          cleanParts[index + 1]?.toLowerCase() ===
            "api")
    );

  if (apiIndex !== -1) {
    return buildNestedModulePath(
      "api",
      cleanParts.slice(apiIndex + 1)
    );
  }

  const knownIndex = cleanParts.findIndex(
    (part) =>
      FOLDER_CATEGORY_HINTS[
        part.toLowerCase()
      ]
  );

  if (knownIndex !== -1) {
    const segment =
      cleanParts[knownIndex].toLowerCase();

    return buildNestedModulePath(
      segment,
      cleanParts.slice(knownIndex + 1)
    );
  }

  return (
    cleanParts.find(
      (part) =>
        !STRUCTURAL_SEGMENTS.has(
          part.toLowerCase()
        ) && !FILE_SEGMENT_REGEX.test(part)
    ) || ""
  ).toLowerCase();
}

function classifyFolder(
  folder: string
): GraphCategory {
  const root = folder.split("/")[0];

  return (
    FOLDER_CATEGORY_HINTS[
      root.toLowerCase()
    ] || "service"
  );
}

function buildNestedModulePath(
  root: string,
  rest: string[]
) {
  const normalizedRest =
    rest[0]?.toLowerCase() === root
      ? rest.slice(1)
      : rest;

  const child = normalizedRest.find(
    (part) =>
      !FILE_SEGMENT_REGEX.test(part) &&
      !["index", "route"].includes(
        part.toLowerCase()
      )
  );

  return child
    ? `${root}/${child.toLowerCase()}`
    : root;
}

function describeFolderModule(
  folder: string,
  fileCount: number
) {
  const root = folder.split("/")[0];
  const child = folder.split("/")[1];
  const countText = `${fileCount} important file${
    fileCount === 1 ? "" : "s"
  }`;

  if (!child) {
    return `${countText} in the ${root} layer.`;
  }

  return `${countText} for the ${child} area inside ${root}.`;
}
