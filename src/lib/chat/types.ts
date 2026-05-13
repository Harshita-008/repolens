import { RepoFile } from "../git/fileScanner";

export interface RepoChunk {
  id: string;
  path: string;
  content: string;
  startLine: number;
  endLine: number;
  tokens: string[];
}

export interface RepoChatContext {
  repoName: string;
  tree: string;
  summary: string;
  roadmap: string;
  files: RepoFile[];
  chunks: RepoChunk[];
}

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}
