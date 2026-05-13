import { RepoFile } from "../../git/fileScanner";
import {
  ArchitectureModule,
  GraphCategory,
} from "./types";

const MODULE_RULES: {
  id: string;
  label: string;
  category: GraphCategory;
  description: string;
  pathPatterns: RegExp[];
  contentPatterns: RegExp[];
}[] = [
  {
    id: "ui",
    label: "Frontend UI",
    category: "frontend",
    description:
      "Screens, visual components, layouts, and user interactions.",
    pathPatterns: [
      /(^|\/)(app|pages|views|screens)(\/|$)/,
      /(^|\/)(components|ui)(\/|$)/,
    ],
    contentPatterns: [
      /\breact\b/i,
      /\buseState\b/,
      /\bjsx\b/i,
    ],
  },
  {
    id: "state",
    label: "State Management",
    category: "frontend",
    description:
      "Client-side stores, hooks, context, and shared UI state.",
    pathPatterns: [
      /(^|\/)(hooks|store|stores|state|context|providers)(\/|$)/,
    ],
    contentPatterns: [
      /\bzustand\b/i,
      /\bredux\b/i,
      /\brecoil\b/i,
      /\bcreateContext\b/,
    ],
  },
  {
    id: "api",
    label: "API Layer",
    category: "backend",
    description:
      "Server endpoints, route handlers, controllers, and request orchestration.",
    pathPatterns: [
      /(^|\/)(api|routes|controllers|server)(\/|$)/,
      /(^|\/)route\.(ts|tsx|js|jsx)$/,
      /(^|\/)pages\/api(\/|$)/,
    ],
    contentPatterns: [
      /\bNextResponse\b/,
      /\bNextRequest\b/,
      /\bexpress\b/i,
      /\brouter\./,
    ],
  },
  {
    id: "logic",
    label: "Business Logic",
    category: "logic",
    description:
      "Domain services, parsers, utilities, and application rules.",
    pathPatterns: [
      /(^|\/)(lib|services|service|utils|helpers|parser|core)(\/|$)/,
    ],
    contentPatterns: [],
  },
  {
    id: "auth",
    label: "Authentication",
    category: "security",
    description:
      "Sign-in, sessions, access control, and identity providers.",
    pathPatterns: [
      /(^|\/)(auth|session|middleware|security)(\/|$)/,
    ],
    contentPatterns: [
      /\bnextauth\b/i,
      /\bclerk\b/i,
      /\bsupabase\.auth\b/i,
      /\bsignIn\b/,
      /\bsignOut\b/,
    ],
  },
  {
    id: "database",
    label: "Database",
    category: "data",
    description:
      "Persistent data models, queries, ORM clients, and migrations.",
    pathPatterns: [
      /(^|\/)(db|database|prisma|drizzle|models|schema|migrations)(\/|$)/,
    ],
    contentPatterns: [
      /\bprisma\b/i,
      /\bdrizzle\b/i,
      /\bmongodb\b/i,
      /\bpostgres\b/i,
      /\bsupabase\b/i,
      /\bmongoose\b/i,
    ],
  },
  {
    id: "ai",
    label: "AI Engine",
    category: "ai",
    description:
      "LLM providers, prompts, embeddings, agents, and AI orchestration.",
    pathPatterns: [
      /(^|\/)(ai|llm|agents|prompts|rag|embeddings)(\/|$)/,
    ],
    contentPatterns: [
      /\bopenai\b/i,
      /\bgemini\b/i,
      /\banthropic\b/i,
      /\bembedding/i,
      /\bprompt\b/i,
    ],
  },
  {
    id: "vector",
    label: "Vector DB",
    category: "ai",
    description:
      "Semantic search, embeddings storage, and retrieval indexes.",
    pathPatterns: [
      /(^|\/)(vector|vectors|chroma|pinecone|weaviate|qdrant)(\/|$)/,
    ],
    contentPatterns: [
      /\bchroma\b/i,
      /\bpinecone\b/i,
      /\bvector\b/i,
      /\bsimilaritySearch\b/,
    ],
  },
  {
    id: "storage",
    label: "File Storage",
    category: "data",
    description:
      "Uploads, buckets, filesystems, and object storage integrations.",
    pathPatterns: [
      /(^|\/)(storage|uploads|files|assets|bucket)(\/|$)/,
    ],
    contentPatterns: [
      /\bwriteFile\b/,
      /\breadFile\b/,
      /\bbucket\b/i,
      /\bs3\b/i,
    ],
  },
  {
    id: "payments",
    label: "Payments",
    category: "service",
    description:
      "Billing, checkout, subscriptions, and payment webhooks.",
    pathPatterns: [
      /(^|\/)(billing|payments|checkout|stripe)(\/|$)/,
    ],
    contentPatterns: [
      /\bstripe\b/i,
      /\bcheckout\b/i,
      /\bsubscription\b/i,
    ],
  },
  {
    id: "realtime",
    label: "Realtime Engine",
    category: "backend",
    description:
      "Sockets, streams, live updates, and event subscriptions.",
    pathPatterns: [
      /(^|\/)(realtime|socket|sockets|events|stream)(\/|$)/,
    ],
    contentPatterns: [
      /\bwebsocket\b/i,
      /\bsocket\.io\b/i,
      /\beventsource\b/i,
      /\bstream\b/i,
    ],
  },
];

export function classifyFile(
  file: RepoFile
): ArchitectureModule[] {
  const normalizedPath =
    file.path.replace(/\\/g, "/");

  const lowerPath =
    normalizedPath.toLowerCase();

  const matches =
    MODULE_RULES.filter((rule) => {
      const pathMatch =
        rule.pathPatterns.some((pattern) =>
          pattern.test(lowerPath)
        );

      const contentMatch =
        rule.contentPatterns.some((pattern) =>
          pattern.test(file.content)
        );

      return pathMatch || contentMatch;
    });

  if (matches.length === 0) {
    return [
      {
        id: "project",
        label: "Project Code",
        category: "service",
        kind: "system",
        description:
          "General project files that support the application.",
        files: [normalizedPath],
      },
    ];
  }

  return matches.map((rule) => ({
    id: rule.id,
    label: rule.label,
    category: rule.category,
    kind: "system",
    description: rule.description,
    files: [normalizedPath],
  }));
}

export function getPrimaryModuleId(
  file: RepoFile
): string {
  return classifyFile(file)[0]?.id || "project";
}
