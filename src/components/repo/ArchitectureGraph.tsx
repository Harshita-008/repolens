"use client";

import ReactFlow, {
  Background,
  Controls,
} from "reactflow";

import "reactflow/dist/style.css";

interface Props {
  graph: {
    nodes: any[];
    edges: any[];
  };
}

export default function ArchitectureGraph({
  graph,
}: Props) {
  return (
    <div className="h-[500px] bg-zinc-950 rounded-2xl overflow-hidden">
      <ReactFlow
        nodes={graph.nodes}
        edges={graph.edges}
        fitView
      >
        <Background />
        <Controls />
      </ReactFlow>
    </div>
  );
}