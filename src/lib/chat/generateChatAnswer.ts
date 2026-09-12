import { getGeminiModel } from "../ai/gemini";
import { getOpenRouterClient, OPENROUTER_MODEL } from "../ai/openrouter";

export async function generateChatAnswer(
  prompt: string
) {
  try {
    const completion =
      await getOpenRouterClient().chat.completions.create({
        model: OPENROUTER_MODEL,
        temperature: 0.2,
        max_tokens: 800,
        messages: [
          {
            role: "system",
            content:
              "You are a precise repository assistant. Ground every answer in the provided code context.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
      }, {
        timeout: 25000,
      });

    return (
      completion.choices[0].message.content ||
      "I could not generate an answer."
    );
  } catch (openRouterError) {
    console.error(openRouterError);

    const result =
      await getGeminiModel().generateContent(prompt);

    return result.response.text();
  }
}
