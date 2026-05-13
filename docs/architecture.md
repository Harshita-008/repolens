# RepoLens Architecture

RepoLens is a Next.js application for understanding unfamiliar GitHub repositories. The product flow is intentionally split into small modules so parser logic, AI prompts, persisted analysis data, and UI panels can evolve independently.

## Core Flow

1. `/api/ingest` receives a GitHub repository URL.
2. `src/lib/git` clones and scans relevant source files.
3. `src/lib/parser` builds summaries, tech signals, heatmaps, important files, and architecture graph data.
4. `src/lib/health` evaluates generic repo readiness signals such as tests, CI, docs, env templates, Docker, large files, and possible secrets.
5. `src/lib/chat` chunks repo files and stores short-lived chat context in memory.
6. `src/lib/repositories` persists completed analyses locally in `.repolens/analyses.json` so users can reopen workspaces without cloning again.
7. UI panels in `src/components` render the dashboard, graph, chat, health report, diff impact analyzer, and file explorer.

## Why Local JSON Persistence

The current app is a portfolio/dev build, so local JSON persistence gives a working saved-dashboard experience without forcing Docker or a database. The store is isolated behind `repoAnalysisStore.ts`, which keeps a future Prisma/Postgres migration straightforward.

## AI Grounding

Chat answers are built from retrieved chunks of the scanned repository. API responses include source paths, line ranges, and snippets so the interface can show evidence beside AI answers.

## PR Impact Analysis

The diff impact analyzer parses unified git diffs, maps changed files to known architecture modules when possible, and generates review focus and test suggestions from generic path and churn heuristics. It does not hardcode behavior for any specific repository.
