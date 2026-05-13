"use client";

import type { LucideIcon } from "lucide-react";
import MarkdownRenderer from "@/components/MarkdownRenderer";
import WorkspaceSection from "./WorkspaceSection";

const proseStyles = `
  prose
    prose-invert
    max-w-none
    prose-h1:text-2xl
    prose-h1:font-semibold
    prose-h1:mb-4
    prose-h1:mt-4
    prose-h2:text-xl
    prose-h2:font-semibold
    prose-h2:mb-2
    prose-h2:mt-5
    prose-h3:text-lg
    prose-h3:font-semibold
    prose-h3:mb-2
    prose-h3:mt-4
    prose-p:text-zinc-300
    prose-p:leading-7
    prose-p:my-1
    prose-ul:my-2
    prose-li:my-1
    prose-li:text-zinc-300
    prose-strong:text-white
    prose-strong:font-semibold
    prose-code:text-cyan-300
    text-[15px]
`;

interface MarkdownInsightSectionProps {
  id: string;
  title: string;
  description: string;
  content: string;
  icon: LucideIcon;
}

export default function MarkdownInsightSection({
  id,
  title,
  description,
  content,
  icon,
}: MarkdownInsightSectionProps) {
  return (
    <WorkspaceSection
      id={id}
      title={title}
      description={description}
      icon={icon}
    >
      <div className={proseStyles}>
        <MarkdownRenderer content={content} />
      </div>
    </WorkspaceSection>
  );
}
