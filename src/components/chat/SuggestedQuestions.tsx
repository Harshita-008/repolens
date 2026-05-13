"use client";

const QUESTIONS = [
  "What does this repository do?",
  "Explain the data flow.",
  "Where should I start reading?",
  "Where is authentication handled?",
  "Which files should I edit for a new feature?",
  "What are the risky or complex files?",
];

interface Props {
  onSelect: (question: string) => void;
}

export default function SuggestedQuestions({
  onSelect,
}: Props) {
  return (
    <div className="flex flex-wrap gap-2">
      {QUESTIONS.map((question) => (
        <button
          key={question}
          onClick={() => onSelect(question)}
          className="rounded-md border border-zinc-800 bg-black/30 px-3 py-1.5 text-xs text-zinc-300 transition hover:border-cyan-500/50 hover:bg-cyan-500/10 hover:text-cyan-100"
        >
          {question}
        </button>
      ))}
    </div>
  );
}
