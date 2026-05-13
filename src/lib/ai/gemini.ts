import {
  GenerativeModel,
  GoogleGenerativeAI,
} from "@google/generative-ai";

let model: GenerativeModel | null = null;

export function getGeminiModel() {
  if (model) return model;

  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is required to call Gemini.");
  }

  const genAI = new GoogleGenerativeAI(apiKey);

  model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
  });

  return model;
}
