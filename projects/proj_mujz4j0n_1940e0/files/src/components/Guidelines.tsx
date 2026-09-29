import React from 'react';
import { Layers, Smartphone, Sparkles, Shield, Cpu, Zap } from 'lucide-react';

const iconMap: Record<string, any> = {
  Layers,
  Smartphone,
  Sparkles,
  Shield,
  Cpu,
  Zap,
};

export default function Features() {
  const features = [
  {
    "title": "Documentation Examples",
    "description": "Safe to include in books, code samples, API guides, and system configuration examples.",
    "iconName": "BookOpen",
    "imageUrl": "",
    "tag": "Permitted",
    "metric": "100% Free"
  },
  {
    "title": "Zero Operational Risk",
    "description": "Reserved by the IANA to ensure these hostnames are never registered by third parties.",
    "iconName": "ShieldCheck",
    "imageUrl": "",
    "tag": "Safe",
    "metric": "Reserved"
  },
  {
    "title": "Avoid Operational Use",
    "description": "Do not configure operational mail servers or mission-critical DNS relying on this domain.",
    "iconName": "AlertCircle",
    "imageUrl": "",
    "tag": "Notice",
    "metric": "Strict Policy"
  }
];

  return (
    <section id="features" className="py-20 bg-[#FFFFFF]/70 border-y border-slate-200/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <span className="text-xs font-bold uppercase tracking-wider text-[#38488f]">
            Features & Capabilities
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#1E293B] tracking-tight">
            Permitted Usage & Implementation
          </h2>
          <p className="text-base sm:text-lg text-slate-600">
            Guidelines on using example.com, example.net, and example.org in technical documentation and code samples.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((item: any, idx: number) => {
            const Icon = iconMap[item.iconName] || Sparkles;
            return (
              <div
                key={idx}
                className="relative group p-8 bg-white rounded-xl border border-slate-200/80 shadow-xs hover:shadow-xl transition-all duration-300 hover:-translate-y-1 space-y-4"
              >
                <div className="w-12 h-12 rounded-xl bg-[#38488f]/10 text-[#38488f] flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-[#1E293B]">
                  {item.title}
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed font-normal">
                  {item.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
