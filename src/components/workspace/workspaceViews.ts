import {
  BookOpen,
  FileCode2,
  GitPullRequest,
  Map,
  MessageSquare,
  Network,
  ShieldCheck,
  type LucideIcon,
} from "lucide-react";

export type WorkspaceView =
  | "overview"
  | "architecture"
  | "health"
  | "impact"
  | "chat"
  | "files"
  | "roadmap";

export interface WorkspaceViewItem {
  id: WorkspaceView;
  label: string;
  icon: LucideIcon;
}

export const workspaceViews: WorkspaceViewItem[] = [
  { label: "Overview", id: "overview", icon: BookOpen },
  { label: "Architecture", id: "architecture", icon: Network },
  { label: "Health", id: "health", icon: ShieldCheck },
  { label: "PR Impact", id: "impact", icon: GitPullRequest },
  { label: "Chat", id: "chat", icon: MessageSquare },
  { label: "Files", id: "files", icon: FileCode2 },
  { label: "Roadmap", id: "roadmap", icon: Map },
];
