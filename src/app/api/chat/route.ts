import { NextRequest, NextResponse } from "next/server";
import { openrouter } from "@/lib/ai/openrouter";

export async function POST(
  req: NextRequest
) {
  try {
    const body = await req.json();

    const {
      question,
      tree,
      summary,
      roadmap,
    } = body;

    const prompt = `
You are RepoLENS AI.

You are helping a developer understand a GitHub repository.

REPOSITORY SUMMARY:
${summary}

REPOSITORY STRUCTURE:
${tree.slice(0, 2500)}

LEARNING ROADMAP:
${roadmap?.slice(0, 1200)}

QUESTION:
${question}

Answer clearly and technically.
Keep answers concise but helpful.
`;

    try {
      const completion =
        await openrouter.chat.completions.create({
          model:
            "anthropic/claude-3-haiku",

          messages: [
            {
              role: "system",
              content: `
                You are RepoLENS AI.

                You help developers understand repositories.

                Answer clearly using the provided
                repository context.

                Be specific and technical.
              `,
            },

            {
              role: "user",
              content: prompt,
            },
          ],
        });

      const text =
        completion.choices[0].message.content;

      return NextResponse.json({
        answer: text,
      });
    } catch (error) {
      console.error(error);

      return NextResponse.json({
        answer:
          "AI quota temporarily exceeded. RepoLENS fallback mode: This repository appears to use a modular architecture with separated UI, API routes, and AI provider layers.",
      });
    }
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        error: "Failed to chat",
      },
      { status: 500 }
    );
  }
}