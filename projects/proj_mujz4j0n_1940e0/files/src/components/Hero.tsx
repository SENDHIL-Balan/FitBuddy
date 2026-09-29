import React from 'react';
import { ArrowRight, CheckCircle2, ShieldCheck, Zap } from 'lucide-react';

export default function Hero() {
  return (
    <section className="relative overflow-hidden pt-12 pb-20 md:pt-20 md:pb-28 bg-[#F8FAFC]">
      {/* Decorative Background Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-b from-[#38488f]/10 via-[#64748B]/5 to-transparent blur-3xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Text Column */}
          <div className="lg:col-span-7 text-center lg:text-left space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-[#38488f]/10 text-[#38488f] border border-[#38488f]/20 shadow-xs">
              <Zap className="w-3.5 h-3.5" />
              <span>RFC 2606 & RFC 6761</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-[#1E293B] leading-[1.12]">
              Example Domain
            </h1>

            <p className="text-lg sm:text-xl text-slate-600 max-w-2xl mx-auto lg:mx-0 font-normal leading-relaxed">
              This domain is established to be used for illustrative examples in documents without needing prior coordination or permission.
            </p>

            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              <a
                href="#features"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 text-base font-semibold text-white bg-[#38488f] hover:opacity-95 rounded-xl shadow-lg shadow-[#38488f]/25 transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                <span>Read Specifications</span>
                <ArrowRight className="w-4 h-4" />
              </a>

              <a
                href="#details"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 text-base font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl shadow-xs transition-all"
              >
                <span>Documentation</span>
              </a>
            </div>

            {/* Social Proof Badges */}
            <div className="pt-6 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-xs text-slate-500 font-medium">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Zero Latency Architecture</span>
              </div>
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-[#38488f]" />
                <span>Production-grade Scalability</span>
              </div>
            </div>
          </div>

          {/* Right Visual Column */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              <div className="relative rounded-2xl bg-gradient-to-tr from-[#38488f]/20 to-[#2563EB]/20 p-2 shadow-2xl">
                <div className="rounded-xl bg-slate-900 text-white p-6 sm:p-8 space-y-6 shadow-inner border border-slate-800">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-rose-500" />
                      <div className="w-3 h-3 rounded-full bg-amber-500" />
                      <div className="w-3 h-3 rounded-full bg-emerald-500" />
                    </div>
                    <span className="text-xs text-slate-400 font-mono">webclone.system.ts</span>
                  </div>

                  <div className="space-y-3 font-mono text-xs text-slate-300">
                    <p className="text-emerald-400">// Intelligent Reconstruction Engine</p>
                    <p><span className="text-indigo-400">const</span> site = <span className="text-amber-300">reconstruct</span>(&#123;</p>
                    <p className="pl-4">engine: <span className="text-emerald-300">"Gemini 3.8 Flash"</span>,</p>
                    <p className="pl-4">components: <span className="text-sky-300">"Modular React + Tailwind"</span>,</p>
                    <p className="pl-4">validation: <span className="text-sky-300">"Automated AST Build Loop"</span>,</p>
                    <p className="pl-4">fidelity: <span className="text-purple-300">1.00</span></p>
                    <p>&#125;);</p>
                  </div>

                  <div className="pt-2 flex items-center justify-between text-xs text-slate-400 bg-slate-800/80 rounded-lg p-3">
                    <span>Validation Status:</span>
                    <span className="text-emerald-400 font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> 100% Passed
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
