"use client";

import { useMemo } from "react";
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
import {
  GraphEdge,
  GraphNode,
} from "../../lib/parser/graph/types";

interface Props {
  graph: {
    nodes: GraphNode[];
    edges: GraphEdge[];
  };
}

const nodeTypes = {
  architectureNode: ArchitectureNode,
};

export default function ArchitectureGraph({
  graph,
}: Props) {
  const nodes = useMemo(
    () => graph.nodes as Node[],
    [graph.nodes]
  );

  const edges = useMemo(
    () =>
      graph.edges.map((edge) => ({
        ...edge,
        markerEnd: edge.markerEnd
          ? {
              ...edge.markerEnd,
              type: MarkerType.ArrowClosed,
            }
          : undefined,
      })) as Edge[],
    [graph.edges]
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

        <GraphLegend />
      </div>

      <div className="h-[650px]">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          nodeTypes={nodeTypes}
          defaultEdgeOptions={edgeDefaults}
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
