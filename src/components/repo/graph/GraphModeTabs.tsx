"use client";

export type GraphMode =
  | "architecture"
  | "modules"
  | "dependencies"
  | "data-flow";

const MODES: {
  id: GraphMode;
  label: string;
}[] = [
  { id: "architecture", label: "Architecture" },
  { id: "modules", label: "Modules" },
  { id: "dependencies", label: "Dependencies" },
  { id: "data-flow", label: "Data Flow" },
];

interface Props {
  value: GraphMode;
  onChange: (mode: GraphMode) => void;
}

export default function GraphModeTabs({
  value,
  onChange,
}: Props) {
  return (
    <div className="flex flex-wrap gap-2">
      {MODES.map((mode) => (
        <button
          key={mode.id}
          onClick={() => onChange(mode.id)}
          className={`rounded-full border px-3 py-1.5 text-xs transition ${
            value === mode.id
              ? "border-white bg-white text-black"
              : "border-zinc-800 bg-black/30 text-zinc-300 hover:border-zinc-600"
          }`}
        >
          {mode.label}
        </button>
      ))}
    </div>
  );
}
