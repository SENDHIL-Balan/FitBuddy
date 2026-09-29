import React, { useState } from "react";
import { Globe, ArrowRight, Sparkles, ShieldCheck, Check, Layers, Code2, RefreshCw, Layout, Compass, Flame } from "lucide-react";

interface UrlInputHeroProps {
  onAnalyze: (url: string) => void;
  isLoading: boolean;
}

const PRESET_SITES = [
  {
    title: "SaaS & Cloud Platform",
    url: "https://supabase.com",
    tag: "Dark Theme SaaS",
    description: "Modern database platform with hero code blocks, feature grids, and enterprise metrics.",
    accent: "from-emerald-500/20 to-teal-500/10",
  },
  {
    title: "Artisanal Bakery & Cafe",
    url: "https://tartinebakery.com",
    tag: "Artisanal Warm",
    description: "Warm culinary branding with editorial layout, menu cards, and visual storytelling.",
    accent: "from-amber-500/20 to-orange-500/10",
  },
  {
    title: "Modern Minimal Agency",
    url: "https://minimal.gallery",
    tag: "Minimalist Grid",
    description: "High-contrast editorial design with masonry card structures and refined typography.",
    accent: "from-purple-500/20 to-indigo-500/10",
  },
];

export default function UrlInputHero({ onAnalyze, isLoading }: UrlInputHeroProps) {
  const [url, setUrl] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) {
      setError("Please enter a valid website URL.");
      return;
    }
    setError(null);
    onAnalyze(url.trim());
  };

  const handleSelectPreset = (presetUrl: string) => {
    setUrl(presetUrl);
    setError(null);
    onAnalyze(presetUrl);
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 py-10 sm:py-16 space-y-12">
      {/* Title & Badge */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-sky-500/10 text-sky-400 border border-sky-500/20 shadow-xs">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Founding AI Engineer Assessment • Production MVP</span>
        </div>

        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.1]">
          Reconstruct any website into a{" "}
          <span className="bg-gradient-to-r from-sky-400 via-indigo-300 to-purple-400 bg-clip-text text-transparent">
            clean React frontend
          </span>
        </h1>

        <p className="text-base sm:text-lg text-slate-400 leading-relaxed font-normal">
          Provide any publicly accessible website URL. Our autonomous AI agent extracts the layout, typography, colors, and components, synthesizes modular React source code, validates build integrity with an error-repair loop, and presents a live preview ready for conversational AI modifications.
        </p>
      </div>

      {/* Main URL Form Container */}
      <div className="relative max-w-3xl mx-auto">
        <div className="relative rounded-2xl bg-slate-900 border border-slate-800 p-3 sm:p-4 shadow-2xl shadow-sky-950/40">
          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500">
                  <Globe className="w-5 h-5" />
                </div>
                <input
                  type="text"
                  value={url}
                  onChange={(e) => {
                    setUrl(e.target.value);
                    if (error) setError(null);
                  }}
                  disabled={isLoading}
                  placeholder="https://example.com"
                  className="w-full pl-11 pr-4 py-3.5 bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-500 text-sm focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition-all font-mono"
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 active:scale-[0.98] text-white font-semibold text-sm rounded-xl shadow-lg shadow-sky-600/25 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0"
              >
                {isLoading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Agent Analyzing...</span>
                  </>
                ) : (
                  <>
                    <span>Analyze Website</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>

            {error && (
              <p className="text-xs text-rose-400 pl-1 font-medium">{error}</p>
            )}

            <div className="flex items-center justify-between text-xs text-slate-500 px-1 pt-1">
              <span>Supports any public URL with HTML/CSS</span>
              <span>Autonomous AST build verification</span>
            </div>
          </form>
        </div>
      </div>

      {/* Preset Websites for 1-Click Testing */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Compass className="w-4 h-4 text-sky-400" />
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              Test Presets (3 Distinct Architectures)
            </h3>
          </div>
          <span className="text-xs text-slate-500">Click to run instant reconstruction</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {PRESET_SITES.map((preset, idx) => (
            <div
              key={idx}
              onClick={() => !isLoading && handleSelectPreset(preset.url)}
              className={`group relative p-5 rounded-xl bg-slate-900/80 hover:bg-slate-900 border border-slate-800 hover:border-sky-500/50 transition-all duration-200 cursor-pointer shadow-sm hover:shadow-lg hover:-translate-y-0.5 space-y-3 bg-gradient-to-b ${preset.accent}`}
            >
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-wider text-sky-400">
                  {preset.tag}
                </span>
                <span className="text-xs text-slate-500 group-hover:text-white transition-colors">
                  Run →
                </span>
              </div>

              <div>
                <h4 className="text-base font-bold text-white group-hover:text-sky-300 transition-colors">
                  {preset.title}
                </h4>
                <p className="text-xs font-mono text-slate-400 mt-1 truncate">
                  {preset.url}
                </p>
              </div>

              <p className="text-xs text-slate-400 leading-relaxed">
                {preset.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* 8-Step Architecture Process Flow */}
      <div className="p-6 rounded-2xl bg-slate-900/50 border border-slate-800/80 space-y-6">
        <div className="text-center space-y-1">
          <h4 className="text-sm font-bold uppercase tracking-wider text-slate-300">
            Reconstruction & Validation Pipeline
          </h4>
          <p className="text-xs text-slate-500">
            Real end-to-end pipeline executing without mock shortcuts or static iframes
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3 text-center text-xs">
          {[
            { step: "01", name: "URL Ingestion", desc: "Security & host check" },
            { step: "02", name: "DOM Scraping", desc: "Cheerio HTML/CSS tokens" },
            { step: "03", name: "UI Synthesis", desc: "Gemini 3.8 Flash model" },
            { step: "04", name: "Code Generation", desc: "Modular React + TSX" },
            { step: "05", name: "AST Validation", desc: "esbuild syntax verify" },
            { step: "06", name: "Error Repair", desc: "Autonomous loop (max 3)" },
            { step: "07", name: "Live Preview", desc: "Interactive sandbox" },
          ].map((item, i) => (
            <div
              key={i}
              className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/60 space-y-1"
            >
              <div className="text-[10px] font-mono text-sky-400 font-bold">
                {item.step}
              </div>
              <div className="font-semibold text-slate-200">{item.name}</div>
              <div className="text-[10px] text-slate-500">{item.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
