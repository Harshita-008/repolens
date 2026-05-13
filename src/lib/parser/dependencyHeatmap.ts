export function generateDependencyHeatmap(
  files: {
    path: string;
    content: string;
  }[]
) {
  const heatmap = files.map((file) => {
    const importMatches =
      file.content.match(
        /import[\s\S]*?from/g
      ) || [];

    const requireMatches =
      file.content.match(
        /require\(/g
      ) || [];

    const score =
      importMatches.length +
      requireMatches.length;

    return {
      path: file.path,
      score,
    };
  });

  return heatmap
    .sort((a, b) => b.score - a.score)
    .slice(0, 10);
}