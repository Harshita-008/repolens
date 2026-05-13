import fs from "fs";
import path from "path";

export interface DependencyAnalysis {
  frameworks: string[];
  databases: string[];
  auth: string[];
  ai: string[];
  stateManagement: string[];
  styling: string[];
  deployment: string[];
  testing: string[];
  other: string[];
}

export function detectTechStack(
  repoPath: string
): DependencyAnalysis {
  const packageJsonPath = path.join(
    repoPath,
    "package.json"
  );

  if (!fs.existsSync(packageJsonPath)) {
    return emptyResult();
  }

  const packageJson = JSON.parse(
    fs.readFileSync(packageJsonPath, "utf-8")
  );

  const deps = {
    ...packageJson.dependencies,
    ...packageJson.devDependencies,
  };

  const packages = Object.keys(deps || {});

  const result: DependencyAnalysis = {
    frameworks: [],
    databases: [],
    auth: [],
    ai: [],
    stateManagement: [],
    styling: [],
    deployment: [],
    testing: [],
    other: [],
  };

  function has(pkg: string) {
    return packages.some((p) =>
      p.toLowerCase().includes(pkg)
    );
  }

  // =========================
  // FRAMEWORKS
  // =========================

  if (has("next")) {
    result.frameworks.push("Next.js");
  }

  if (has("react")) {
    result.frameworks.push("React");
  }

  if (has("vue")) {
    result.frameworks.push("Vue");
  }

  if (has("svelte")) {
    result.frameworks.push("Svelte");
  }

  if (has("express")) {
    result.frameworks.push("Express");
  }

  if (has("nestjs")) {
    result.frameworks.push("NestJS");
  }

  // =========================
  // DATABASES
  // =========================

  if (has("prisma")) {
    result.databases.push("Prisma");
  }

  if (has("mongoose")) {
    result.databases.push("MongoDB");
  }

  if (has("postgres")) {
    result.databases.push("PostgreSQL");
  }

  if (has("mysql")) {
    result.databases.push("MySQL");
  }

  if (has("supabase")) {
    result.databases.push("Supabase");
  }

  if (has("firebase")) {
    result.databases.push("Firebase");
  }

  if (has("appwrite")) {
    result.databases.push("Appwrite");
  }

  // =========================
  // AUTH
  // =========================

  if (has("clerk")) {
    result.auth.push("Clerk");
  }

  if (has("next-auth")) {
    result.auth.push("NextAuth");
  }

  if (has("auth0")) {
    result.auth.push("Auth0");
  }

  if (has("firebase-auth")) {
    result.auth.push("Firebase Auth");
  }

  // =========================
  // AI
  // =========================

  if (has("openai")) {
    result.ai.push("OpenAI");
  }

  if (has("langchain")) {
    result.ai.push("LangChain");
  }

  if (has("anthropic")) {
    result.ai.push("Anthropic");
  }

  if (has("google-generative")) {
    result.ai.push("Gemini");
  }

  if (has("pinecone")) {
    result.ai.push("Pinecone");
  }

  // =========================
  // STATE MANAGEMENT
  // =========================

  if (has("redux")) {
    result.stateManagement.push("Redux");
  }

  if (has("zustand")) {
    result.stateManagement.push("Zustand");
  }

  if (has("recoil")) {
    result.stateManagement.push("Recoil");
  }

  if (has("jotai")) {
    result.stateManagement.push("Jotai");
  }

  // =========================
  // STYLING
  // =========================

  if (has("tailwind")) {
    result.styling.push("Tailwind CSS");
  }

  if (has("styled-components")) {
    result.styling.push(
      "Styled Components"
    );
  }

  if (has("sass")) {
    result.styling.push("Sass");
  }

  // =========================
  // DEPLOYMENT
  // =========================

  if (has("vercel")) {
    result.deployment.push("Vercel");
  }

  if (has("docker")) {
    result.deployment.push("Docker");
  }

  // =========================
  // TESTING
  // =========================

  if (has("jest")) {
    result.testing.push("Jest");
  }

  if (has("vitest")) {
    result.testing.push("Vitest");
  }

  if (has("cypress")) {
    result.testing.push("Cypress");
  }

  return result;
}

function emptyResult(): DependencyAnalysis {
  return {
    frameworks: [],
    databases: [],
    auth: [],
    ai: [],
    stateManagement: [],
    styling: [],
    deployment: [],
    testing: [],
    other: [],
  };
}