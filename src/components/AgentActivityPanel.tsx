import React, { useEffect, useRef } from "react";
import { Check, Loader2, Circle, Terminal, AlertTriangle, ShieldCheck, Cpu } from "lucide-react";
import { AgentLog, ProjectMetadata } from "../types.ts";

interface AgentActivityPanelProps {
  logs: AgentLog[];
  status: ProjectMetadata["status"];
  currentUrl: string;
  error?: string | null;
}

export default function AgentActivityPanel({
  logs,
  status,
  currentUrl,
  error,
}: AgentActivityPanelProps) {
  const terminalEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [logs]);

  // Determine stage progression from real status and logs
  const hasStage = (stage: AgentLog["stage"]) => logs.some((l) => l.stage === stage);
  const isStageSuccess = (stage: AgentLog["stage"]) =>
    logs.some((l) => l.stage === stage && (l.status === "success" || l.status === "info"));

  const steps = [
    {
      id: "url",
      title: "URL received",
      done: true,
      active: false,
    },
    {
      id: "fetch",
      title: "Fetching website DOM",
      done: hasStage("ANALYZE") || hasStage("CODEGEN") || hasStage("VALIDATE") || status === "ready",
      active: status === "analyzing" && !hasStage("ANALYZE"),
    },
    {
      id: "structure",
      title: "Analyzing page structure & hierarchy",
      done: hasStage("ANALYZE") || hasStage("CODEGEN") || status === "ready",
      active: status === "analyzing" && hasStage("FETCH"),
    },
    {
      id: "sections",
      title: "Detecting semantic sections & components",
      done: hasStage("ANALYZE") || hasStage("CODEGEN") || status === "ready",
      active: status === "analyzing",
    },
    {
      id: "typography",
      title: "Analyzing typography & visual style tokens",
      done: hasStage("ANALYZE") || hasStage("CODEGEN") || status === "ready",
      active: status === "analyzing",
    },
    {
      id: "colors",
      title: "Detecting color palette & mood tokens",
      done: hasStage("ANALYZE") || hasStage("CODEGEN") || status === "ready",
      active: status === "analyzing",
    },
    {
      id: "assets",
      title: "Analyzing images & media assets",
      done: hasStage("ANALYZE") || hasStage("CODEGEN") || status === "ready",
      active: status === "analyzing",
    },
    {
      id: "responsive",
      title: "Understanding responsive layouts",
      done: hasStage("ANALYZE") || hasStage("CODEGEN") || status === "ready",
      active: status === "analyzing",
    },
    {
      id: "codegen",
      title: "Generating modular React components",
      done: hasStage("VALIDATE") || status === "ready",
      active: status === "generating",
    },
    {
      id: "validate",
      title: "Validating generated project with AST compiler",
      done: status === "ready",
      active: status === "validating",
    },
    {
      id: "preview",
      title: "Starting interactive sandbox preview",
      done: status === "ready",
      active: status === "validating" && hasStage("VALIDATE"),
    },
  ];

  return (
    <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      {/* Header Card */}
      <div className="flex items-center justify-between p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-sky-400 animate-pulse" />
            <h2 className="text-base font-bold text-white tracking-tight">
              AI Agent Activity
            </h2>
          </div>
          <p className="text-xs text-slate-400 font-mono truncate max-w-md sm:max-w-xl">
            Target: <span className="text-sky-300 font-semibold">{currentUrl}</span>
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 border border-slate-700">
          <Cpu className="w-3.5 h-3.5 text-sky-400" />
          <span>Status: {status.toUpperCase()}</span>
        </div>
      </div>

      {/* Grid: Left Checkpoints, Right Live Log Terminal */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Step Checkpoints List */}
        <div className="md:col-span-5 p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
            Reconstruction Stages
          </h3>

          <div className="space-y-2 text-xs">
            {steps.map((step) => {
              return (
                <div
                  key={step.id}
                  className={`flex items-center gap-3 p-2 rounded-lg transition-colors ${
                    step.active
                      ? "bg-sky-500/10 text-sky-300 font-semibold border border-sky-500/20"
                      : step.done
                      ? "text-slate-200"
                      : "text-slate-500"
                  }`}
                >
                  <div className="flex-shrink-0">
                    {step.done ? (
                      <div className="w-4 h-4 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                        <Check className="w-3 h-3 stroke-[3]" />
                      </div>
                    ) : step.active ? (
                      <Loader2 className="w-4 h-4 text-sky-400 animate-spin" />
                    ) : (
                      <Circle className="w-4 h-4 text-slate-700 stroke-[1.5]" />
                    )}
                  </div>
                  <span className="truncate">{step.title}</span>
                </div>
              );
            })}
          </div>

          {error && (
            <div className="mt-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs space-y-1">
              <div className="flex items-center gap-1.5 font-bold">
                <AlertTriangle className="w-4 h-4 text-rose-400" />
                <span>Error Encountered</span>
              </div>
              <p className="text-[11px] leading-relaxed text-rose-200">{error}</p>
            </div>
          )}
        </div>

        {/* Live Terminal Log Stream */}
        <div className="md:col-span-7 flex flex-col h-96 rounded-2xl bg-slate-950 border border-slate-800 shadow-xl overflow-hidden">
          <div className="flex items-center justify-between px-4 py-2.5 bg-slate-900/90 border-b border-slate-800 text-xs">
            <div className="flex items-center gap-2 text-slate-300">
              <Terminal className="w-4 h-4 text-sky-400" />
              <span className="font-mono font-semibold">Agent Execution Log</span>
            </div>
            <span className="text-[10px] text-slate-500 font-mono">
              {logs.length} event(s)
            </span>
          </div>

          <div className="flex-1 p-4 font-mono text-xs overflow-y-auto space-y-2.5">
            {logs.map((log) => {
              const isError = log.status === "error";
              const isWarn = log.status === "warning";
              const isSuccess = log.status === "success";

              return (
                <div
                  key={log.id}
                  className={`p-2 rounded-lg border leading-relaxed ${
                    isError
                      ? "bg-rose-950/40 border-rose-800/60 text-rose-200"
                      : isWarn
                      ? "bg-amber-950/40 border-amber-800/60 text-amber-200"
                      : isSuccess
                      ? "bg-emerald-950/20 border-emerald-800/30 text-emerald-200"
                      : "bg-slate-900/40 border-slate-800/40 text-slate-300"
                  }`}
                >
                  <div className="flex items-center justify-between text-[10px] text-slate-400 pb-1">
                    <span className="font-bold uppercase text-sky-400">
                      [{log.stage}]
                    </span>
                    <span>{log.timestamp}</span>
                  </div>
                  <div className="font-medium">{log.message}</div>
                  {log.details && (
                    <div className="text-[11px] text-slate-400 mt-1 whitespace-pre-wrap font-sans">
                      {log.details}
                    </div>
                  )}
                </div>
              );
            })}
            <div ref={terminalEndRef} />
          </div>
        </div>
      </div>
    </div>
  );
}
