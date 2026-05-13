"use client";

import type { ReactNode } from "react";

interface WorkspaceChromeProps {
  children: ReactNode;
}

export default function WorkspaceChrome({
  children,
}: WorkspaceChromeProps) {
  return (
    <div className="sticky top-0 z-30 -mx-3 border-b border-zinc-800 bg-black px-3">
      {children}
    </div>
  );
}
