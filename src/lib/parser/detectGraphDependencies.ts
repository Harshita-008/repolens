import { RepoFile } from "../git/fileScanner";

export interface GraphDependency {
  source: string;
  target: string;
}

export function detectGraphDependencies(
  files: RepoFile[]
): GraphDependency[] {
  const edges: GraphDependency[] = [];

  for (const file of files) {
    const sourceFolder =
      file.path.split("/")[0];

    const importRegex =
      /from\s+['"](.*?)['"]/g;

    const matches = [
      ...file.content.matchAll(
        importRegex
      ),
    ];

    for (const match of matches) {
      const importPath =
        match[1];

      // ONLY INTERNAL IMPORTS

      if (
        !importPath.startsWith(".")
      ) {
        continue;
      }

      const cleanImport =
        importPath
          .replace("./", "")
          .replace("../", "");

      const targetFile =
        files.find((f) =>
          f.path.includes(
            cleanImport
          )
        );

      if (!targetFile) continue;

      const targetFolder =
        targetFile.path.split(
          "/"
        )[0];

      if (
        sourceFolder ===
        targetFolder
      ) {
        continue;
      }

      const alreadyExists =
        edges.some(
          (e) =>
            e.source ===
              sourceFolder &&
            e.target ===
              targetFolder
        );

      if (alreadyExists) {
        continue;
      }

      edges.push({
        source: sourceFolder,
        target: targetFolder,
      });
    }
  }

  return edges;
}