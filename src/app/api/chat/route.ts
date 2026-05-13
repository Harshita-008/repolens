import { NextRequest, NextResponse } from "next/server";
import { buildChatPrompt } from "@/lib/chat/buildChatPrompt";
import { generateChatAnswer } from "@/lib/chat/generateChatAnswer";
import { getRepoContext } from "@/lib/chat/repoContextStore";
import { retrieveRepoContext } from "@/lib/chat/retrieveRepoContext";
import { ChatMessage } from "@/lib/chat/types";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const question =
      typeof body.question === "string"
        ? body.question.trim()
        : "";
    const repoName =
      typeof body.repoName === "string"
        ? body.repoName
        : "";
    const history: ChatMessage[] = Array.isArray(
      body.history
    )
      ? body.history.filter(
          (message: ChatMessage) =>
            message.role &&
            typeof message.content === "string"
        )
      : [];

    if (!question) {
      return NextResponse.json(
        { error: "Question required" },
        { status: 400 }
      );
    }

    if (!repoName) {
      return NextResponse.json(
        {
          error:
            "Analyze a repository before chatting.",
        },
        { status: 400 }
      );
    }

    const context = getRepoContext(repoName);

    if (!context) {
      return NextResponse.json(
        {
          error:
            "Repository context expired. Please analyze the repository again.",
        },
        { status: 404 }
      );
    }

    const chunks = retrieveRepoContext(
      context,
      question
    );
    const prompt = buildChatPrompt({
      context,
      chunks,
      question,
      history,
    });
    const answer = await generateChatAnswer(prompt);

    return NextResponse.json({
      answer,
      sources: chunks.map((chunk) => ({
        path: chunk.path,
        startLine: chunk.startLine,
        endLine: chunk.endLine,
      })),
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Failed to chat" },
      { status: 500 }
    );
  }
}
