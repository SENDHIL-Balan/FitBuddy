import React, { useEffect, useState } from "react";
import Prism from "prismjs";
import "prismjs/components/prism-javascript";
import "prismjs/components/prism-typescript";
import "prismjs/components/prism-jsx";
import "prismjs/components/prism-tsx";
import "prismjs/components/prism-json";
import { Check, Copy, FileCode } from "lucide-react";

interface CodeViewerProps {
  fileName: string;
  code: string;
  language?: string;
}

export default function CodeViewer({ fileName, code, language }: CodeViewerProps) {
  const [copied, setCopied] = useState(false);

  const lang =
    language ||
    (fileName.endsWith(".tsx") || fileName.endsWith(".jsx")
      ? "tsx"
      : fileName.endsWith(".ts") || fileName.endsWith(".js")
      ? "typescript"
      : fileName.endsWith(".json")
      ? "json"
      : "javascript");

  useEffect(() => {
    Prism.highlightAll();
  }, [code, lang]);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const lineCount = code.split("\n").length;

  return (
    <div className="flex flex-col h-full bg-slate-950 text-slate-200 rounded-xl overflow-hidden border border-slate-800 shadow-2xl">
      {/* File Header Bar */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-slate-900 border-b border-slate-800 text-xs">
        <div className="flex items-center gap-2">
          <FileCode className="w-4 h-4 text-sky-400" />
          <span className="font-mono font-medium text-slate-200">{fileName}</span>
          <span className="text-slate-500 font-mono">({lineCount} lines)</span>
        </div>

        <button
          onClick={handleCopy}
          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
          title="Copy file content"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
          <span>{copied ? "Copied" : "Copy"}</span>
        </button>
      </div>

      {/* Code Container */}
      <div className="flex-1 overflow-auto p-4 font-mono text-xs leading-relaxed">
        <pre className="!bg-transparent !m-0 !p-0">
          <code className={`language-${lang}`}>{code}</code>
        </pre>
      </div>
    </div>
  );
}
