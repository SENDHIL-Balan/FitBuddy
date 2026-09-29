import React, { useState } from "react";
import { Monitor, Tablet, Smartphone, RotateCw, ExternalLink, Code2, Eye, ShieldCheck, Maximize2 } from "lucide-react";
import CodeViewer from "./CodeViewer.tsx";

interface LivePreviewPanelProps {
  projectId: string;
  files: Record<string, string>;
  selectedFile: string;
  reloadKey: number;
  onReload: () => void;
}

type ViewportMode = "desktop" | "tablet" | "mobile";
type ViewMode = "preview" | "code";

export default function LivePreviewPanel({
  projectId,
  files,
  selectedFile,
  reloadKey,
  onReload,
}: LivePreviewPanelProps) {
  const [viewport, setViewport] = useState<ViewportMode>("desktop");
  const [viewMode, setViewMode] = useState<ViewMode>("preview");

  const previewUrl = `/api/projects/${projectId}/preview?t=${reloadKey}`;

  const viewportConfig: Record<ViewportMode, { width: string; label: string; height?: string }> = {
    desktop: { width: "100%", label: "Desktop (1280px)" },
    tablet: { width: "768px", height: "920px", label: "Tablet (768px)" },
    mobile: { width: "375px", height: "720px", label: "Mobile (375px)" },
  };

  const currentCode = files[selectedFile] || files["src/App.tsx"] || "";

  return (
    <div className="flex flex-col h-full bg-slate-950 overflow-hidden border-x border-slate-800">
      {/* Top Toolbar */}
      <div className="h-12 border-b border-slate-800 bg-slate-900/80 backdrop-blur-xs px-3 sm:px-4 flex items-center justify-between flex-shrink-0 text-xs">
        {/* View Mode Toggle: Preview vs Code */}
        <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800">
          <button
            onClick={() => setViewMode("preview")}
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-md font-medium transition-colors cursor-pointer ${
              viewMode === "preview"
                ? "bg-sky-600 text-white shadow-xs font-semibold"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Live Sandbox</span>
          </button>

          <button
            onClick={() => setViewMode("code")}
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-md font-medium transition-colors cursor-pointer ${
              viewMode === "code"
                ? "bg-sky-600 text-white shadow-xs font-semibold"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <Code2 className="w-3.5 h-3.5" />
            <span>Code Inspector</span>
          </button>
        </div>

        {/* Viewport Switcher (Visible in preview mode) */}
        {viewMode === "preview" && (
          <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800">
            <button
              onClick={() => setViewport("desktop")}
              className={`p-1.5 rounded-md transition-colors cursor-pointer ${
                viewport === "desktop"
                  ? "bg-slate-800 text-sky-400 font-semibold"
                  : "text-slate-400 hover:text-white"
              }`}
              title="Desktop View (1280px)"
            >
              <Monitor className="w-4 h-4" />
            </button>

            <button
              onClick={() => setViewport("tablet")}
              className={`p-1.5 rounded-md transition-colors cursor-pointer ${
                viewport === "tablet"
                  ? "bg-slate-800 text-sky-400 font-semibold"
                  : "text-slate-400 hover:text-white"
              }`}
              title="Tablet View (768px)"
            >
              <Tablet className="w-4 h-4" />
            </button>

            <button
              onClick={() => setViewport("mobile")}
              className={`p-1.5 rounded-md transition-colors cursor-pointer ${
                viewport === "mobile"
                  ? "bg-slate-800 text-sky-400 font-semibold"
                  : "text-slate-400 hover:text-white"
              }`}
              title="Mobile View (375px)"
            >
              <Smartphone className="w-4 h-4" />
            </button>

            <div className="pl-2 pr-1 border-l border-slate-800 text-[11px] font-mono text-slate-400 hidden sm:block">
              {viewportConfig[viewport].label}
            </div>
          </div>
        )}

        {/* Right Tools: Reload & New Tab */}
        <div className="flex items-center gap-2">
          <button
            onClick={onReload}
            className="p-1.5 rounded-md text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            title="Refresh Sandbox"
          >
            <RotateCw className="w-3.5 h-3.5" />
          </button>

          <a
            href={previewUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="p-1.5 rounded-md text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            title="Open Sandbox in New Window"
          >
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      {/* Main View Area */}
      <div className="flex-1 overflow-auto bg-slate-950 p-2 sm:p-4 flex items-start justify-center">
        {viewMode === "preview" ? (
          <div
            className="transition-all duration-300 w-full flex justify-center"
            style={{
              maxWidth: viewportConfig[viewport].width,
            }}
          >
            <div
              className={`w-full overflow-hidden bg-white shadow-2xl transition-all duration-300 ${
                viewport !== "desktop"
                  ? "rounded-3xl border-8 border-slate-800 ring-1 ring-slate-700/50 my-2"
                  : "rounded-xl border border-slate-800"
              }`}
              style={{
                height: viewportConfig[viewport].height || "calc(100vh - 10rem)",
              }}
            >
              <iframe
                key={reloadKey}
                src={previewUrl}
                title="WebClone Generated Preview"
                className="w-full h-full border-none"
                sandbox="allow-scripts allow-same-origin allow-forms"
              />
            </div>
          </div>
        ) : (
          <div className="w-full h-full max-w-5xl">
            <CodeViewer
              fileName={selectedFile || "src/App.tsx"}
              code={currentCode}
            />
          </div>
        )}
      </div>
    </div>
  );
}
