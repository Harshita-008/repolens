"use client";

import { useState } from "react";
import axios from "axios";
import ArchitectureGraph from "@/components/repo/ArchitectureGraph";
import RepoChat from "@/components/chat/RepoChat";
import FilePreview from "@/components/repo/FilePreview";
import { TypeAnimation } from "react-type-animation";
import Sidebar from "@/components/layout/Sidebar";
import DependencyHeatmap from "@/components/DependencyHeatmap";
import MarkdownRenderer from "@/components/MarkdownRenderer";
import type {
  GraphEdge,
  GraphNode,
} from "@/lib/parser/graph/types";

import {
  FolderGit2,
  Brain,
  GitBranch,
  MessageSquare,
} from "lucide-react";

interface AnalysisData {
  repoName: string;
  totalFiles: number;
  tree: string;
  graph: {
    nodes: GraphNode[];
    edges: GraphEdge[];
  };
  summary: string;
  readFirst: string;
  roadmap: string;
  heatmap: {
    path: string;
    score: number;
  }[];
  importantFiles: {
    path: string;
    content: string;
  }[];
}

const proseStyles = `
  prose
    prose-invert
    max-w-none

    prose-h1:text-3xl
    prose-h1:font-bold
    prose-h1:mb-6
    prose-h1:mt-8

    prose-h2:text-2xl
    prose-h2:font-semibold
    prose-h2:mb-3
    prose-h2:mt-6

    prose-h3:text-xl
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

export default function HomePage() {
  const [repoUrl, setRepoUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [data, setData] =
    useState<AnalysisData | null>(null);
  const [selectedFilePath, setSelectedFilePath] =
    useState<string>("");

  function openFile(path: string) {
    setSelectedFilePath(path);

    requestAnimationFrame(() => {
      document
        .getElementById("files")
        ?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
    });
  }

  async function analyzeRepo() {
    try {
      setLoading(true);

      const response = await axios.post(
        "/api/ingest",
        {
          repoUrl,
        }
      );

      setData(response.data);
      setSelectedFilePath(
        response.data.importantFiles?.[0]?.path || ""
      );

      localStorage.setItem(
        "repoName",
        response.data.repoName
      );

      localStorage.setItem(
        "repoTree",
        response.data.tree
      );

      localStorage.setItem(
        "repoSummary",
        response.data.summary
      );

      localStorage.setItem(
        "repoRoadmap",
        response.data.roadmap
      );
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-black text-white p-10 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-purple-500/20 rounded-full blur-[120px]" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-blue-500/20 rounded-full blur-[120px]" />

      <Sidebar />

      <div className="max-w-6xl ml-[320px] relative z-10">
        <div className="mb-14">
        <div className="inline-flex items-center gap-2 bg-zinc-900 border border-zinc-800 px-4 py-2 rounded-full mb-6">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />

          <span className="text-sm text-zinc-300">
            AI-Powered Repository Intelligence
          </span>
        </div>

        <h1 className="text-7xl font-bold tracking-tight mb-6 bg-gradient-to-r from-white to-zinc-500 text-transparent bg-clip-text">
          RepoLENS
        </h1>

        <TypeAnimation
          sequence={[
            "Understand any codebase in minutes.",
            2000,
            "Generate architecture maps instantly.",
            2000,
            "Chat with repositories using AI.",
            2000,
            "Onboard into large codebases effortlessly.",
            2000,
          ]}
          wrapper="p"
          speed={50}
          repeat={Infinity}
          className="text-zinc-400 text-xl max-w-2xl leading-relaxed min-h-[80px]"
        />
      </div>

        <div className="flex gap-4 mb-10">
          <input
            value={repoUrl}
            onChange={(e) =>
              setRepoUrl(e.target.value)
            }
            placeholder="Paste GitHub repository URL..."
            className="flex-1 bg-zinc-900 border border-zinc-800 rounded-xl px-5 py-4"
          />

          <button
            onClick={analyzeRepo}
            disabled={loading}
            className="bg-white text-black px-6 py-4 rounded-xl font-medium"
          >
            {loading ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />

                <span>Analyzing</span>
              </div>
            ) : (
              "Analyze Repo"
            )}
          </button>
        </div>

        <div className="grid grid-cols-4 gap-4 mb-10">
          <div className="bg-zinc-900/80 backdrop-blur-xl rounded-2xl p-5 border border-zinc-800 hover:border-zinc-700 transition-all duration-300 hover:-translate-y-1">
            <FolderGit2 className="mb-3" />

            <h3 className="text-3xl font-bold">
              {data?.totalFiles || "--"}
            </h3>

            <p className="text-zinc-400 text-sm">
              Files Analyzed
            </p>
          </div>

          <div className="bg-zinc-900/80 backdrop-blur-xl rounded-2xl p-5 border border-zinc-800 hover:border-zinc-700 transition-all duration-300 hover:-translate-y-1">
            <Brain className="mb-3" />

            <h3 className="text-3xl font-bold">
              AI
            </h3>

            <p className="text-zinc-400 text-sm">
              Architecture Analysis
            </p>
          </div>

          <div className="bg-zinc-900/80 backdrop-blur-xl rounded-2xl p-5 border border-zinc-800 hover:border-zinc-700 transition-all duration-300 hover:-translate-y-1">
            <GitBranch className="mb-3" />

            <h3 className="text-3xl font-bold">
              Graph
            </h3>

            <p className="text-zinc-400 text-sm">
              Dependency Mapping
            </p>
          </div>

          <div className="bg-zinc-900/80 backdrop-blur-xl rounded-2xl p-5 border border-zinc-800 hover:border-zinc-700 transition-all duration-300 hover:-translate-y-1">
            <MessageSquare className="mb-3" />

            <h3 className="text-3xl font-bold">
              Chat
            </h3>

            <p className="text-zinc-400 text-sm">
              Repository Assistant
            </p>
          </div>
        </div>

        {data && (
          <div className="space-y-8">
            <section
              id="summary"
              className="bg-zinc-900 rounded-2xl p-8 scroll-mt-24"
            >
              <h2 className="text-2xl font-semibold mb-4">
                Repository Summary
              </h2>

              <div className={proseStyles}>
                <MarkdownRenderer content={data.summary} />
              </div>
            </section>

            <section id="read-first" className="bg-zinc-900 rounded-2xl p-8 scroll-mt-24">
              <h2 className="text-2xl font-semibold mb-4">
                Read These Files First
              </h2>

              <div className={proseStyles}>
                <MarkdownRenderer content={data.readFirst} />
              </div>
            </section>

            <section id="roadmap" className="bg-zinc-900 rounded-2xl p-8 scroll-mt-24">
              <h2 className="text-2xl font-semibold mb-4">
                Learning Roadmap
              </h2>

              <div className={proseStyles}>
                <MarkdownRenderer content={data.roadmap} />
              </div>
            </section>

            <section
              id="architecture"
              className="bg-zinc-900 rounded-2xl p-6 scroll-mt-24"
            >
              <h2 className="text-2xl font-semibold mb-4">
                Architecture Graph
              </h2>

              <ArchitectureGraph
                graph={data.graph}
                onOpenFile={openFile}
              />
            </section>

            <section id="heatmap">
              <DependencyHeatmap
                data={data.heatmap}
              />
            </section>

            <section id="chat">
              <RepoChat
                repoName={data.repoName}
                onOpenFile={openFile}
              />
            </section>

            <section id="files">
              <FilePreview
                files={data.importantFiles}
                selectedPath={selectedFilePath}
                onSelectFile={setSelectedFilePath}
              />
            </section>

            <section id="structure" className="bg-zinc-900 rounded-2xl p-6 scroll-mt-24">
              <h2 className="text-2xl font-semibold mb-4">
                Repository Structure
              </h2>

              <pre className="overflow-auto max-h-[500px] text-sm text-zinc-300 bg-black/40 p-4 rounded-xl border border-zinc-800">
                {data.tree}
              </pre>
            </section>
          </div>
        )}
      </div>
    </main>
  );
}
