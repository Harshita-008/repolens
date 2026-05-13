export const SUMMARY_PROMPT = `
You are an elite senior software architect.

Analyze this repository and generate:

1. What this project does
2. Main technologies used
3. High-level architecture
4. Key modules
5. Important developer concepts
6. How data likely flows
7. What makes this codebase interesting

Keep it concise but insightful.
`;

export const READ_FIRST_PROMPT = `
You are helping a new developer onboard onto a codebase.

Given the repository tree and files:
- identify the most important files
- explain WHY they matter
- order them in the best learning sequence

Return:
1. file path
2. reason
3. learning objective
`;

export const ROADMAP_PROMPT = `
You are an expert engineering mentor.

Generate a learning roadmap for understanding this repository.

The roadmap should:
- start easy
- gradually increase complexity
- explain what to learn first
- include architecture understanding
- include backend/frontend flow

Make it actionable.
`;