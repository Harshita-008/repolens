"use client";

import { useMemo, useState } from "react";
import ReactFlow, {
  Background,
  Controls,
  Edge,
  MarkerType,
  Node,
} from "reactflow";

import "reactflow/dist/style.css";
import ArchitectureNode from "./graph/ArchitectureNode";
import GraphLegend from "./graph/GraphLegend";
import GraphModeTabs, {
  GraphMode,
} from "./graph/GraphModeTabs";
import GraphNodeDetails from "./graph/GraphNodeDetails";
import {
  GraphEdge,
  GraphNode,
} from "../../lib/parser/graph/types";

interface Props {
  graph: {
    nodes: GraphNode[];
    edges: GraphEdge[];
  };
  onOpenFile?: (path: string) => void;
}

const nodeTypes = {
  architectureNode: ArchitectureNode,
};

export default function ArchitectureGraph({
  graph,
  onOpenFile,
}: Props) {
  const [mode, setMode] =
    useState<GraphMode>("architecture");
  const [selectedNode, setSelectedNode] =
    useState<GraphNode | null>(null);

  const filteredGraph = useMemo(
    () => filterGraph(graph, mode),
    [graph, mode]
  );

  const nodes = useMemo(
    () => filteredGraph.nodes as Node[],
    [filteredGraph.nodes]
  );

  const edges = useMemo(
    () =>
      filteredGraph.edges.map((edge) => ({
        ...edge,
        markerEnd: edge.markerEnd
          ? {
              ...edge.markerEnd,
              type: MarkerType.ArrowClosed,
            }
          : undefined,
      })) as Edge[],
    [filteredGraph.edges]
  );

  const edgeDefaults = useMemo(
    () => ({
      type: "smoothstep",
    }),
    []
  );

  return (
    <div className="overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-950">
      <div className="flex flex-col gap-3 border-b border-zinc-800 bg-black/30 p-4">
        <div className="flex flex-col gap-1">
          <h3 className="text-sm font-semibold text-white">
            System Architecture Map
          </h3>
          <p className="text-xs text-zinc-400">
            Read left to right: primary systems on top, representative repo files underneath each system.
          </p>
        </div>

        <GraphModeTabs
          value={mode}
          onChange={(nextMode) => {
            setMode(nextMode);
            setSelectedNode(null);
          }}
        />

        <GraphLegend />
      </div>

      <div className="relative h-[650px]">
        <GraphNodeDetails
          node={selectedNode}
          onClose={() => setSelectedNode(null)}
          onOpenFile={onOpenFile}
        />

        <ReactFlow
          nodes={nodes}
          edges={edges}
          nodeTypes={nodeTypes}
          defaultEdgeOptions={edgeDefaults}
          onNodeClick={(_, node) =>
            setSelectedNode(node as GraphNode)
          }
          fitView
          fitViewOptions={{
            padding: 0.08,
          }}
          minZoom={0.35}
          maxZoom={1.8}
        >
          <Background
            color="#27272a"
            gap={18}
            size={1}
          />
          <Controls />
        </ReactFlow>
      </div>
    </div>
  );
}

function filterGraph(
  graph: Props["graph"],
  mode: GraphMode
) {
  const isSystemNode = (node: GraphNode) =>
    node.data.kind === "system";
  const isModuleNode = (node: GraphNode) =>
    node.data.kind === "module";

  if (mode === "architecture") {
    return graph;
  }

  if (mode === "data-flow") {
    const nodes = graph.nodes.filter(isSystemNode);
    const nodeIds = new Set(nodes.map((node) => node.id));

    return {
      nodes,
      edges: graph.edges.filter(
        (edge) =>
          edge.data?.kind === "flow" &&
          nodeIds.has(edge.source) &&
          nodeIds.has(edge.target)
      ),
    };
  }

  if (mode === "dependencies") {
    const nodes = graph.nodes.filter(isModuleNode);
    const nodeIds = new Set(nodes.map((node) => node.id));

    return {
      nodes,
      edges: graph.edges.filter(
        (edge) =>
          edge.data?.kind === "import" &&
          nodeIds.has(edge.source) &&
          nodeIds.has(edge.target)
      ),
    };
  }

  const nodes = graph.nodes.filter(
    (node) => isSystemNode(node) || isModuleNode(node)
  );
  const nodeIds = new Set(nodes.map((node) => node.id));

  return {
    nodes,
    edges: graph.edges.filter(
      (edge) =>
        edge.data?.kind === "ownership" &&
        nodeIds.has(edge.source) &&
        nodeIds.has(edge.target)
    ),
  };
}
