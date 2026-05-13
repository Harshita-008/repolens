"use client";

import { CATEGORY_COLORS, CATEGORY_LABELS } from "../../../lib/parser/graph/categoryConfig";
import { GraphCategory } from "../../../lib/parser/graph/types";

const LEGEND_CATEGORIES: GraphCategory[] = [
  "frontend",
  "backend",
  "ai",
  "data",
  "security",
  "feature",
  "logic",
];

export default function GraphLegend() {
  return (
    <div className="flex flex-wrap items-center gap-2 text-xs text-zinc-300">
      {LEGEND_CATEGORIES.map((category) => (
        <div
          key={category}
          className="flex items-center gap-2 rounded-full border border-zinc-800 bg-black/30 px-3 py-1"
        >
          <span
            className="h-2.5 w-2.5 rounded-full"
            style={{
              backgroundColor:
                CATEGORY_COLORS[category].edge,
            }}
          />
          <span>{CATEGORY_LABELS[category]}</span>
        </div>
      ))}
    </div>
  );
}
