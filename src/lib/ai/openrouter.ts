import OpenAI from "openai";

let client: OpenAI | null = null;

export function getOpenRouterClient() {
  if (client) return client;

  const apiKey = process.env.OPENROUTER_API_KEY;

  if (!apiKey) {
    throw new Error(
      "OPENROUTER_API_KEY is required to call OpenRouter."
    );
  }

  client = new OpenAI({
    baseURL: "https://openrouter.ai/api/v1",
    apiKey,
  });

  return client;
}

export const OPENROUTER_MODEL =
  process.env.OPENROUTER_MODEL ?? "nvidia/nemotron-3-super-120b-a12b:free";
