export type GraphCategory =
  | "frontend"
  | "logic"
  | "backend"
  | "ai"
  | "data"
  | "security"
  | "feature"
  | "service";

export type GraphNodeKind =
  | "system"
  | "module";

export interface ArchitectureModule {
  id: string;
  label: string;
  category: GraphCategory;
  kind: GraphNodeKind;
  description: string;
  files: string[];
}

export interface ModuleDependency {
  source: string;
  target: string;
  label: string;
  weight: number;
}

export interface GraphNodeData {
  label: string;
  description?: string;
  category: GraphCategory;
  kind: GraphNodeKind;
  fileCount?: number;
  files?: string[];
}

export interface GraphNode {
  id: string;
  type?: string;
  position: {
    x: number;
    y: number;
  };
  data: GraphNodeData;
  style?: Record<string, string | number>;
}

export interface GraphEdge {
  id: string;
  type?: string;
  source: string;
  target: string;
  sourceHandle?: string;
  targetHandle?: string;
  label?: string;
  animated?: boolean;
  hidden?: boolean;
  style?: Record<string, string | number>;
  labelStyle?: Record<string, string | number>;
  labelBgStyle?: Record<string, string | number>;
  markerEnd?: {
    type: "arrowclosed";
    color?: string;
  };
}
