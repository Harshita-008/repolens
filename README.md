# RepoLens

RepoLens is an AI-powered repository intelligence tool for onboarding into unfamiliar codebases. Paste a GitHub repository URL and it generates an architecture map, onboarding roadmap, cited repo chat, health report, and PR/diff impact analysis.

## Features

- Persistent repo dashboard for reopening recent analyses
- AI repository summary, read-first guide, and learning roadmap
- Interactive architecture graph with module and file details
- Chat with repository context, source citations, and code snippets
- Generic repository health report for docs, tests, CI, config, and risk signals
- PR/diff impact analyzer with affected modules, review focus, and test suggestions
- File explorer with syntax highlighting for important files

## Getting Started

Install dependencies:

```bash
npm install
```

Create local environment variables:

```bash
cp .env.example .env.local
```

Fill in:

```bash
GEMINI_API_KEY=...
OPENROUTER_API_KEY=...
```

Run the development server:

```bash
npm run dev
```

Open `http://localhost:3000`.

## Useful Scripts

```bash
npm run dev
npm run lint
npm run build
```

## Architecture

See [docs/architecture.md](docs/architecture.md) for the system flow and module boundaries.

## Local Data

RepoLens saves local analysis history in `.repolens/`, which is ignored by git. Cloned repositories are stored in the operating system temp directory so large analyzed repos do not slow down Next.js builds.
