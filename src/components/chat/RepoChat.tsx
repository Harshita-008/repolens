"use client";

import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { Bot, Loader2, MessageSquare, SendHorizontal, User } from "lucide-react";
import ChatMarkdown from "./ChatMarkdown";
import SourceChips, { ChatSource } from "./SourceChips";
import SourceSnippetPanel from "./SourceSnippetPanel";
import SuggestedQuestions from "./SuggestedQuestions";

interface Props {
  repoName: string;
  onOpenFile?: (path: string) => void;
}

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
  sources?: ChatSource[];
}

export default function RepoChat({
  repoName,
  onOpenFile,
}: Props) {
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const messagesRef = useRef<HTMLDivElement | null>(null);

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

  async function askQuestion(selectedQuestion = question) {
    if (!selectedQuestion.trim() || loading) return;

    const userMessage: ChatMessage = {
      role: "user",
      content: selectedQuestion,
    };

    setMessages((prev) => [...prev, userMessage]);

    const currentQuestion = selectedQuestion;

    setQuestion("");

    try {
      setLoading(true);

      const response = await axios.post("/api/chat", {
        repoName,
        question: currentQuestion,
        history: messages,
      });

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: response.data.answer,
          sources: response.data.sources,
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
    <div className="overflow-hidden rounded-xl border border-zinc-800 bg-zinc-950/70">
      <div className="flex flex-wrap items-start justify-between gap-4 border-b border-zinc-800 px-5 py-4">
        <div className="flex items-start gap-3">
          <div className="grid h-9 w-9 place-items-center rounded-lg border border-zinc-800 bg-black text-cyan-300">
            <MessageSquare size={17} />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-white">
              Chat with Repository
            </h2>
            <p className="mt-1 text-sm text-zinc-400">
              Ask grounded questions against the analyzed repository context.
            </p>
          </div>
        </div>

        <span className="rounded-md border border-zinc-800 px-3 py-1 text-xs text-zinc-400">
          {repoName}
        </span>
      </div>

      <div className="border-b border-zinc-800 px-5 py-4">
        <SuggestedQuestions
          onSelect={(selectedQuestion) =>
            askQuestion(selectedQuestion)
          }
        />
      </div>

      <div
        ref={messagesRef}
        className="h-[520px] space-y-4 overflow-y-auto bg-black/20 px-5 py-5 custom-scrollbar"
      >
        {messages.length === 0 && !loading && (
          <div className="grid h-full place-items-center rounded-lg border border-dashed border-zinc-800 bg-black/20 p-8 text-center">
            <div>
              <Bot className="mx-auto mb-3 text-zinc-600" />
              <h3 className="font-medium text-zinc-200">
                Ready for repo questions
              </h3>
              <p className="mt-2 max-w-md text-sm leading-6 text-zinc-500">
                Use a suggested prompt or ask about files, architecture,
                data flow, testing focus, or risky areas.
              </p>
            </div>
          </div>
        )}

        {messages.map((message, index) => (
          <ChatBubble
            key={`${message.role}-${index}`}
            message={message}
            onOpenFile={onOpenFile}
          />
        ))}

        {loading && (
          <div className="flex justify-start">
            <div className="inline-flex items-center gap-2 rounded-lg border border-zinc-800 bg-zinc-900 px-4 py-3 text-sm text-zinc-300">
              <Loader2 size={15} className="animate-spin text-cyan-300" />
              RepoLENS is thinking...
            </div>
          </div>
        )}
      </div>

      <div className="flex gap-3 border-t border-zinc-800 bg-zinc-950/90 p-4">
        <input
          value={question}
          onChange={(event) => setQuestion(event.target.value)}
          placeholder="Ask about the repository..."
          className="min-h-11 flex-1 rounded-lg border border-zinc-800 bg-black px-4 text-sm text-zinc-100 outline-none transition placeholder:text-zinc-600 focus:border-cyan-400"
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              askQuestion();
            }
          }}
        />

        <button
          onClick={() => askQuestion()}
          disabled={loading || !question.trim()}
          className="inline-flex min-h-11 items-center gap-2 rounded-lg bg-white px-4 text-sm font-semibold text-black transition hover:bg-zinc-200 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? (
            <>
              <Loader2 size={15} className="animate-spin" />
              Thinking
            </>
          ) : (
            <>
              Send
              <SendHorizontal size={15} />
            </>
          )}
        </button>
      </div>
    </div>
  );
}

function ChatBubble({
  message,
  onOpenFile,
}: {
  message: ChatMessage;
  onOpenFile?: (path: string) => void;
}) {
  const isUser = message.role === "user";

  return (
    <div className={`flex w-full ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`flex max-w-[82%] gap-3 ${
          isUser ? "flex-row-reverse" : "flex-row"
        }`}
      >
        <div
          className={`grid h-8 w-8 shrink-0 place-items-center rounded-lg border ${
            isUser
              ? "border-cyan-500/30 bg-cyan-500/10 text-cyan-200"
              : "border-zinc-800 bg-black text-cyan-300"
          }`}
        >
          {isUser ? <User size={15} /> : <Bot size={15} />}
        </div>

        <div
          className={`rounded-xl border px-4 py-3 shadow-xl shadow-black/10 ${
            isUser
              ? "border-cyan-500/30 bg-cyan-500/10 text-cyan-50"
              : "border-zinc-800 bg-zinc-950 text-zinc-100"
          }`}
        >
          <div
            className={`mb-2 text-xs ${
              isUser ? "text-cyan-200/80" : "text-zinc-500"
            }`}
          >
            {isUser ? "You" : "RepoLENS"}
          </div>

          {isUser ? (
            <p className="whitespace-pre-wrap text-sm leading-6">
              {message.content}
            </p>
          ) : (
            <>
              <ChatMarkdown content={message.content} />
              <SourceChips
                sources={message.sources}
                onOpenFile={onOpenFile}
              />
              <SourceSnippetPanel
                sources={message.sources}
                onOpenFile={onOpenFile}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
}
