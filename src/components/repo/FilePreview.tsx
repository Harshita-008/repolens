"use client";

import { useMemo, useState } from "react";
import SyntaxHighlighter from "react-syntax-highlighter";
import { atomDark } from "react-syntax-highlighter/dist/cjs/styles/prism";
import { Search } from "lucide-react";
import { detectLanguage } from "../../lib/files/detectLanguage";

interface RepoFile {
  path: string;
  content: string;
}

interface FilePreviewProps {
  files: RepoFile[];
  selectedPath?: string;
  onSelectFile?: (path: string) => void;
}

export default function FilePreview({
  files,
  selectedPath,
  onSelectFile,
}: FilePreviewProps) {
  const [internalSelectedPath, setInternalSelectedPath] =
    useState(files[0]?.path || "");
  const [search, setSearch] = useState("");

  const selectedFilePath =
    selectedPath || internalSelectedPath;

  const filteredFiles = useMemo(
    () =>
      files.filter((file) =>
        file.path
          .toLowerCase()
          .includes(search.toLowerCase())
      ),
    [files, search]
  );

  const selectedFile =
    files.find(
      (file) => file.path === selectedFilePath
    ) || files[0];

  function selectFile(path: string) {
    setInternalSelectedPath(path);
    onSelectFile?.(path);
  }

  return (
    <div className="bg-zinc-900/80 backdrop-blur-xl rounded-2xl p-6 border border-zinc-800 hover:border-zinc-700 transition-all duration-300">
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <h2 className="text-2xl font-semibold">
            Explore Important Files
          </h2>
          <p className="mt-1 text-sm text-zinc-400">
            Browse key files with syntax highlighting and line numbers.
          </p>
        </div>

        {selectedFile && (
          <span className="rounded-full border border-zinc-700 px-3 py-1 text-xs text-zinc-300">
            {detectLanguage(selectedFile.path)}
          </span>
        )}
      </div>

      <div className="grid grid-cols-3 gap-6">
        <div className="space-y-3">
          <div className="flex items-center gap-2 rounded-xl border border-zinc-800 bg-black px-3 py-2">
            <Search size={15} className="text-zinc-500" />
            <input
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
              placeholder="Search files..."
              className="w-full bg-transparent text-sm text-zinc-200 outline-none placeholder:text-zinc-600"
            />
          </div>

          <div className="max-h-[420px] space-y-2 overflow-y-auto pr-1 custom-scrollbar">
            {filteredFiles.map((file) => (
              <button
                key={file.path}
                onClick={() => selectFile(file.path)}
                className={`w-full rounded-xl px-4 py-3 text-left transition-all ${
                  selectedFile?.path === file.path
                    ? "bg-white text-black"
                    : "bg-zinc-800 text-zinc-300 hover:bg-zinc-700"
                }`}
              >
                <span className="block truncate text-sm font-medium">
                  {file.path
                    .split("/")
                    .slice(-2)
                    .join("/")}
                </span>
                <span className="mt-1 block truncate text-xs opacity-60">
                  {file.path}
                </span>
              </button>
            ))}
          </div>
        </div>

        <div className="col-span-2 overflow-hidden rounded-xl border border-zinc-800 bg-black">
          <div className="flex items-center justify-between border-b border-zinc-800 bg-zinc-950 px-4 py-3">
            <span className="truncate text-sm text-zinc-200">
              {selectedFile?.path || "No file selected"}
            </span>
            {selectedFile && (
              <span className="text-xs text-zinc-500">
                {selectedFile.content.split(/\r?\n/).length} lines
              </span>
            )}
          </div>

          <SyntaxHighlighter
            language={
              selectedFile
                ? detectLanguage(selectedFile.path)
                : "text"
            }
            style={atomDark}
            showLineNumbers
            wrapLongLines
            customStyle={{
              margin: 0,
              height: "460px",
              background: "#09090b",
              fontSize: "13px",
            }}
            lineNumberStyle={{
              color: "#52525b",
              minWidth: "2.5em",
            }}
          >
            {selectedFile?.content ||
              "No file selected"}
          </SyntaxHighlighter>
        </div>
      </div>
    </div>
  );
}
