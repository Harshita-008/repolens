import { RepoFile } from "../../git/fileScanner";
import {
  buildFolderModules,
  buildSystemModules,
} from "./buildModules";
import { inferDataFlows } from "./inferFlows";
import { toReactFlowGraph } from "./layoutGraph";
import { buildImportDependencies } from "./resolveImports";
import {
  ArchitectureModule,
  ModuleDependency,
} from "./types";

export function buildArchitectureGraph(
  files: RepoFile[]
) {
  const systemModules =
    buildSystemModules(files);
  const folderModules =
    buildFolderModules(files);

  const {
    systemDependencies,
    folderDependencies,
  } = buildImportDependencies(files);

  const flowDependencies = inferDataFlows(
    systemModules,
    systemDependencies
  );

  return toReactFlowGraph(
    [...systemModules, ...folderModules],
    buildReadableGraphEdges(
      systemModules,
      folderModules,
      [
        ...flowDependencies,
        ...folderDependencies,
      ]
    )
  );
}

function buildReadableGraphEdges(
  systemModules: ArchitectureModule[],
  folderModules: ArchitectureModule[],
  dependencies: ModuleDependency[]
): ModuleDependency[] {
  const ownershipLinks = buildOwnershipChains(
    systemModules,
    folderModules
  );

  return dedupeDependencies([
    ...dependencies,
    ...ownershipLinks,
  ]);
}

function buildOwnershipChains(
  systemModules: ArchitectureModule[],
  folderModules: ArchitectureModule[]
): ModuleDependency[] {
  const modulesByOwner = new Map<
    string,
    ArchitectureModule[]
  >();

  for (const folderModule of folderModules) {
    const owner = findOwnerSystem(
      folderModule,
      systemModules
    );

    if (!owner) continue;

    const modules =
      modulesByOwner.get(owner.id) || [];

    modules.push(folderModule);
    modulesByOwner.set(owner.id, modules);
  }

  const ownershipLinks: ModuleDependency[] = [];

  for (const [ownerId, modules] of modulesByOwner) {
    let previousId = ownerId;

    for (const folderModule of modules) {
      ownershipLinks.push({
        source: previousId,
        target: folderModule.id,
        label: "contains",
        weight: 0.25,
      });

      previousId = folderModule.id;
    }
  }

  return ownershipLinks;
}

function findOwnerSystem(
  folderModule: ArchitectureModule,
  systemModules: ArchitectureModule[]
) {
  const folderRoot =
    folderModule.id
      .replace("folder:", "")
      .split("/")[0];

  const preferredOwnerByRoot: Record<
    string,
    string
  > = {
    app: "ui",
    pages: "ui",
    components: "ui",
    ui: "ui",
    hooks: "state",
    store: "state",
    state: "state",
    context: "state",
    api: "api",
    routes: "api",
    server: "api",
    auth: "auth",
    middleware: "auth",
    lib: "logic",
    services: "logic",
    parser: "logic",
    ai: "ai",
    agents: "ai",
    prompts: "ai",
    vector: "vector",
    db: "database",
    database: "database",
    prisma: "database",
    models: "database",
    storage: "storage",
    payments: "payments",
    billing: "payments",
  };

  const preferredId =
    preferredOwnerByRoot[folderRoot];

  return (
    systemModules.find(
      (module) => module.id === preferredId
    ) ||
    systemModules.find(
      (module) =>
        module.category === folderModule.category
    ) ||
    systemModules[0] ||
    null
  );
}

function dedupeDependencies(
  dependencies: ModuleDependency[]
) {
  const seen = new Set<string>();

  return dependencies.filter((dependency) => {
    const key = `${dependency.source}->${dependency.target}:${dependency.label}`;

    if (seen.has(key)) return false;

    seen.add(key);
    return true;
  });
}
