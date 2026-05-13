export function detectLanguage(path: string) {
  const extension =
    path.split(".").pop()?.toLowerCase() || "";

  const languageByExtension: Record<string, string> = {
    ts: "typescript",
    tsx: "tsx",
    js: "javascript",
    jsx: "jsx",
    json: "json",
    css: "css",
    scss: "scss",
    md: "markdown",
    py: "python",
    java: "java",
    go: "go",
    rs: "rust",
    yml: "yaml",
    yaml: "yaml",
  };

  return languageByExtension[extension] || "text";
}
