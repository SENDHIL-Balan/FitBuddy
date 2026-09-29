import React from "react";
import { Folder, FolderOpen, FileCode, FileText, ChevronRight, ChevronDown, Check } from "lucide-react";

interface FileExplorerProps {
  files: Record<string, string>;
  selectedFile: string;
  onSelectFile: (filePath: string) => void;
}

export default function FileExplorer({
  files,
  selectedFile,
  onSelectFile,
}: FileExplorerProps) {
  const filePaths = Object.keys(files).sort((a, b) => {
    // Put package.json first or App.tsx first
    if (a === "src/App.tsx") return -1;
    if (b === "src/App.tsx") return 1;
    return a.localeCompare(b);
  });

  // Group files into root and src/components
  const rootFiles = filePaths.filter((f) => !f.startsWith("src/"));
  const srcRootFiles = filePaths.filter((f) => f.startsWith("src/") && !f.startsWith("src/components/"));
  const componentFiles = filePaths.filter((f) => f.startsWith("src/components/"));

  const getFileBadge = (name: string) => {
    if (name.endsWith(".tsx")) return <span className="text-[9px] font-mono px-1 py-0.2 rounded bg-sky-500/20 text-sky-400 font-bold">TSX</span>;
    if (name.endsWith(".ts")) return <span className="text-[9px] font-mono px-1 py-0.2 rounded bg-indigo-500/20 text-indigo-400 font-bold">TS</span>;
    if (name.endsWith(".json")) return <span className="text-[9px] font-mono px-1 py-0.2 rounded bg-amber-500/20 text-amber-400 font-bold">JSON</span>;
    return <span className="text-[9px] font-mono px-1 py-0.2 rounded bg-slate-700 text-slate-300 font-bold">FILE</span>;
  };

  return (
    <div className="p-3 text-xs text-slate-300 space-y-4 overflow-y-auto h-full">
      <div className="flex items-center justify-between px-1">
        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
          Generated Project Tree
        </span>
        <span className="text-[10px] font-mono text-slate-500">
          {filePaths.length} files
        </span>
      </div>

      <div className="space-y-1 font-mono text-xs">
        {/* Root Directory */}
        <div className="space-y-1">
          {rootFiles.map((file) => (
            <button
              key={file}
              onClick={() => onSelectFile(file)}
              className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-left transition-colors cursor-pointer ${
                selectedFile === file
                  ? "bg-sky-500/20 text-sky-300 font-semibold border border-sky-500/30"
                  : "hover:bg-slate-900 text-slate-300"
              }`}
            >
              <div className="flex items-center gap-2 truncate">
                <FileText className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
                <span className="truncate">{file}</span>
              </div>
              {getFileBadge(file)}
            </button>
          ))}
        </div>

        {/* src folder */}
        <div className="pt-2">
          <div className="flex items-center gap-1.5 px-2 py-1 text-slate-400 font-bold text-[11px]">
            <FolderOpen className="w-3.5 h-3.5 text-sky-400" />
            <span>src/</span>
          </div>

          <div className="pl-4 space-y-1 mt-1 border-l border-slate-800">
            {/* src files */}
            {srcRootFiles.map((file) => {
              const baseName = file.replace("src/", "");
              return (
                <button
                  key={file}
                  onClick={() => onSelectFile(file)}
                  className={`w-full flex items-center justify-between px-2 py-1.5 rounded-lg text-left transition-colors cursor-pointer ${
                    selectedFile === file
                      ? "bg-sky-500/20 text-sky-300 font-semibold border border-sky-500/30"
                      : "hover:bg-slate-900 text-slate-300"
                  }`}
                >
                  <div className="flex items-center gap-2 truncate">
                    <FileCode className="w-3.5 h-3.5 text-sky-400 flex-shrink-0" />
                    <span className="truncate">{baseName}</span>
                  </div>
                  {getFileBadge(baseName)}
                </button>
              );
            })}

            {/* src/components folder */}
            {componentFiles.length > 0 && (
              <div className="pt-2">
                <div className="flex items-center gap-1.5 px-2 py-1 text-slate-400 font-semibold text-[11px]">
                  <FolderOpen className="w-3.5 h-3.5 text-indigo-400" />
                  <span>components/</span>
                </div>

                <div className="pl-3 space-y-1 mt-1 border-l border-slate-800">
                  {componentFiles.map((file) => {
                    const baseName = file.replace("src/components/", "");
                    return (
                      <button
                        key={file}
                        onClick={() => onSelectFile(file)}
                        className={`w-full flex items-center justify-between px-2 py-1.5 rounded-lg text-left transition-colors cursor-pointer ${
                          selectedFile === file
                            ? "bg-sky-500/20 text-sky-300 font-semibold border border-sky-500/30"
                            : "hover:bg-slate-900 text-slate-300"
                        }`}
                      >
                        <div className="flex items-center gap-2 truncate">
                          <FileCode className="w-3.5 h-3.5 text-indigo-300 flex-shrink-0" />
                          <span className="truncate">{baseName}</span>
                        </div>
                        {getFileBadge(baseName)}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
