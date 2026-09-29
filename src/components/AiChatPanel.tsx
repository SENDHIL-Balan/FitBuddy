import React, { useState, useRef, useEffect } from "react";
import { Send, Sparkles, Loader2, CheckCircle2, AlertTriangle, FileCode, ArrowRight, CornerDownLeft, RefreshCw } from "lucide-react";

interface AiChatPanelProps {
  onModify: (prompt: string) => Promise<void>;
  isModifying: boolean;
  modifiedFiles: string[];
  lastExplanation?: string;
  error?: string | null;
}

interface ChatMessage {
  id: string;
  sender: "user" | "agent";
  text: string;
  timestamp: string;
  modifiedFiles?: string[];
  explanation?: string;
}

const QUICK_PROMPTS = [
  "Change the primary color to blue",
  "Make the navbar sticky with backdrop blur",
  "Add a customer testimonials section",
  "Add a pricing section with monthly and yearly plans",
  "Replace the hero section with a modern bakery hero",
  "Add an announcement banner at the top of the page",
];

export default function AiChatPanel({
  onModify,
  isModifying,
  modifiedFiles,
  lastExplanation,
  error,
}: AiChatPanelProps) {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "m_welcome",
      sender: "agent",
      text: "I am your AI frontend modification engineer. Ask me to modify colors, update component text, add new sections, adjust spacing, or overhaul the layout.",
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isModifying]);

  const handleSend = async (promptToSend?: string) => {
    const prompt = (promptToSend || input).trim();
    if (!prompt || isModifying) return;

    const userMsg: ChatMessage = {
      id: "u_" + Date.now(),
      sender: "user",
      text: prompt,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");

    try {
      await onModify(prompt);

      // Add agent reply
      setMessages((prev) => [
        ...prev,
        {
          id: "a_" + Date.now(),
          sender: "agent",
          text: `Applied modification: "${prompt}"`,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          modifiedFiles: modifiedFiles,
          explanation: lastExplanation,
        },
      ]);
    } catch (err: any) {
      setMessages((prev) => [
        ...prev,
        {
          id: "err_" + Date.now(),
          sender: "agent",
          text: `Modification failed: ${err.message}`,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ]);
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-900 border-l border-slate-800 text-slate-200">
      {/* Panel Header */}
      <div className="p-3.5 border-b border-slate-800 flex items-center justify-between bg-slate-900/90 flex-shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
            <Sparkles className="w-3.5 h-3.5" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-white tracking-tight">AI Modification Agent</h3>
            <p className="text-[10px] text-slate-400">Modify live React frontend</p>
          </div>
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3 text-xs">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex flex-col ${
              msg.sender === "user" ? "items-end" : "items-start"
            }`}
          >
            <div
              className={`max-w-[90%] p-3 rounded-2xl space-y-1.5 leading-relaxed shadow-sm ${
                msg.sender === "user"
                  ? "bg-sky-600 text-white rounded-br-xs"
                  : "bg-slate-950 border border-slate-800 text-slate-200 rounded-bl-xs"
              }`}
            >
              <div className="flex items-center justify-between gap-3 text-[10px] opacity-70">
                <span>{msg.sender === "user" ? "You" : "Agent"}</span>
                <span>{msg.timestamp}</span>
              </div>
              <p className="whitespace-pre-wrap">{msg.text}</p>

              {msg.modifiedFiles && msg.modifiedFiles.length > 0 && (
                <div className="pt-2 border-t border-slate-800/80 space-y-1">
                  <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> Updated Components:
                  </span>
                  <div className="flex flex-wrap gap-1 font-mono text-[10px]">
                    {msg.modifiedFiles.map((f) => (
                      <span key={f} className="px-1.5 py-0.5 rounded bg-slate-900 text-sky-300 border border-slate-700">
                        {f}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}

        {/* Live Loading Agent Steps */}
        {isModifying && (
          <div className="p-3.5 rounded-xl bg-slate-950 border border-sky-500/30 text-xs space-y-2 text-slate-300 animate-in fade-in">
            <div className="flex items-center gap-2 text-sky-400 font-bold text-[11px]">
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              <span>Modifying React Source Code...</span>
            </div>

            <div className="space-y-1 pl-5 text-[11px] text-slate-400 font-mono">
              <div className="text-slate-300">→ Analyzing requested change</div>
              <div className="text-slate-400">→ Inspecting component dependencies</div>
              <div className="text-sky-300">→ Synthesizing clean JSX modifications</div>
              <div className="text-slate-500">→ Compiling with esbuild AST validator</div>
            </div>
          </div>
        )}

        {error && (
          <div className="p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 flex-shrink-0 text-rose-400" />
            <span>{error}</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Quick Prompt Chips */}
      <div className="px-3 py-2 border-t border-slate-800 bg-slate-950/60 space-y-1.5">
        <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500 block">
          Suggestions
        </span>
        <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto">
          {QUICK_PROMPTS.map((p, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(p)}
              disabled={isModifying}
              className="text-[10px] px-2 py-1 rounded-md bg-slate-800 hover:bg-slate-700 active:bg-slate-600 text-slate-300 hover:text-white transition-colors cursor-pointer disabled:opacity-50 text-left truncate max-w-full"
            >
              + {p}
            </button>
          ))}
        </div>
      </div>

      {/* Chat Input Bar */}
      <div className="p-3 border-t border-slate-800 bg-slate-950 flex-shrink-0">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="relative flex items-center"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={isModifying}
            placeholder="Ask AI to modify your website..."
            className="w-full pl-3 pr-10 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition-all font-sans"
          />
          <button
            type="submit"
            disabled={!input.trim() || isModifying}
            className="absolute right-1.5 p-1.5 rounded-lg bg-sky-600 text-white hover:bg-sky-500 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer"
            title="Send modification request"
          >
            {isModifying ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Send className="w-3.5 h-3.5" />
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
