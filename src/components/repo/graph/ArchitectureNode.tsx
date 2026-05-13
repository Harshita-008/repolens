"use client";

import { Handle, NodeProps, Position } from "reactflow";
import { CATEGORY_LABELS } from "../../../lib/parser/graph/categoryConfig";
import { GraphNodeData } from "../../../lib/parser/graph/types";

export default function ArchitectureNode({
  data,
}: NodeProps<GraphNodeData>) {
  const kindLabel =
    data.kind === "system" ? "System" : "Folder";
  const keyFiles = data.files || [];

  return (
    <div className="relative flex h-full min-w-0 flex-col overflow-hidden">
      <Handle
        id="top"
        type="target"
        position={Position.Top}
        className="!h-2 !w-2 !border-zinc-950 !bg-zinc-300"
      />

      <Handle
        id="left"
        type="target"
        position={Position.Left}
        className="!h-2 !w-2 !border-zinc-950 !bg-zinc-200"
      />

      <div className="mb-2 flex min-w-0 items-center justify-between gap-3">
        <span
          className="min-w-0 flex-1 truncate text-[13px] font-bold leading-tight text-white"
          title={data.label}
        >
          {data.label}
        </span>

        <span className="shrink-0 rounded-full border border-white/10 bg-black/30 px-2 py-0.5 text-[8px] uppercase text-zinc-300">
          {kindLabel}
        </span>
      </div>

      <p
        className="h-[30px] overflow-hidden text-[10px] font-normal leading-[15px] text-zinc-300"
        title={data.description}
      >
        {data.description}
      </p>

      {keyFiles.length > 0 && (
        <div className="mt-2 space-y-0.5">
          {keyFiles.map((file) => (
            <div
              key={file}
              className="truncate rounded bg-black/20 px-1.5 py-0.5 text-[9px] font-normal leading-3 text-zinc-300"
              title={file}
            >
              {file}
            </div>
          ))}
        </div>
      )}

      <div className="mt-auto flex min-w-0 items-center justify-between gap-2 pt-2 text-[10px] font-medium text-zinc-400">
        <span className="min-w-0 truncate">
          {CATEGORY_LABELS[data.category]}
        </span>
        {typeof data.fileCount === "number" && (
          <span className="shrink-0">
            {data.fileCount} file
            {data.fileCount === 1 ? "" : "s"}
          </span>
        )}
      </div>

      <Handle
        id="right"
        type="source"
        position={Position.Right}
        className="!h-2 !w-2 !border-zinc-950 !bg-zinc-200"
      />

      <Handle
        id="bottom"
        type="source"
        position={Position.Bottom}
        className="!h-2 !w-2 !border-zinc-950 !bg-zinc-300"
      />
    </div>
  );
}
