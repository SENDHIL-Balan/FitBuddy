import React, { useState, useRef, useEffect } from "react";
import AiCoachOrb3D from "./AiCoachOrb3D.tsx";
import { Sparkles, Send, Bot, User, ArrowRight, ShieldCheck, Zap, Activity, RefreshCw } from "lucide-react";

interface Message {
  id: string;
  role: "user" | "model";
  text: string;
  timestamp: string;
}

export default function AiCoachSection() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "init_1",
      role: "model",
      text: "Greetings, Athlete. I am FitBuddy AI, your neural biomechanics and physical conditioning coach. Today your recovery status is calibrated at 88% (Optimal Priming). Based on your recent workouts, your recovery is improving, and your next session is focused on upper-body strength. How would you like to advance your protocol today?",
      timestamp: "08:14 AM",
    },
  ]);
  const [input, setInput] = useState("");
  const [isThinking, setIsThinking] = useState(false);
  const [suggestedActions, setSuggestedActions] = useState<string[]>([
    "Optimize chest & triceps biomechanics",
    "Should I take an active recovery day?",
    "Calculate my optimal protein intake",
    "What is the best rep tempo for hypertrophy?",
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isThinking]);

  const handleSend = async (queryText?: string) => {
    const textToSend = (queryText || input).trim();
    if (!textToSend || isThinking) return;

    const userMsg: Message = {
      id: "msg_" + Date.now(),
      role: "user",
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsThinking(true);

    try {
      const historyPayload = [...messages, userMsg].map((m) => ({
        role: m.role,
        text: m.text,
      }));

      const res = await fetch("/api/fitness/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: historyPayload,
          userContext: {
            currentStreak: 12,
            caloriesBurned: 642,
            lastWorkout: "Chest & Triceps Hypertrophy",
            recoveryScore: 88,
          },
        }),
      });

      if (!res.ok) {
        throw new Error("Coach response failed.");
      }

      const data = await res.json();
      const aiReply: Message = {
        id: "ai_" + Date.now(),
        role: "model",
        text: data.reply,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };

      setMessages((prev) => [...prev, aiReply]);
      if (data.suggestedActions?.length) {
        setSuggestedActions(data.suggestedActions);
      }
    } catch (err: any) {
      setMessages((prev) => [
        ...prev,
        {
          id: "err_" + Date.now(),
          role: "model",
          text: "I experienced a telemetry link fluctuation. However, based on your current 88% recovery index, you are cleared for high-intensity compound lifting today. Prioritize a 3-second eccentric tempo on your primary lifts.",
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ]);
    } finally {
      setIsThinking(false);
    }
  };

  return (
    <div id="ai-coach" className="w-full glass-panel rounded-3xl p-6 sm:p-10 border border-white/10 shadow-2xl relative overflow-hidden">
      {/* Background Gradient Orbs */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-blue-600/10 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-purple-600/10 rounded-full blur-3xl pointer-events-none -z-10" />

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-8 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            <span className="text-[11px] font-mono-tech uppercase font-bold text-cyan-400 tracking-wider">
              Autonomous Intelligence Core
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight font-display">
            Meet Your AI Coach
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
            Engineered with sports science kinesiology, metabolic adaptation modeling, and real-time form diagnostics.
          </p>
        </div>

        {/* Live Status Badge */}
        <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-900 border border-white/10 self-start md:self-auto text-xs font-mono-tech">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
          <span className="text-slate-300">Neural Sync: <strong className="text-white">Active</strong></span>
        </div>
      </div>

      {/* Contextual Intelligence Insight Banners */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 py-6">
        <div className="p-3.5 rounded-xl bg-blue-950/20 border border-blue-500/25 flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center flex-shrink-0">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div className="text-xs leading-relaxed text-slate-300">
            <strong className="text-white font-medium">Physiological Adaptation:</strong> Based on your recent workouts, your recovery is improving at a rate of +4.2% weekly.
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-cyan-950/20 border border-cyan-500/25 flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-cyan-500/20 text-cyan-400 flex items-center justify-center flex-shrink-0">
            <Zap className="w-4 h-4" />
          </div>
          <div className="text-xs leading-relaxed text-slate-300">
            <strong className="text-white font-medium">Program Target:</strong> Your next session is focused on upper-body strength & pectoralis hypertrophy.
          </div>
        </div>
      </div>

      {/* Main Container: 3D Orb + Live Conversation Terminal */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Left: 3D Interactive AI Orb */}
        <div className="lg:col-span-4 flex flex-col items-center justify-center p-6 rounded-2xl bg-gradient-to-b from-slate-900/60 to-slate-950/80 border border-white/5 relative">
          <div className="w-64 h-64 relative flex items-center justify-center">
            <AiCoachOrb3D isThinking={isThinking} />
          </div>

          <div className="text-center space-y-1 mt-2">
            <span className="text-base font-bold text-white font-display">
              FitBuddy Neural Orb
            </span>
            <p className="text-xs font-mono-tech text-cyan-400">
              {isThinking ? "Synthesizing biomechanics..." : "Listening & Monitoring"}
            </p>
          </div>
        </div>

        {/* Right: Conversational Interface */}
        <div className="lg:col-span-8 flex flex-col h-[460px] rounded-2xl bg-slate-950 border border-white/10 overflow-hidden shadow-xl">
          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
            {messages.map((m) => {
              const isAi = m.role === "model";
              return (
                <div
                  key={m.id}
                  className={`flex gap-3 max-w-[88%] ${isAi ? "self-start" : "ml-auto flex-row-reverse"}`}
                >
                  <div
                    className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 text-xs ${
                      isAi
                        ? "bg-blue-600 text-white shadow-md shadow-blue-600/30"
                        : "bg-slate-800 text-slate-300"
                    }`}
                  >
                    {isAi ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
                  </div>

                  <div
                    className={`p-4 rounded-2xl text-xs sm:text-sm leading-relaxed space-y-1 ${
                      isAi
                        ? "bg-slate-900/90 border border-white/10 text-slate-200 rounded-tl-xs shadow-md"
                        : "bg-blue-600 text-white rounded-tr-xs shadow-md"
                    }`}
                  >
                    <div className="flex items-center justify-between text-[10px] opacity-60 font-mono-tech pb-1">
                      <span>{isAi ? "FitBuddy AI Coach" : "You"}</span>
                      <span>{m.timestamp}</span>
                    </div>
                    <p className="whitespace-pre-wrap">{m.text}</p>
                  </div>
                </div>
              );
            })}

            {isThinking && (
              <div className="flex gap-3 max-w-[85%] self-start animate-in fade-in">
                <div className="w-7 h-7 rounded-lg bg-blue-600 text-white flex items-center justify-center flex-shrink-0">
                  <Bot className="w-4 h-4 animate-spin" />
                </div>
                <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-cyan-500/30 text-xs text-cyan-300 flex items-center gap-2 font-mono-tech">
                  <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                  <span>Analyzing kinetic patterns and calculating recommendations...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Suggestions Bar */}
          <div className="px-4 py-2 border-t border-white/5 bg-slate-900/40 flex items-center gap-2 overflow-x-auto no-scrollbar">
            <span className="text-[10px] font-mono-tech text-slate-500 uppercase flex-shrink-0">
              Suggestions:
            </span>
            {suggestedActions.map((prompt, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(prompt)}
                disabled={isThinking}
                className="px-2.5 py-1 rounded-md bg-slate-800/80 hover:bg-slate-700/80 active:bg-blue-600 text-slate-300 hover:text-white text-[11px] font-medium transition-all cursor-pointer whitespace-nowrap border border-white/5 disabled:opacity-50"
              >
                {prompt}
              </button>
            ))}
          </div>

          {/* Chat Input Bar */}
          <div className="p-3 sm:p-4 border-t border-white/10 bg-slate-900/80">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="flex items-center gap-2"
            >
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                disabled={isThinking}
                placeholder="Ask your AI Coach about training, form, fatigue, nutrition..."
                className="flex-1 px-4 py-3 bg-slate-950 border border-white/10 rounded-xl text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all font-sans"
              />
              <button
                type="submit"
                disabled={!input.trim() || isThinking}
                className="px-5 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 active:scale-95 text-white text-xs sm:text-sm font-semibold shadow-lg shadow-blue-600/30 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1.5 flex-shrink-0"
              >
                <span>Send</span>
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
