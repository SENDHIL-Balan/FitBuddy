import React from "react";
import { Palette, Type, Layers, Compass, ImageIcon, CheckCircle, Smartphone } from "lucide-react";
import { WebsiteAnalysis } from "../types.ts";

interface ProjectAnalysisViewProps {
  analysis: WebsiteAnalysis;
}

export default function ProjectAnalysisView({ analysis }: ProjectAnalysisViewProps) {
  const { theme, navigation, sections, typography, rawDomSummary } = analysis;

  return (
    <div className="p-4 space-y-6 text-xs text-slate-300 overflow-y-auto h-full">
      {/* Design Mood & Theme Badge */}
      <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-bold uppercase tracking-wider text-sky-400">
            Aesthetic Profile
          </span>
          <span className="px-2 py-0.5 rounded-md bg-indigo-500/20 text-indigo-300 text-[10px] font-semibold">
            {theme.borderRadius}
          </span>
        </div>
        <h4 className="text-sm font-bold text-white">{theme.mood}</h4>
        <p className="text-[11px] text-slate-400 font-sans leading-relaxed">
          {analysis.description || "AI-synthesized design system derived from semantic DOM structure."}
        </p>
      </div>

      {/* Extracted Color Palette */}
      <div className="space-y-2.5">
        <div className="flex items-center gap-1.5 text-xs font-bold text-slate-200">
          <Palette className="w-3.5 h-3.5 text-sky-400" />
          <span>Synthesized Color Tokens</span>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div className="p-2 rounded-lg bg-slate-900 border border-slate-800 flex items-center gap-2.5">
            <div
              className="w-6 h-6 rounded-md shadow-xs border border-white/20 flex-shrink-0"
              style={{ backgroundColor: theme.primaryColor }}
            />
            <div className="truncate">
              <div className="text-[10px] text-slate-400 font-medium">Primary</div>
              <div className="font-mono text-[11px] text-white font-bold">{theme.primaryColor}</div>
            </div>
          </div>

          <div className="p-2 rounded-lg bg-slate-900 border border-slate-800 flex items-center gap-2.5">
            <div
              className="w-6 h-6 rounded-md shadow-xs border border-white/20 flex-shrink-0"
              style={{ backgroundColor: theme.secondaryColor }}
            />
            <div className="truncate">
              <div className="text-[10px] text-slate-400 font-medium">Secondary</div>
              <div className="font-mono text-[11px] text-white font-bold">{theme.secondaryColor}</div>
            </div>
          </div>

          <div className="p-2 rounded-lg bg-slate-900 border border-slate-800 flex items-center gap-2.5">
            <div
              className="w-6 h-6 rounded-md shadow-xs border border-white/20 flex-shrink-0"
              style={{ backgroundColor: theme.backgroundColor }}
            />
            <div className="truncate">
              <div className="text-[10px] text-slate-400 font-medium">Background</div>
              <div className="font-mono text-[11px] text-white font-bold">{theme.backgroundColor}</div>
            </div>
          </div>

          <div className="p-2 rounded-lg bg-slate-900 border border-slate-800 flex items-center gap-2.5">
            <div
              className="w-6 h-6 rounded-md shadow-xs border border-white/20 flex-shrink-0"
              style={{ backgroundColor: theme.accentColor }}
            />
            <div className="truncate">
              <div className="text-[10px] text-slate-400 font-medium">Accent</div>
              <div className="font-mono text-[11px] text-white font-bold">{theme.accentColor}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Blueprint */}
      <div className="space-y-2">
        <div className="flex items-center gap-1.5 text-xs font-bold text-slate-200">
          <Compass className="w-3.5 h-3.5 text-sky-400" />
          <span>Navigation Architecture</span>
        </div>
        <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-[11px]">
            <span className="text-slate-400">Brand Name:</span>
            <span className="font-bold text-white">{navigation.brandName}</span>
          </div>
          <div className="flex items-center justify-between text-[11px]">
            <span className="text-slate-400">CTA Button:</span>
            <span className="px-2 py-0.5 rounded bg-sky-500/20 text-sky-300 font-bold">
              {navigation.ctaButton?.label || "Get Started"}
            </span>
          </div>
          <div className="pt-1 border-t border-slate-800/80">
            <span className="text-[10px] text-slate-500 uppercase tracking-wider font-bold">
              Nav Links ({navigation.links.length})
            </span>
            <div className="flex flex-wrap gap-1.5 mt-1.5">
              {navigation.links.map((link, idx) => (
                <span
                  key={idx}
                  className="px-2 py-0.5 rounded bg-slate-800 text-[10px] text-slate-300 font-mono"
                >
                  {link.label}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Semantic Sections Reconstructed */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-200">
            <Layers className="w-3.5 h-3.5 text-sky-400" />
            <span>Reconstructed Sections ({sections.length})</span>
          </div>
        </div>

        <div className="space-y-2">
          {sections.map((sec, idx) => (
            <div
              key={sec.id || idx}
              className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 space-y-1"
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-white text-[11px]">
                  {idx + 1}. {sec.name}
                </span>
                <span className="px-1.5 py-0.5 rounded bg-slate-800 text-[9px] font-mono uppercase text-sky-400">
                  {sec.type}
                </span>
              </div>
              {sec.headline && (
                <p className="text-[10px] text-slate-400 truncate">
                  "{sec.headline}"
                </p>
              )}
              {sec.layoutHint && (
                <div className="text-[9px] text-slate-500 font-mono">
                  Layout: {sec.layoutHint}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* DOM Inspection Metrics */}
      {rawDomSummary && (
        <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800/60 space-y-2 text-[11px]">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Raw DOM Diagnostics
          </span>
          <div className="grid grid-cols-3 gap-2 text-center pt-1">
            <div className="p-1.5 rounded bg-slate-950">
              <div className="font-bold text-white">{rawDomSummary.totalElements}</div>
              <div className="text-[9px] text-slate-500">DOM Nodes</div>
            </div>
            <div className="p-1.5 rounded bg-slate-950">
              <div className="font-bold text-white">{rawDomSummary.textWordCount}</div>
              <div className="text-[9px] text-slate-500">Words Extracted</div>
            </div>
            <div className="p-1.5 rounded bg-slate-950">
              <div className="font-bold text-white">{rawDomSummary.detectedImagesCount}</div>
              <div className="text-[9px] text-slate-500">Assets Mapped</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
