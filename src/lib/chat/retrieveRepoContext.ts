import { tokenizeText } from "./tokenize";
import { RepoChatContext, RepoChunk } from "./types";

const MAX_SELECTED_CHUNKS = 8;

export function retrieveRepoContext(
  context: RepoChatContext,
  question: string
) {
  const queryTokens = tokenizeText(question);
  const querySet = new Set(queryTokens);

  const scoredChunks = context.chunks
    .map((chunk) => ({
      chunk,
      score: scoreChunk(chunk, querySet),
    }))
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, MAX_SELECTED_CHUNKS)
    .map((item) => item.chunk);

  return scoredChunks.length > 0
    ? scoredChunks
    : context.chunks.slice(0, MAX_SELECTED_CHUNKS);
}

function scoreChunk(
  chunk: RepoChunk,
  queryTokens: Set<string>
) {
  let score = 0;
  const path = chunk.path.toLowerCase();

  for (const token of queryTokens) {
    if (path.includes(token)) {
      score += 8;
    }
  }

  for (const token of chunk.tokens) {
    if (queryTokens.has(token)) {
      score += 1;
    }
  }

  return score;
}
