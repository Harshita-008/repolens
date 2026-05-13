import {
  ArchitectureModule,
  GraphEdge,
  GraphNode,
  ModuleDependency,
} from "./types";
import { CATEGORY_COLORS } from "./categoryConfig";

const SYSTEM_ORDER = [
  "ui",
  "state",
  "api",
  "logic",
  "auth",
  "payments",
  "storage",
  "realtime",
  "ai",
  "vector",
  "database",
  "project",
];

const SYSTEM_COLUMN_GAP = 370;
const SYSTEM_ROW_GAP = 142;
const MODULE_ROW_GAP = 146;
const MODULE_START_Y = 285;

export function toReactFlowGraph(
  modules: ArchitectureModule[],
  dependencies: ModuleDependency[]
): {
  nodes: GraphNode[];
  edges: GraphEdge[];
} {
  const systemModules = modules.filter(
    (module) => module.kind === "system"
  );

  const folderModules = modules.filter(
    (module) => module.kind === "module"
  );

  const systemNodes =
    positionSystemNodes(systemModules);

  const folderNodes =
    positionFolderNodes(
      folderModules,
      dependencies,
      systemNodes
    );

  const nodeIds = new Set(
    [...systemNodes, ...folderNodes].map(
      (node) => node.id
    )
  );

  return {
    nodes: [...systemNodes, ...folderNodes],
    edges: dependencies
      .filter(
        (dependency) =>
          nodeIds.has(dependency.source) &&
          nodeIds.has(dependency.target)
      )
      .map(toEdge),
  };
}

function positionSystemNodes(
  modules: ArchitectureModule[]
): GraphNode[] {
  const orderedModules = [...modules].sort(
    (a, b) =>
      getSystemOrder(a.id) -
      getSystemOrder(b.id)
  );

  const columnCounts = new Map<number, number>();

  return orderedModules.map((module) => {
    const column = getSystemOrder(module.id);
    const count =
      columnCounts.get(column) || 0;

    columnCounts.set(
      column,
      count + 1
    );

    return toNode(module, {
      x: column * SYSTEM_COLUMN_GAP,
      y: count * SYSTEM_ROW_GAP,
    });
  });
}

function positionFolderNodes(
  modules: ArchitectureModule[],
  dependencies: ModuleDependency[],
  systemNodes: GraphNode[]
): GraphNode[] {
  const ownerByModule =
    getOwnershipMap(dependencies);
  const systemIds = new Set(
    systemNodes.map((node) => node.id)
  );
  const systemPositionById = new Map(
    systemNodes.map((node) => [
      node.id,
      node.position,
    ])
  );
  const ownerCounts = new Map<string, number>();

  return modules.map((module) => {
    const ownerId =
      resolveSystemOwner(
        module.id,
        ownerByModule,
        systemIds
      ) ||
      findFallbackOwner(module, systemNodes);
    const count =
      ownerCounts.get(ownerId) || 0;
    const ownerPosition =
      systemPositionById.get(ownerId) || {
        x: 0,
        y: 0,
      };

    ownerCounts.set(
      ownerId,
      count + 1
    );

    return toNode(module, {
      x: ownerPosition.x,
      y:
        ownerPosition.y +
        MODULE_START_Y +
        count * MODULE_ROW_GAP,
    });
  });
}

function toNode(
  module: ArchitectureModule,
  position: { x: number; y: number }
): GraphNode {
  const colors =
    CATEGORY_COLORS[module.category];

  return {
    id: module.id,
    type: "architectureNode",
    position,
    data: {
      label: module.label,
      description: module.description,
      category: module.category,
      kind: module.kind,
      fileCount: module.files.length,
      files: module.files.slice(0, 2),
    },
    style: {
      width:
        module.kind === "system" ? 250 : 242,
      height:
        module.kind === "system" ? 128 : 126,
      border: `1px solid ${colors.border}`,
      background: colors.background,
      color: colors.text,
      borderRadius: 12,
      boxShadow: `0 0 22px ${colors.border}22`,
      fontSize: 13,
      fontWeight: 700,
      padding: 12,
    },
  };
}

function toEdge(
  dependency: ModuleDependency
): GraphEdge {
  const strongEdge = dependency.weight >= 4;
  const ownershipEdge =
    dependency.weight < 1;
  const moduleImportEdge =
    !strongEdge && !ownershipEdge;
  const edgeLabel =
    strongEdge ? dependency.label : undefined;

  return {
    id: `${dependency.source}-${dependency.target}-${dependency.label}`,
    type: "smoothstep",
    source: dependency.source,
    target: dependency.target,
    sourceHandle: ownershipEdge
      ? "bottom"
      : "right",
    targetHandle: ownershipEdge
      ? "top"
      : "left",
    label: edgeLabel,
    animated: strongEdge,
    data: {
      kind: ownershipEdge
        ? "ownership"
        : strongEdge
          ? "flow"
          : "import",
    },
    style: {
      stroke: ownershipEdge
        ? "#52525b"
        : strongEdge
          ? "#e4e4e7"
          : "#94a3b8",
      strokeWidth: ownershipEdge
        ? 1
        : strongEdge
          ? 2.4
          : 1.5,
      opacity: ownershipEdge
        ? 0.18
        : strongEdge
          ? 0.95
          : 0.42,
      ...(moduleImportEdge
        ? { strokeDasharray: "4 7" }
        : {}),
    },
    labelStyle: {
      fill: "#e4e4e7",
      fontSize: 11,
      fontWeight: 600,
    },
    labelBgStyle: {
      fill: "#09090b",
      fillOpacity: 0.85,
    },
    markerEnd: {
      type: "arrowclosed",
      color: ownershipEdge
        ? "#52525b"
        : strongEdge
          ? "#e4e4e7"
          : "#94a3b8",
    },
  };
}

function getSystemOrder(id: string) {
  const index = SYSTEM_ORDER.indexOf(id);

  return index === -1
    ? SYSTEM_ORDER.length
    : index;
}

function getOwnershipMap(
  dependencies: ModuleDependency[]
) {
  const ownership = new Map<string, string>();

  for (const dependency of dependencies) {
    if (dependency.weight >= 1) continue;

    ownership.set(
      dependency.target,
      dependency.source
    );
  }

  return ownership;
}

function resolveSystemOwner(
  moduleId: string,
  ownerByModule: Map<string, string>,
  systemIds: Set<string>
) {
  let ownerId = ownerByModule.get(moduleId);
  const visited = new Set<string>();

  while (ownerId && !systemIds.has(ownerId)) {
    if (visited.has(ownerId)) {
      return "";
    }

    visited.add(ownerId);
    ownerId = ownerByModule.get(ownerId);
  }

  return ownerId || "";
}

function findFallbackOwner(
  module: ArchitectureModule,
  systemNodes: GraphNode[]
) {
  const sameCategoryOwner =
    systemNodes.find(
      (node) =>
        node.data.category === module.category
    );

  return sameCategoryOwner?.id || systemNodes[0]?.id || "";
}
