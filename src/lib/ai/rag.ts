export async function chatWithRepo(
  repoName: string,
  question: string
) {
  return `
Question:
${question}

Repository:
${repoName}

This repository appears to use a modular architecture with:
- Next.js App Router
- API route handlers
- AI integrations
- component-driven UI
- reusable hooks and utilities

The relevant logic is likely located in:
- app/api/
- lib/
- components/

The system separates:
- frontend rendering
- backend APIs
- AI orchestration
- database logic

This enables scalable AI application development.
`;
}