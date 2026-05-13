import { RepoFile } from "../git/fileScanner";

export interface ArchitectureNode {
  id: string;
  label: string;
  category: string;
}

export function detectArchitecture(
  files: RepoFile[]
) {
  const paths = files.map((f) =>
    f.path.toLowerCase()
  );

  const content = files
    .map((f) => f.content.toLowerCase())
    .join("\n");

  const nodes: ArchitectureNode[] = [];

  function addNode(
    id: string,
    label: string,
    category: string
  ) {
    if (
      nodes.some((node) => node.id === id)
    ) {
      return;
    }

    nodes.push({
      id,
      label,
      category,
    });
  }

  // =========================
  // FRAMEWORKS
  // =========================

  if (
    paths.some((p) =>
      p.includes("next.config")
    )
  ) {
    addNode(
      "nextjs",
      "Next.js App",
      "frontend"
    );
  }

  if (content.includes("react")) {
    addNode(
      "react",
      "React UI",
      "frontend"
    );
  }

  // =========================
  // API LAYER
  // =========================

  if (
    paths.some(
      (p) =>
        p.includes("/api/") ||
        p.includes("route.ts")
    )
  ) {
    addNode(
      "api",
      "API Layer",
      "backend"
    );
  }

  // =========================
  // AUTH
  // =========================

  if (
    content.includes("auth") ||
    content.includes("signin") ||
    content.includes("nextauth") ||
    content.includes("clerk")
  ) {
    addNode(
      "auth",
      "Authentication",
      "security"
    );
  }

  // =========================
  // DATABASE
  // =========================

  if (
    content.includes("postgres") ||
    content.includes("prisma") ||
    content.includes("drizzle") ||
    content.includes("mongodb") ||
    content.includes("supabase")
  ) {
    addNode(
      "database",
      "Database",
      "data"
    );
  }

  // =========================
  // APPWRITE
  // =========================

  if (
    content.includes("appwrite")
  ) {
    addNode(
      "appwrite",
      "Appwrite Backend",
      "backend"
    );
  }

  // =========================
  // AI
  // =========================

  if (
    content.includes("openai") ||
    content.includes("anthropic") ||
    content.includes("gemini") ||
    content.includes("llama")
  ) {
    addNode(
      "ai",
      "AI Provider",
      "ai"
    );
  }

  // =========================
  // VECTOR DATABASE
  // =========================

  if (
    content.includes("embedding") ||
    content.includes("vector") ||
    content.includes("pinecone") ||
    content.includes("chroma")
  ) {
    addNode(
      "vector",
      "Vector Database",
      "ai"
    );
  }

  // =========================
  // CHAT
  // =========================

  if (
    content.includes("chatbot") ||
    content.includes("conversation") ||
    content.includes("assistant")
  ) {
    addNode(
      "chat",
      "Chat System",
      "feature"
    );
  }

  // =========================
  // STORAGE
  // =========================

  if (
    content.includes("upload") ||
    content.includes("storage") ||
    content.includes("bucket")
  ) {
    addNode(
      "storage",
      "File Storage",
      "data"
    );
  }

  // =========================
  // PAYMENTS
  // =========================

  if (
    content.includes("stripe") ||
    content.includes("payment")
  ) {
    addNode(
      "payments",
      "Payments",
      "service"
    );
  }

  // =========================
  // REALTIME
  // =========================

  if (
    content.includes("socket") ||
    content.includes("stream") ||
    content.includes("realtime")
  ) {
    addNode(
      "realtime",
      "Realtime Engine",
      "backend"
    );
  }

  // =========================
  // STATE MANAGEMENT
  // =========================

  if (
    content.includes("recoil") ||
    content.includes("zustand") ||
    content.includes("redux")
  ) {
    addNode(
      "state",
      "State Management",
      "frontend"
    );
  }

  return nodes;
}