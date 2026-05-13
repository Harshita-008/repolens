import { ChatMessage, RepoChatContext, RepoChunk } from "./types";

export function buildChatPrompt(input: {
  context: RepoChatContext;
  chunks: RepoChunk[];
  question: string;
  history: ChatMessage[];
}) {
  const recentHistory = input.history
    .slice(-6)
    .map(
      (message) =>
        `${message.role.toUpperCase()}: ${message.content}`
    )
    .join("\n\n");

  const fileContext = input.chunks
    .map(
      (chunk, index) => `
[${index + 1}] ${chunk.path}:${chunk.startLine}-${chunk.endLine}
\`\`\`
${chunk.content.slice(0, 2600)}
\`\`\`
`
    )
    .join("\n");

  return `
You are RepoLENS Chat, a senior codebase guide.

Answer the developer's question using ONLY the repository context below.
Be specific to this repository. Cite file paths when useful.
If the context is insufficient, say what is missing and give the best grounded answer.

REPOSITORY: ${input.context.repoName}

SUMMARY:
${input.context.summary}

ROADMAP:
${input.context.roadmap.slice(0, 1200)}

RELEVANT FILE CONTEXT:
${fileContext}

RECENT CHAT:
${recentHistory || "No previous messages."}

QUESTION:
${input.question}

Answer format:
- Start with the direct answer.
- Then use short paragraphs and concise bullets with file references.
- Do not use markdown tables.
- Do not overuse bold text; reserve it for section labels.
- Prefer 2-4 small sections when the answer is complex.
- Keep it practical and developer-friendly.
`;
}
