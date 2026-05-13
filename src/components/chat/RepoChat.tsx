"use client";

import { useEffect, useRef, useState } from "react";
import axios from "axios";
import ReactMarkdown from "react-markdown";

interface Props {
  repoName: string;
}

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export default function RepoChat({
  repoName,
}: Props) {
  const [question, setQuestion] =
    useState("");

  const [messages, setMessages] = useState<ChatMessage[]>([]);

  const [loading, setLoading] =
    useState(false);
  const messagesRef =
    useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const messagesEl = messagesRef.current;

    if (!messagesEl) return;

    requestAnimationFrame(() => {
      messagesEl.scrollTo({
        top: messagesEl.scrollHeight,
        behavior: "smooth",
      });
    });
  }, [messages, loading]);

  async function askQuestion() {
    if (!question.trim() || loading) return;

    const userMessage: ChatMessage = {
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
          repoName,
          question: currentQuestion,
          history: messages,
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

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "I could not access the analyzed repository context. Please analyze the repo again, then ask your question.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="bg-zinc-900/70 backdrop-blur-xl border border-zinc-800 rounded-3xl p-6 shadow-2xl">
      <h2 className="text-2xl font-semibold mb-4">
        Chat with Repository
      </h2>

      <div
        ref={messagesRef}
        className="h-[500px] overflow-y-auto space-y-3 mb-6 pr-2 custom-scrollbar"
      >
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

              {message.role === "user" ? (
                <p className="whitespace-pre-wrap text-[15px] leading-7">
                  {message.content}
                </p>
              ) : (
                <ReactMarkdown
                  components={{
                    h1: ({ children }) => (
                      <h3 className="mb-2 mt-3 text-lg font-semibold text-white first:mt-0">
                        {children}
                      </h3>
                    ),
                    h2: ({ children }) => (
                      <h3 className="mb-2 mt-3 text-base font-semibold text-white first:mt-0">
                        {children}
                      </h3>
                    ),
                    h3: ({ children }) => (
                      <h4 className="mb-1.5 mt-3 text-sm font-semibold text-zinc-100 first:mt-0">
                        {children}
                      </h4>
                    ),
                    p: ({ children }) => (
                      <p className="mb-3 text-[15px] leading-7 text-zinc-200 last:mb-0">
                        {children}
                      </p>
                    ),
                    ul: ({ children }) => (
                      <ul className="mb-3 list-disc space-y-1.5 pl-5 last:mb-0">
                        {children}
                      </ul>
                    ),
                    ol: ({ children }) => (
                      <ol className="mb-3 list-decimal space-y-1.5 pl-5 last:mb-0">
                        {children}
                      </ol>
                    ),
                    li: ({ children }) => (
                      <li className="text-[15px] leading-7 text-zinc-200">
                        {children}
                      </li>
                    ),
                    strong: ({ children }) => (
                      <strong className="font-semibold text-white">
                        {children}
                      </strong>
                    ),
                    code: ({ children }) => (
                      <code className="rounded bg-black/40 px-1.5 py-0.5 text-cyan-300">
                        {children}
                      </code>
                    ),
                    table: ({ children }) => (
                      <div className="mb-3 overflow-x-auto rounded-xl border border-zinc-700">
                        <table className="w-full text-left text-sm">
                          {children}
                        </table>
                      </div>
                    ),
                    th: ({ children }) => (
                      <th className="border-b border-zinc-700 bg-zinc-800 px-3 py-2 text-zinc-100">
                        {children}
                      </th>
                    ),
                    td: ({ children }) => (
                      <td className="border-b border-zinc-800 px-3 py-2 text-zinc-300">
                        {children}
                      </td>
                    ),
                  }}
                >
                  {message.content}
                </ReactMarkdown>
              )}
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
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              askQuestion();
            }
          }}
        />

        <button
          onClick={askQuestion}
          disabled={loading}
          className="bg-white text-black px-5 rounded-xl font-medium"
        >
          {loading ? "Thinking..." : "Send"}
        </button>
      </div>
    </div>
  );
}
