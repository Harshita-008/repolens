import { RepoFile } from "../git/fileScanner";
import { buildArchitectureGraph } from "./graph/buildArchitectureGraph";

export function generateGraph(
  files: RepoFile[]
) {
  return buildArchitectureGraph(files);
}
