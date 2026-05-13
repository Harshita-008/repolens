"use client";

import { X } from "lucide-react";
import { GraphNode } from "../../../lib/parser/graph/types";
import { CATEGORY_LABELS } from "../../../lib/parser/graph/categoryConfig";

interface Props {
  node: GraphNode | null;
  onClose: () => void;
  onOpenFile?: (path: string) => void;
}

export default function GraphNodeDetails({
  node,
  onClose,
  onOpenFile,
}: Props) {
  if (!node) return null;

  const files = node.data.files || [];

  return (
    <div className="absolute right-4 top-4 z-10 w-[300px] rounded-2xl border border-zinc-800 bg-zinc-950/95 p-4 shadow-2xl backdrop-blur">
      <div className="mb-3 flex items-start justify-between gap-3">
        <div>
          <p className="text-xs text-zinc-500">
            {CATEGORY_LABELS[node.data.category]} · {node.data.kind}
          </p>
          <h4 className="mt-1 text-base font-semibold text-white">
            {node.data.label}
          </h4>
        </div>

        <button
          onClick={onClose}
          className="rounded-md p-1 text-zinc-400 hover:bg-zinc-800 hover:text-white"
          aria-label="Close node details"
        >
          <X size={16} />
        </button>
      </div>

      <p className="mb-4 text-sm leading-6 text-zinc-300">
        {node.data.description}
      </p>

      <div className="mb-3 flex items-center justify-between rounded-xl border border-zinc-800 bg-black/30 px-3 py-2 text-xs text-zinc-300">
        <span>Files represented</span>
        <span className="font-semibold text-white">
          {node.data.fileCount || 0}
        </span>
      </div>

      {files.length > 0 && (
        <div>
          <p className="mb-2 text-xs font-medium uppercase text-zinc-500">
            Representative Files
          </p>

          <div className="space-y-2">
            {files.map((file) => (
              <button
                key={file}
                onClick={() => onOpenFile?.(file)}
                className="w-full truncate rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2 text-left text-xs text-cyan-300 hover:border-cyan-500/60"
                title={file}
              >
                {file}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
