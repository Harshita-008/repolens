import {
  ArchitectureModule,
  ModuleDependency,
} from "./types";

const FLOW_RULES: {
  source: string;
  target: string;
  label: string;
}[] = [
  {
    source: "ui",
    target: "api",
    label: "requests",
  },
  {
    source: "ui",
    target: "auth",
    label: "signs in",
  },
  {
    source: "ui",
    target: "state",
    label: "shares state",
  },
  {
    source: "state",
    target: "api",
    label: "calls API",
  },
  {
    source: "api",
    target: "auth",
    label: "verifies",
  },
  {
    source: "api",
    target: "logic",
    label: "orchestrates",
  },
  {
    source: "api",
    target: "database",
    label: "queries",
  },
  {
    source: "api",
    target: "storage",
    label: "stores files",
  },
  {
    source: "api",
    target: "payments",
    label: "charges",
  },
  {
    source: "api",
    target: "realtime",
    label: "publishes",
  },
  {
    source: "api",
    target: "ai",
    label: "calls",
  },
  {
    source: "logic",
    target: "ai",
    label: "uses",
  },
  {
    source: "ai",
    target: "vector",
    label: "embeds",
  },
  {
    source: "vector",
    target: "database",
    label: "persists",
  },
];

export function inferDataFlows(
  modules: ArchitectureModule[],
  importDependencies: ModuleDependency[]
): ModuleDependency[] {
  const existingModuleIds = new Set(
    modules.map((module) => module.id)
  );

  const flows = FLOW_RULES.filter(
    (rule) =>
      existingModuleIds.has(rule.source) &&
      existingModuleIds.has(rule.target)
  ).map((rule) => ({
    ...rule,
    weight: 4,
  }));

  const importFlows = importDependencies
    .filter(
      (dependency) =>
        existingModuleIds.has(
          dependency.source
        ) &&
        existingModuleIds.has(
          dependency.target
        )
    )
    .map((dependency) => ({
      ...dependency,
      label:
        dependency.weight > 1
          ? `${dependency.weight} imports`
          : "imports",
    }));

  const merged = new Map<
    string,
    ModuleDependency
  >();

  for (const dependency of [
    ...flows,
    ...importFlows,
  ]) {
    const key = `${dependency.source}->${dependency.target}`;
    const existing = merged.get(key);

    if (!existing) {
      merged.set(key, dependency);
      continue;
    }

    if (existing.weight >= 4) {
      continue;
    }

    if (dependency.weight > existing.weight) {
      merged.set(key, dependency);
    }
  }

  return Array.from(merged.values());
}
