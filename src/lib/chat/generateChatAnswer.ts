import { getGeminiModel } from "../ai/gemini";
import { createCompletion } from "../ai/groq";

export async function generateChatAnswer(
  prompt: string
) {
  try {
    const content = await createCompletion({
      temperature: 0.2,
      max_tokens: 2000,
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

    return content || "I could not generate an answer.";
  } catch (groqError) {
    console.error(groqError);

    const result =
      await getGeminiModel().generateContent(prompt);

    return result.response.text();
  }
}
