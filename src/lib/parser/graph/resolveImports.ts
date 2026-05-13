import path from "path";
import { RepoFile } from "../../git/fileScanner";
import { getPrimaryModuleId } from "./classifyFile";
import { getMeaningfulModulePath } from "./buildModules";
import { ModuleDependency } from "./types";

const IMPORT_PATTERNS = [
  /import\s+(?:[\s\S]*?\s+from\s+)?["']([^"']+)["']/g,
  /export\s+[\s\S]*?\s+from\s+["']([^"']+)["']/g,
  /require\(["']([^"']+)["']\)/g,
  /dynamic\(\s*\(\)\s*=>\s*import\(["']([^"']+)["']\)/g,
];

const EXTENSIONS = [
  ".ts",
  ".tsx",
  ".js",
  ".jsx",
  ".json",
];

export function buildImportDependencies(
  files: RepoFile[]
): {
  systemDependencies: ModuleDependency[];
  folderDependencies: ModuleDependency[];
} {
  const fileMap = new Map(
    files.map((file) => [
      normalizePath(file.path),
      file,
    ])
  );

  const systemEdges = new Map<
    string,
    ModuleDependency
  >();

  const folderEdges = new Map<
    string,
    ModuleDependency
  >();

  for (const file of files) {
    for (const importPath of extractImportPaths(
      file.content
    )) {
      const target = resolveImport(
        file,
        importPath,
        fileMap
      );

      if (!target) continue;

      addDependency(
        systemEdges,
        getPrimaryModuleId(file),
        getPrimaryModuleId(target),
        "imports"
      );

      const sourceFolder =
        getMeaningfulModulePath(file.path);
      const targetFolder =
        getMeaningfulModulePath(target.path);

      if (!sourceFolder || !targetFolder) {
        continue;
      }

      addDependency(
        folderEdges,
        `folder:${sourceFolder}`,
        `folder:${targetFolder}`,
        "imports"
      );
    }
  }

  return {
    systemDependencies: Array.from(
      systemEdges.values()
    ),
    folderDependencies: Array.from(
      folderEdges.values()
    )
      .sort((a, b) => b.weight - a.weight)
      .slice(0, 18),
  };
}

function extractImportPaths(
  content: string
): string[] {
  const imports = new Set<string>();

  for (const pattern of IMPORT_PATTERNS) {
    for (const match of content.matchAll(
      pattern
    )) {
      if (match[1]) {
        imports.add(match[1]);
      }
    }
  }

  return Array.from(imports).filter(
    (importPath) =>
      importPath.startsWith(".") ||
      importPath.startsWith("@/") ||
      importPath.startsWith("~/") ||
      importPath.startsWith("src/")
  );
}

function resolveImport(
  source: RepoFile,
  importPath: string,
  files: Map<string, RepoFile>
): RepoFile | null {
  const sourceDir = path.posix.dirname(
    normalizePath(source.path)
  );

  const candidates = getCandidatePaths(
    sourceDir,
    importPath
  );

  for (const candidate of candidates) {
    const direct = files.get(candidate);
    if (direct) return direct;

    for (const extension of EXTENSIONS) {
      const withExtension = files.get(
        `${candidate}${extension}`
      );

      if (withExtension) {
        return withExtension;
      }

      const indexFile = files.get(
        `${candidate}/index${extension}`
      );

      if (indexFile) return indexFile;
    }
  }

  return null;
}

function getCandidatePaths(
  sourceDir: string,
  importPath: string
): string[] {
  if (importPath.startsWith(".")) {
    return [
      normalizePath(
        path.posix.normalize(
          path.posix.join(
            sourceDir,
            importPath
          )
        )
      ),
    ];
  }

  const withoutAlias = importPath
    .replace(/^@\//, "")
    .replace(/^~\//, "")
    .replace(/^src\//, "");

  return [
    withoutAlias,
    `src/${withoutAlias}`,
  ].map(normalizePath);
}

function addDependency(
  edges: Map<string, ModuleDependency>,
  source: string,
  target: string,
  label: string
) {
  if (!source || !target || source === target) {
    return;
  }

  const key = `${source}->${target}:${label}`;
  const existing = edges.get(key);

  if (existing) {
    existing.weight += 1;
    return;
  }

  edges.set(key, {
    source,
    target,
    label,
    weight: 1,
  });
}

function normalizePath(filePath: string) {
  return filePath.replace(/\\/g, "/");
}
