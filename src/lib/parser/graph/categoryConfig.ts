import { GraphCategory } from "./types";

export const CATEGORY_COLORS: Record<
  GraphCategory,
  {
    border: string;
    background: string;
    text: string;
    edge: string;
  }
> = {
  frontend: {
    border: "#3b82f6",
    background: "rgba(37, 99, 235, 0.16)",
    text: "#bfdbfe",
    edge: "#60a5fa",
  },
  logic: {
    border: "#8b5cf6",
    background: "rgba(124, 58, 237, 0.16)",
    text: "#ddd6fe",
    edge: "#a78bfa",
  },
  backend: {
    border: "#a855f7",
    background: "rgba(147, 51, 234, 0.16)",
    text: "#e9d5ff",
    edge: "#c084fc",
  },
  ai: {
    border: "#06b6d4",
    background: "rgba(8, 145, 178, 0.16)",
    text: "#a5f3fc",
    edge: "#22d3ee",
  },
  data: {
    border: "#22c55e",
    background: "rgba(22, 163, 74, 0.16)",
    text: "#bbf7d0",
    edge: "#4ade80",
  },
  security: {
    border: "#ef4444",
    background: "rgba(220, 38, 38, 0.16)",
    text: "#fecaca",
    edge: "#f87171",
  },
  feature: {
    border: "#f97316",
    background: "rgba(234, 88, 12, 0.16)",
    text: "#fed7aa",
    edge: "#fb923c",
  },
  service: {
    border: "#71717a",
    background: "rgba(82, 82, 91, 0.18)",
    text: "#e4e4e7",
    edge: "#a1a1aa",
  },
};

export const CATEGORY_LABELS: Record<
  GraphCategory,
  string
> = {
  frontend: "Frontend",
  logic: "Business Logic",
  backend: "Backend",
  ai: "AI",
  data: "Database",
  security: "Security",
  feature: "Features",
  service: "Services",
};
