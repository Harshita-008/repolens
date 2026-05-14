# RepoLens

RepoLens is an AI-powered repository intelligence workspace for understanding unfamiliar codebases faster. Paste a public GitHub repository URL and RepoLens generates a structured engineering view of the project: architecture, onboarding guidance, health signals, test gaps, file exploration, repo chat, and PR/diff impact analysis.

Live app: [https://repolens-six.vercel.app/](https://repolens-six.vercel.app/)

## Why RepoLens

Modern codebases are difficult to evaluate quickly. A developer joining a new repository often has to inspect configuration files, architecture boundaries, entry points, API routes, test coverage, CI setup, and recent changes before they can make a confident contribution.

RepoLens turns that first-pass exploration into a focused workspace. It helps developers answer:

- What does this repository do?
- Which files should I read first?
- How is the project structured?
- What are the main health and readiness gaps?
- Which files are risky or important?
- What should reviewers focus on in a PR?
- Can I ask repo-specific questions without manually searching everything?

## Features

### Repository Intelligence Workspace

Analyze a public GitHub repository and get a complete workspace with summary, architecture, health, files, roadmap, chat, and PR impact sections.

### AI Repository Summary

Generates a concise explanation of the project, its architecture, tech stack, core responsibilities, and important engineering patterns.

### Read-First Guide

Identifies the most important files a developer should inspect first and explains why each file matters.

### Learning Roadmap

Creates a phased onboarding path for understanding the repository from project basics to deeper architecture and advanced concepts.

### Architecture Graph

Visualizes modules, ownership boundaries, and relationships between key parts of the codebase using an interactive graph.

### Dependency Heatmap

Highlights files with higher dependency gravity so reviewers can quickly identify areas that may need extra care.

### Repository Health Report

Detects production-readiness signals such as README, tests, CI workflows, Docker files, environment templates, package managers, large files, and possible hardcoded secrets.

### Test Gap Detector

Finds important source files that do not appear to have nearby test coverage and suggests likely test file paths.

### PR / Diff Impact Analyzer

Paste a unified git diff or provide a GitHub PR URL to identify changed files, risk level, affected modules, suggested tests, and review focus.

### Repo Chat

Ask questions about the analyzed repository. RepoLens answers using stored repository context such as tree, summary, roadmap, and scanned file chunks.

### File Search and Preview

Search important files and inspect selected source files directly inside the workspace.

### Saved Workspaces

Reopen recent analyses without immediately re-analyzing the same repository.

## Tech Stack

- Framework: Next.js App Router
- Language: TypeScript
- UI: React, Tailwind CSS
- Icons: Lucide React
- Graphs: React Flow
- AI providers: OpenRouter, Gemini
- HTTP client: Axios
- Repository access: GitHub repo fetch/clone pipeline
- Storage: local JSON analysis store for MVP usage
- Deployment: Vercel

## High-Level Architecture

```text
User enters GitHub URL
        |
        v
Next.js client workspace
        |
        v
/api/ingest
        |
        v
Repository fetch / clone
        |
        v
File scanner + repo tree builder
        |
        v
Architecture, structure, dependency, health, and important-file analyzers
        |
        v
AI summary + read-first guide + roadmap generation
        |
        v
Saved analysis + repo chat context
        |
        v
Workspace UI renders insights
```

## Key Implementation Details

### Analysis Pipeline

The main analysis flow is handled by the `/api/ingest` route. It receives a repository URL, retrieves the repository, scans important files, builds a repository tree, detects architecture, creates graph data, finds important files, generates AI-backed explanations, computes health signals, saves the analysis, and returns the final workspace payload.

### File Scanning

RepoLens intentionally does not scan every file blindly. It filters noisy folders such as `node_modules`, `.next`, `.git`, `dist`, `build`, `coverage`, and similar generated directories. It focuses on source, markdown, and configuration files that are useful for understanding the project.

### Health Analysis

The health report is deterministic rather than AI-generated. It checks concrete repository signals such as documentation, tests, CI, environment templates, package managers, large files, and possible secret-like values. This makes the score explainable and repeatable.

### AI Usage

AI is used where synthesis is valuable: repository summary, read-first guidance, roadmap generation, and repo chat. Deterministic checks such as health scoring and test-gap detection are kept rule-based to reduce cost and improve consistency.

### Saved Analysis Storage

RepoLens currently stores saved analyses in a JSON file under `.repolens/` locally. In Vercel/serverless environments, temporary storage may not persist across cold starts or redeploys. A production-grade version should move saved workspaces to persistent storage such as Supabase, Neon, Vercel Postgres, or another database.

### Browser Local Storage

The client stores a small subset of the active repo context in browser `localStorage`, such as repo name, tree, summary, and roadmap. The full saved analysis is not stored in browser local storage.

## Project Structure

```text
src/
  app/
    api/
      ingest/          Main repository analysis endpoint
      chat/            Repository chat endpoint
      pr-impact/       PR and unified diff impact analyzer
      repos/           Saved analysis list and lookup endpoints
      roadmap/         Roadmap-related API route
    page.tsx           Main workspace shell
    layout.tsx         App metadata and root layout
    icon.svg           RepoLens favicon

  components/
    chat/              Repository chat UI
    dashboard/         Saved workspace dashboard
    health/            Repository health report
    impact/            PR / diff analyzer UI
    layout/            Sidebar and layout components
    quality/           Test gap and quality-related panels
    repo/              Architecture graph, file preview, repo views
    search/            Code search
    workspace/         Workspace tabs, inspector, shell, sections

  lib/
    ai/                AI provider clients
    chat/              Chat prompt and repo context utilities
    diff/              Diff parsing and PR diff fetching
    git/               Repository fetch, clone, scan, and tree utilities
    health/            Repository health analysis
    parser/            Architecture, graph, dependency, and structure analyzers
    quality/           Test gap detection
    repositories/      Saved analysis store and shared types
```

## Getting Started

### 1. Clone the repository

```bash
git clone <your-repo-url>
cd repolens
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a local environment file:

```bash
cp .env.example .env.local
```

Fill in the required values:

```env
OPENROUTER_API_KEY=your_openrouter_key
GEMINI_API_KEY=your_gemini_key
```

Optional for higher GitHub API reliability:

```env
GITHUB_TOKEN=your_read_only_github_token
```

### 4. Run the development server

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

## Scripts

```bash
npm run dev      # Start the local development server
npm run lint     # Run ESLint
npm run build    # Create a production build
npm run start    # Start the production server after build
```

## Deployment

RepoLens is deployed as a single Next.js application on Vercel. The frontend and backend API routes are deployed together.

Required Vercel environment variables:

```env
OPENROUTER_API_KEY
GEMINI_API_KEY
```

Recommended:

```env
GITHUB_TOKEN
```

After adding environment variables, redeploy the latest commit from Vercel.

## Current Limitations

- Saved workspaces are not backed by a permanent database yet.
- Very large repositories may be capped or may require more robust background processing.
- GitHub API usage may be rate-limited without a token.
- Private repository analysis is not supported yet.
- Health and test-gap checks are heuristic, not a replacement for full CI or coverage reports.
- AI output depends on the scanned context and configured provider availability.

## Roadmap

- Persistent database-backed saved workspaces
- Analysis history and health trend timeline
- GitHub OAuth or GitHub App support for private repositories
- Background jobs for large repositories
- Team/workspace accounts
- Exportable engineering reports
- Stronger dependency and security audit panels
- PR review comment generator

## Status

RepoLens is an active product prototype focused on developer onboarding, code review preparation, and repository understanding. It is designed to feel like a practical engineering workspace rather than a static report generator.
