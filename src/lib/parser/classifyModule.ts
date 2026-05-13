import { moduleKeywords } from "./moduleKeywords";

export function classifyModule(
  text: string
) {
  const lower =
    text.toLowerCase();

  for (const [module, keywords] of Object.entries(
    moduleKeywords
  )) {
    if (
      keywords.some((keyword) =>
        lower.includes(keyword)
      )
    ) {
      return module;
    }
  }

  return null;
}