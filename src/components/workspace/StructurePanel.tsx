"use client";

import { FolderTree } from "lucide-react";
import WorkspaceSection from "./WorkspaceSection";

interface StructurePanelProps {
  tree: string;
}

export default function StructurePanel({ tree }: StructurePanelProps) {
  return (
    <WorkspaceSection
      id="structure"
      title="Repository Structure"
      description="A compact file tree from the analyzed repository."
      icon={FolderTree}
    >
      <pre className="max-h-[520px] overflow-auto rounded-lg border border-zinc-800 bg-black p-4 text-sm leading-6 text-zinc-300 custom-scrollbar">
        {tree}
      </pre>
    </WorkspaceSection>
  );
}
