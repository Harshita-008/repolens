"use client";

import { useState } from "react";

import SyntaxHighlighter from "react-syntax-highlighter";

import { atomDark } from "react-syntax-highlighter/dist/cjs/styles/prism";

interface FilePreviewProps {
  files: {
    path: string;
    content: string;
  }[];
}

export default function FilePreview({
  files,
}: FilePreviewProps) {
  const [selectedFile, setSelectedFile] =
    useState(files[0]?.path || "");

  return (
    <div className="bg-zinc-900/80 backdrop-blur-xl rounded-2xl p-6 border border-zinc-800 hover:border-zinc-700 transition-all duration-300">
      <h2 className="text-2xl font-semibold mb-6">
        Explore Important Files
      </h2>

      <div className="grid grid-cols-3 gap-6">
        <div className="space-y-3">
          {files.map((file) => (
            <button
              key={file.path}
              onClick={() =>
                setSelectedFile(file.path)
              }
              className={`w-full text-left px-4 py-3 rounded-xl transition-all truncate ${
                selectedFile === file.path
                  ? "bg-white text-black"
                  : "bg-zinc-800 text-zinc-300 hover:bg-zinc-700"
              }`}
            >
              {file.path.split("/").slice(-2).join("/")}
            </button>
          ))}
        </div>

        <div className="col-span-2 overflow-hidden rounded-xl border border-zinc-800">
          <SyntaxHighlighter
            language="tsx"
            style={atomDark}
            customStyle={{
              margin: 0,
              height: "100%",
              minHeight: "350px",
              background: "#09090b",
            }}
          >
            {files.find(
              (file) =>
                file.path === selectedFile
            )?.content || "No file selected"}
          </SyntaxHighlighter>
        </div>
      </div>
    </div>
  );
}