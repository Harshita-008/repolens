const STOP_WORDS = new Set([
  "the",
  "and",
  "for",
  "that",
  "this",
  "with",
  "from",
  "what",
  "where",
  "when",
  "how",
  "why",
  "are",
  "does",
  "into",
  "about",
  "repo",
  "repository",
  "code",
  "file",
  "files",
]);

export function tokenizeText(text: string) {
  return text
    .toLowerCase()
    .split(/[^a-z0-9_/-]+/)
    .map((token) => token.trim())
    .filter(
      (token) =>
        token.length > 2 &&
        !STOP_WORDS.has(token)
    );
}
