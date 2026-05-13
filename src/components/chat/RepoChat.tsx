"use client";

import { useState } from "react";
import axios from "axios";

export default function RepoChat() {
  const [question, setQuestion] =
    useState("");

  const [messages, setMessages] = useState<
    {
      role: string;
      content: string;
    }[]
  >([]);

  const [loading, setLoading] =
    useState(false);

  async function askQuestion() {
    if (!question.trim()) return;

    const userMessage = {
      role: "user",
      content: question,
    };

    setMessages((prev) => [
      ...prev,
      userMessage,
    ]);

    const currentQuestion = question;

    setQuestion("");

    try {
      setLoading(true);

      const response = await axios.post(
        "/api/chat",
        {
          repoName: "ai-chatbot",
          question: currentQuestion,
          tree: localStorage.getItem("repoTree"),
          summary:
            localStorage.getItem("repoSummary"),
          roadmap:
            localStorage.getItem("repoRoadmap"),
        }
      );

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            response.data.answer,
        },
      ]);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="bg-zinc-900/70 backdrop-blur-xl border border-zinc-800 rounded-3xl p-6 shadow-2xl">
      <h2 className="text-2xl font-semibold mb-4">
        Chat with Repository
      </h2>

      <div className="h-[500px] overflow-y-auto space-y-3 mb-6 pr-2 custom-scrollbar">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex w-full ${
              message.role === "user"
                ? "justify-end"
                : "justify-start pl-2"
            }`}
          >
            <div
              className={`max-w-[70%] min-w-[120px] rounded-3xl px-5 py-3 transition-all duration-300 hover:scale-[1.01] animate-in fade-in duration-300 border ${
                message.role === "user"
                  ? "bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white border-transparent shadow-lg shadow-fuchsia-500/30 ml-auto shadow-violet-500/20"
                  : "bg-zinc-900/90 backdrop-blur-xl border border-zinc-700 text-zinc-100 shadow-xl"
              }`}
            >
              <div className="text-xs mb-2 opacity-60">
                {message.role === "user"
                  ? "You"
                  : "RepoLENS AI"}
              </div>

              <pre className="prose prose-invert max-w-none whitespace-pre-wrap prose-headings:mt-8 prose-p:mb-4 prose-li:mb-2 font-sans text-[15px] leading-7 tracking-wide">
                {message.content}
              </pre>
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex justify-start">
            <div className="bg-zinc-800 border border-zinc-700 rounded-3xl px-5 py-3 transition-all duration-300 hover:scale-[1.01] text-zinc-300 animate-pulse">
              RepoLENS is thinking...
            </div>
          </div>
        )}
      </div>

      <div className="flex gap-3">
        <input
          value={question}
          onChange={(e) =>
            setQuestion(e.target.value)
          }
          placeholder="Ask about the repository..."
          className="flex-1 bg-black border border-zinc-700 rounded-xl px-4 py-3"
        />

        <button
          onClick={askQuestion}
          className="bg-white text-black px-5 rounded-xl font-medium"
        >
          {loading ? "Thinking..." : "Send"}
        </button>
      </div>
    </div>
  );
}