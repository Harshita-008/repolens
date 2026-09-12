import { getOpenRouterClient, OPENROUTER_MODEL } from "../ai/openrouter";
import { RepoFile } from "../git/fileScanner";

function buildImportantFilesContext(
  files: RepoFile[]
) {
  return files
    .slice(0, 10)
    .map(
      (f) =>
        `FILE: ${f.path}\n${f.content.slice(0, 700)}\n...[truncated]`
    )
    .join("\n\n");
}

const SYSTEM_PROMPT = `
You are an elite senior software architect.

Your job:
- analyze repositories accurately
- write concise developer-friendly outputs
- avoid generic explanations
- prefer bullets over paragraphs
- prioritize readability
- be specific to the repository
`;

export interface AnalysisInput {
  tree: string;
  files: RepoFile[];
  importantFiles: RepoFile[];
  structure: unknown;
  architecture: unknown;
  dependencies: unknown;
}

export async function generateRepoSummary(
  input: AnalysisInput
) {
  const prompt = `
You are analyzing a GitHub repository.

MAIN STRUCTURE:
${JSON.stringify(input.structure, null, 2)}

ARCHITECTURE DETECTION:
${JSON.stringify(input.architecture, null, 2)}

IMPORTANT FILES:
${buildImportantFilesContext(input.importantFiles)}

Generate a concise repository analysis.

VERY IMPORTANT:
- Be specific to THIS repository
- Avoid generic explanations
- Avoid long paragraphs
- Keep it highly readable
- Use markdown headings properly
- Use bullet points for details
- Keep explanations short and developer-friendly
- Maximum 250 words

OUTPUT FORMAT:

## What This Project Does
- short point
- short point
- short point

## Tech Stack
- technology
- technology
- technology

## Architecture
## Frontend
- short explanation

## Backend
- short explanation

## State Management
- short explanation

## Core Features
- feature
- feature
- feature

## Interesting Engineering Patterns
- pattern
- pattern

SPACING RULES:
- Leave ONE empty line between sections
- Do NOT leave empty lines between bullet points
- Keep sections compact
`;

  const completion =
    await getOpenRouterClient().chat.completions.create({
        model: OPENROUTER_MODEL,
        temperature: 0.3,
        max_tokens: 400,

      messages: [
        {
          role: "system",
          content: SYSTEM_PROMPT,
        },
        {
          role: "user",
          content: prompt,
        },
      ]
    }, {
      timeout: 20000,
    });

  return (
    completion.choices[0].message.content ||
    "Failed to generate summary."
  );
}

export async function generateReadFirst(
  input: AnalysisInput
) {
  const prompt = `
Analyze this repository and identify the most important files a developer should read first.

Repository Structure:
${JSON.stringify(input.structure)}

IMPORTANT FILES:
${buildImportantFilesContext(input.importantFiles)}

VERY IMPORTANT:
- Be specific to THIS repository
- Avoid generic explanations
- Keep explanations concise
- Prioritize beginner readability
- Maximum 8 files

For each file:
- explain what it does
- explain why it matters
- keep explanation under 2 short lines

OUTPUT FORMAT:

## 1. package.json
Lists dependencies, scripts, and metadata.
Shows the project stack and run/build commands.

## 2. README.md
Provides setup instructions and project overview.
Helps developers quickly understand the repository.

## 3. src/app/page.tsx
Main application entry page.
Useful for understanding UI flow and routing.

SPACING RULES:
- Leave ONE empty line between every file section
- Do NOT leave empty lines inside the same file section
- Keep output compact and highly readable
`;
  const completion =
    await getOpenRouterClient().chat.completions.create({
        model: OPENROUTER_MODEL,
        temperature: 0.3,
        max_tokens: 400,

      messages: [
        {
          role: "system",
          content: SYSTEM_PROMPT,
        },
        {
          role: "user",
          content: prompt,
        },
      ]
    }, {
      timeout: 20000,
    });

  return (
    completion.choices[0].message.content ||
    "Failed to generate."
  );
}

export async function generateRoadmap(
  input: AnalysisInput
) {
  const prompt = `
You are analyzing a GitHub repository.

MAIN STRUCTURE:
${JSON.stringify(input.structure, null, 2)}

ARCHITECTURE:
${JSON.stringify(input.architecture, null, 2)}

IMPORTANT FILES:
${buildImportantFilesContext(input.importantFiles)}

Generate a developer learning roadmap for understanding this repository.

VERY IMPORTANT:
- Be specific to THIS repository
- Avoid generic explanations
- Keep explanations concise
- Focus on developer onboarding
- Use markdown headings properly
- Maximum 5 phases

OUTPUT FORMAT:

# Phase 1 — Project Basics

## Understand the tech stack
- short point
- short point

## Important config files
- package.json
- tsconfig.json
- next.config.js

## Run the application
- npm install
- npm run dev

# Phase 2 — Core Architecture

## Pages and routing
- short point

## API layer
- short point

## State management
- short point

# Phase 3 — Data Flow

## Backend integration
- short point

## Database interactions
- short point

# Phase 4 — UI System

## Components
- short point

## Styling
- short point

# Phase 5 — Advanced Concepts

## Performance
- short point

## Deployment
- short point

SPACING RULES:
- Leave ONE empty line between phases
- Leave ONE empty line between subsection groups
- Do NOT leave empty lines between bullet points
- Keep output compact and structured
`;

  const completion =
    await getOpenRouterClient().chat.completions.create({
        model: OPENROUTER_MODEL,
        temperature: 0.3,
        max_tokens: 500,

      messages: [
        {
          role: "system",
          content: SYSTEM_PROMPT,
        },
        {
          role: "user",
          content: prompt,
        },
      ]
    }, {
      timeout: 20000,
    });

  return (
    completion.choices[0].message.content ||
    "Failed to generate roadmap."
  );
}
