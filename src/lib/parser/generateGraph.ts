import { RepoFile } from "../git/fileScanner";
import { extractModules } from "./extractModules";
import { detectGraphDependencies } from "./detectGraphDependencies";

export function generateGraph(
  files: RepoFile[]
) {
  console.log(
  "FILES SAMPLE:",
  files.slice(0, 10).map((f) => f.path)
);
  const architecture = extractModules(files);
  console.log(
  "ARCHITECTURE MODULES:",
  architecture
);

  const dependencies = detectGraphDependencies(files);

  const categoryColors: Record<
    string,
    string
  > = {
    frontend: "#2563eb",
    backend: "#9333ea",
    ai: "#06b6d4",
    data: "#16a34a",
    security: "#dc2626",
    feature: "#f59e0b",
    service: "#ec4899",
  };

  // NODES

  // NODES

const layerY: Record<
  string,
  number
> = {
  frontend: 0,
  feature: 180,
  backend: 360,
  security: 360,
  data: 560,
  ai: 760,
  service: 560,
};

const categoryCount: Record<
  string,
  number
> = {};

const nodes = architecture.map(
  (node) => {
    const count =
      categoryCount[
        node.category
      ] || 0;

    categoryCount[
      node.category
    ] = count + 1;

    return {
      id: node.id,

      data: {
        label: node.label,
        category: node.category,
      },

      position: {
        x: count * 320,
        y:
          layerY[
            node.category
          ] || 0,
      },

      style: {
        background: "#18181b",
        color: "white",

        border: `2px solid ${
          categoryColors[
            node.category
          ] || "#27272a"
        }`,

        padding: 14,
        borderRadius: 18,
        width: 220,

        fontSize: 15,
        fontWeight: 600,

        boxShadow: `0 0 25px ${
          categoryColors[
            node.category
          ] || "#000"
        }33`,
      },
    };
  }
);

// DEPENDENCY EDGES

const edges = dependencies.map(
  (dep, index) => ({
    id: `edge-${index}`,

    source: dep.source,
    target: dep.target,

    animated: true,

    style: {
      stroke: "#666",
      strokeWidth: 1.5,
    },

    type: "smoothstep",
  })
);

  return {
    nodes,
    edges,
  };
}