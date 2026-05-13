"use client";

import { CheckCircle2, Loader2 } from "lucide-react";

interface Props {
  active: boolean;
}

const steps = [
  "Cloning repository",
  "Scanning important files",
  "Building architecture graph",
  "Generating AI summary",
  "Preparing chat context",
];

export default function AnalysisProgress({ active }: Props) {
  if (!active) return null;

  return (
    <div className="mb-8 rounded-2xl border border-cyan-500/30 bg-cyan-500/10 p-5">
      <div className="mb-4 flex items-center gap-2 text-cyan-100">
        <Loader2 size={18} className="animate-spin" />
        <span className="font-medium">Analysis in progress</span>
      </div>

      <div className="grid gap-3 md:grid-cols-5">
        {steps.map((step, index) => (
          <div
            key={step}
            className="rounded-xl border border-cyan-500/20 bg-black/30 p-3"
          >
            <div className="mb-2">
              {index === steps.length - 1 ? (
                <Loader2 size={16} className="animate-spin text-cyan-300" />
              ) : (
                <CheckCircle2 size={16} className="text-cyan-300" />
              )}
            </div>
            <div className="text-xs text-cyan-50">{step}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
