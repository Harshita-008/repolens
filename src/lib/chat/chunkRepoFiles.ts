import { RepoFile } from "../git/fileScanner";
import { tokenizeText } from "./tokenize";
import { RepoChunk } from "./types";

const MAX_FILE_CHARS = 12000;
const CHUNK_LINE_COUNT = 80;
const CHUNK_LINE_OVERLAP = 12;

export function chunkRepoFiles(
  files: RepoFile[]
): RepoChunk[] {
  const chunks: RepoChunk[] = [];

  for (const file of files) {
    const content = file.content.slice(
      0,
      MAX_FILE_CHARS
    );
    const lines = content.split(/\r?\n/);

    for (
      let start = 0;
      start < lines.length;
      start += CHUNK_LINE_COUNT - CHUNK_LINE_OVERLAP
    ) {
      const end = Math.min(
        start + CHUNK_LINE_COUNT,
        lines.length
      );
      const chunkLines = lines.slice(start, end);
      const chunkContent =
        chunkLines.join("\n").trim();

      if (!chunkContent) continue;

      chunks.push({
        id: `${file.path}:${start + 1}-${end}`,
        path: file.path,
        content: chunkContent,
        startLine: start + 1,
        endLine: end,
        tokens: tokenizeText(
          `${file.path}\n${chunkContent}`
        ),
      });

      if (end >= lines.length) break;
    }
  }

  return chunks;
}
