import OpenAI from "openai";

let client: OpenAI | null = null;

export function getGroqClient() {
  if (client) return client;

  const apiKey = process.env.GROQ_API_KEY;

  if (!apiKey) {
    throw new Error("GROQ_API_KEY is required to call Groq.");
  }

  client = new OpenAI({
    // Groq exposes an OpenAI-compatible API, so the same SDK works.
    baseURL: "https://api.groq.com/openai/v1",
    apiKey,
    // The free tier caps tokens per minute; let the SDK back off and retry
    // on 429/5xx instead of failing the whole request.
    maxRetries: 2,
  });

  return client;
}

export const GROQ_MODEL = process.env.GROQ_MODEL ?? "openai/gpt-oss-120b";

type CompletionBody = Omit<
  OpenAI.Chat.ChatCompletionCreateParamsNonStreaming,
  "model"
>;

/**
 * Runs a completion and returns the message content.
 *
 * Reading choices[0] directly throws "Cannot read properties of undefined"
 * whenever the provider answers without choices, which hides the real cause.
 * This returns null when there is no usable content and throws a descriptive
 * error otherwise, so callers can fall back cleanly.
 */
export async function createCompletion(
  body: CompletionBody,
  options: { timeout?: number } = {}
): Promise<string | null> {
  const completion = await getGroqClient().chat.completions.create(
    {
      model: GROQ_MODEL,
      // gpt-oss models reason before answering, and those hidden reasoning
      // tokens are drawn from the same max_tokens budget as the reply. Left
      // at the default effort they can swallow the whole budget and return
      // empty content, so keep reasoning minimal for these doc-style prompts.
      reasoning_effort: "low",
      ...body,
    },
    { timeout: options.timeout ?? 20000 }
  );

  const choice = completion?.choices?.[0];

  if (!choice) {
    const upstream = (completion as unknown as {
      error?: { message?: string };
    })?.error;

    throw new Error(
      upstream?.message ?? "Groq returned a response with no choices."
    );
  }

  return choice.message?.content?.trim() || null;
}
