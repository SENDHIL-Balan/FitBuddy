import React from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';

export default function CTA() {
  return (
    <section id="cta" className="py-20 relative overflow-hidden bg-gradient-to-br from-[#38488f] to-[#64748B] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6 relative z-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-white/15 text-white backdrop-blur-xs">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Get Started In Seconds</span>
        </div>
        <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight max-w-3xl mx-auto leading-tight">
          Need More Information on Reserved Domains?
        </h2>
        <p className="text-base sm:text-lg text-white/80 max-w-2xl mx-auto">
          Explore the full Internet Assigned Numbers Authority (IANA) registry and RFC definitions.
        </p>
        <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
          <a
            href="#"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 text-base font-bold text-[#38488f] bg-white rounded-xl shadow-xl hover:bg-slate-50 transition-all hover:scale-105 active:scale-95"
          >
            <span>Start Building Today</span>
            <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      </div>
    </section>
  );
}
