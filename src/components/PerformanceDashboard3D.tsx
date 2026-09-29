import React, { useState } from "react";
import { Flame, Timer, Zap, Heart, TrendingUp, Activity, Award, ShieldCheck, ArrowUpRight, BarChart2 } from "lucide-react";

export default function PerformanceDashboard3D() {
  const [activeMetricTab, setActiveMetricTab] = useState<"rings" | "intensity" | "recovery">("rings");

  // Telemetry data
  const metrics = {
    calories: 642,
    caloriesTarget: 750,
    workoutMinutes: 48,
    workoutTarget: 60,
    streakDays: 12,
    heartRate: 138,
    restingHr: 52,
    vo2Max: 54.2,
    recoveryScore: 88,
    consistencyRate: 96,
    strengthIndex: "+14.2%",
    steps: 8420,
    stepsTarget: 10000,
  };

  const calPct = Math.min(100, Math.round((metrics.calories / metrics.caloriesTarget) * 100));
  const timePct = Math.min(100, Math.round((metrics.workoutMinutes / metrics.workoutTarget) * 100));
  const stepPct = Math.min(100, Math.round((metrics.steps / metrics.stepsTarget) * 100));

  return (
    <div className="w-full space-y-8">
      {/* Main 3D Performance Card Container */}
      <div className="relative rounded-3xl glass-panel p-6 sm:p-10 border border-white/10 shadow-2xl shadow-blue-950/20 overflow-hidden">
        {/* Subtle Ambient Light Glows */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none -z-10" />
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none -z-10" />

        {/* Dashboard Top Row */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-8 border-b border-white/10">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
              <span className="text-[11px] font-mono-tech uppercase font-bold text-orange-400 tracking-wider">
                Telemetry Synchronization • Live
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight font-display">
              Today's Performance
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Neural physiological monitoring across metabolic strain, cardiovascular response, and recovery.
            </p>
          </div>

          {/* Metric Tab Selector */}
          <div className="flex items-center gap-1 p-1 bg-slate-900/80 rounded-2xl border border-white/5 self-start md:self-auto">
            <button
              onClick={() => setActiveMetricTab("rings")}
              className={`px-3 py-1.5 rounded-xl text-xs font-mono-tech transition-all cursor-pointer ${
                activeMetricTab === "rings"
                  ? "bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-md font-semibold"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              3D Activity Rings
            </button>
            <button
              onClick={() => setActiveMetricTab("intensity")}
              className={`px-3 py-1.5 rounded-xl text-xs font-mono-tech transition-all cursor-pointer ${
                activeMetricTab === "intensity"
                  ? "bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-md font-semibold"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              Strain Velocity
            </button>
            <button
              onClick={() => setActiveMetricTab("recovery")}
              className={`px-3 py-1.5 rounded-xl text-xs font-mono-tech transition-all cursor-pointer ${
                activeMetricTab === "recovery"
                  ? "bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-md font-semibold"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              Bio-Readiness
            </button>
          </div>
        </div>

        {/* PROMINENT WELLNESS SCORE CARD */}
        <div className="mb-6 p-6 rounded-3xl bg-gradient-to-r from-amber-950/40 via-orange-950/30 to-slate-900 border border-orange-500/30 shadow-xl relative overflow-hidden">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-5">
              {/* Circular Progress Gauge */}
              <div className="relative w-24 h-24 flex items-center justify-center flex-shrink-0">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="42" stroke="rgba(255, 255, 255, 0.08)" strokeWidth="8" fill="none" />
                  <circle
                    cx="50"
                    cy="50"
                    r="42"
                    stroke="url(#wellnessGrad)"
                    strokeWidth="8"
                    strokeDasharray={264}
                    strokeDashoffset={264 - (264 * metrics.recoveryScore) / 100}
                    strokeLinecap="round"
                    fill="none"
                    className="transition-all duration-1000"
                  />
                  <defs>
                    <linearGradient id="wellnessGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#f59e0b" />
                      <stop offset="100%" stopColor="#ea580c" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                  <span className="text-2xl font-black font-mono-tech text-white leading-none">
                    {metrics.recoveryScore}
                  </span>
                  <span className="text-[9px] font-mono-tech uppercase text-orange-400 font-bold mt-0.5">
                    Score
                  </span>
                </div>
              </div>

              {/* Status and Details */}
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-mono-tech font-bold uppercase">
                    Optimal Bio-Readiness
                  </span>
                  <span className="text-xs text-slate-400 font-mono-tech">Daily Health Index</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-black text-white font-display tracking-tight">
                  Wellness Score: 88% Primed
                </h3>
                <p className="text-xs text-slate-300 max-w-xl leading-relaxed">
                  Central nervous system fully recovered. Cardiovascular baseline resting at 52 bpm. Optimal physiological window for hypertrophy and high-output athletic conditioning today.
                </p>
              </div>
            </div>

            {/* Quick Micro-Metrics */}
            <div className="grid grid-cols-2 gap-2 sm:border-l sm:border-white/10 sm:pl-6 flex-shrink-0 w-full sm:w-auto">
              <div className="p-2.5 rounded-2xl bg-slate-900/80 border border-white/5 text-center">
                <span className="text-[10px] text-slate-400 font-mono-tech block">Heart Rate</span>
                <span className="text-sm font-bold font-mono-tech text-amber-400">150 bpm</span>
              </div>
              <div className="p-2.5 rounded-2xl bg-slate-900/80 border border-white/5 text-center">
                <span className="text-[10px] text-slate-400 font-mono-tech block">Steps</span>
                <span className="text-sm font-bold font-mono-tech text-emerald-400">8,420</span>
              </div>
              <div className="p-2.5 rounded-2xl bg-slate-900/80 border border-white/5 text-center">
                <span className="text-[10px] text-slate-400 font-mono-tech block">VO2 Max</span>
                <span className="text-sm font-bold font-mono-tech text-orange-400">54.2</span>
              </div>
              <div className="p-2.5 rounded-2xl bg-slate-900/80 border border-white/5 text-center">
                <span className="text-[10px] text-slate-400 font-mono-tech block">Consistency</span>
                <span className="text-sm font-bold font-mono-tech text-orange-300">96%</span>
              </div>
            </div>
          </div>
        </div>

        {/* 3 Key Large Metric Stat Pill Pillars */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 py-8">
          {/* Calories Burned */}
          <div className="p-6 rounded-2xl bg-gradient-to-b from-slate-900/90 to-slate-950/90 border border-white/10 hover:border-blue-500/40 transition-all duration-300 shadow-lg space-y-2 group">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono-tech uppercase font-bold text-slate-400">Calories</span>
              <div className="w-8 h-8 rounded-xl bg-rose-500/15 text-rose-400 flex items-center justify-center">
                <Flame className="w-4 h-4" />
              </div>
            </div>
            <div className="text-4xl sm:text-5xl font-black font-mono-tech text-white tracking-tight flex items-baseline gap-1">
              <span>{metrics.calories}</span>
              <span className="text-xs text-slate-500 font-normal">/ {metrics.caloriesTarget} kcal</span>
            </div>
            <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden mt-3">
              <div
                className="h-full bg-gradient-to-r from-rose-500 to-orange-400 rounded-full transition-all duration-1000"
                style={{ width: `${calPct}%` }}
              />
            </div>
            <span className="text-[11px] text-slate-400 font-mono-tech block pt-1">
              {calPct}% of daily caloric threshold achieved
            </span>
          </div>

          {/* Workout Duration */}
          <div className="p-6 rounded-2xl bg-gradient-to-b from-slate-900/90 to-slate-950/90 border border-white/10 hover:border-cyan-500/40 transition-all duration-300 shadow-lg space-y-2 group">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono-tech uppercase font-bold text-slate-400">Workout Duration</span>
              <div className="w-8 h-8 rounded-xl bg-cyan-500/15 text-cyan-400 flex items-center justify-center">
                <Timer className="w-4 h-4" />
              </div>
            </div>
            <div className="text-4xl sm:text-5xl font-black font-mono-tech text-white tracking-tight flex items-baseline gap-1">
              <span>{metrics.workoutMinutes}</span>
              <span className="text-xs text-slate-500 font-normal">/ {metrics.workoutTarget} min</span>
            </div>
            <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden mt-3">
              <div
                className="h-full bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full transition-all duration-1000"
                style={{ width: `${timePct}%` }}
              />
            </div>
            <span className="text-[11px] text-slate-400 font-mono-tech block pt-1">
              Zone 4 Anaerobic & Zone 3 Aerobic split
            </span>
          </div>

          {/* Streak Days */}
          <div className="p-6 rounded-2xl bg-gradient-to-b from-slate-900/90 to-slate-950/90 border border-white/10 hover:border-purple-500/40 transition-all duration-300 shadow-lg space-y-2 group">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono-tech uppercase font-bold text-slate-400">Active Streak</span>
              <div className="w-8 h-8 rounded-xl bg-purple-500/15 text-purple-400 flex items-center justify-center">
                <Award className="w-4 h-4" />
              </div>
            </div>
            <div className="text-4xl sm:text-5xl font-black font-mono-tech text-white tracking-tight flex items-baseline gap-1">
              <span>{metrics.streakDays}</span>
              <span className="text-xs text-slate-500 font-normal">days</span>
            </div>
            <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden mt-3">
              <div className="h-full bg-gradient-to-r from-purple-500 to-indigo-400 rounded-full w-full" />
            </div>
            <span className="text-[11px] text-emerald-400 font-mono-tech block pt-1">
              🔥 Best consistency run in 6 months (+12d)
            </span>
          </div>
        </div>

        {/* 3D PERFORMANCE VISUAL CONTAINER */}
        <div className="relative p-6 sm:p-8 rounded-2xl bg-slate-950 border border-white/10 overflow-hidden">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
            {/* Left: 3D Layered Concentric Activity Rings */}
            <div className="relative w-64 h-64 sm:w-72 sm:h-72 flex items-center justify-center flex-shrink-0">
              {/* Outer Ring 1: Calories (Rose/Orange) */}
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 200 200">
                {/* Track */}
                <circle cx="100" cy="100" r="85" stroke="rgba(244, 63, 94, 0.15)" strokeWidth="12" fill="none" />
                <circle
                  cx="100"
                  cy="100"
                  r="85"
                  stroke="url(#roseGradient)"
                  strokeWidth="12"
                  strokeDasharray={2 * Math.PI * 85}
                  strokeDashoffset={2 * Math.PI * 85 * (1 - calPct / 100)}
                  strokeLinecap="round"
                  fill="none"
                  className="transition-all duration-1000 ease-out"
                />

                {/* Ring 2: Exercise Minutes (Cyan/Blue) */}
                <circle cx="100" cy="100" r="68" stroke="rgba(6, 182, 212, 0.15)" strokeWidth="12" fill="none" />
                <circle
                  cx="100"
                  cy="100"
                  r="68"
                  stroke="url(#cyanGradient)"
                  strokeWidth="12"
                  strokeDasharray={2 * Math.PI * 68}
                  strokeDashoffset={2 * Math.PI * 68 * (1 - timePct / 100)}
                  strokeLinecap="round"
                  fill="none"
                  className="transition-all duration-1000 ease-out"
                />

                {/* Ring 3: Steps / Recovery (Violet/Indigo) */}
                <circle cx="100" cy="100" r="51" stroke="rgba(139, 92, 246, 0.15)" strokeWidth="12" fill="none" />
                <circle
                  cx="100"
                  cy="100"
                  r="51"
                  stroke="url(#violetGradient)"
                  strokeWidth="12"
                  strokeDasharray={2 * Math.PI * 51}
                  strokeDashoffset={2 * Math.PI * 51 * (1 - stepPct / 100)}
                  strokeLinecap="round"
                  fill="none"
                  className="transition-all duration-1000 ease-out"
                />

                <defs>
                  <linearGradient id="roseGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#F43F5E" />
                    <stop offset="100%" stopColor="#FB923C" />
                  </linearGradient>
                  <linearGradient id="cyanGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#06B6D4" />
                    <stop offset="100%" stopColor="#3B82F6" />
                  </linearGradient>
                  <linearGradient id="violetGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#8B5CF6" />
                    <stop offset="100%" stopColor="#6366F1" />
                  </linearGradient>
                </defs>
              </svg>

              {/* Center 3D Holographic Dial Badge */}
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center">
                <span className="text-[10px] font-mono-tech uppercase font-bold text-slate-400">
                  Overall Score
                </span>
                <span className="text-3xl font-extrabold font-mono-tech text-white">92</span>
                <span className="text-[9px] font-mono-tech text-emerald-400 uppercase font-semibold">
                  Tier: Prime
                </span>
              </div>
            </div>

            {/* Right: Detailed Metric Telemetry Grid */}
            <div className="flex-1 w-full space-y-4">
              <div className="flex items-center justify-between border-b border-white/5 pb-2">
                <span className="text-xs font-mono-tech uppercase font-bold text-slate-400">
                  Sub-System Telemetry
                </span>
                <span className="text-xs font-mono-tech text-cyan-400">Auto-Refreshed: 1s</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div className="p-3.5 rounded-xl bg-slate-900/60 border border-white/5 space-y-1">
                  <div className="flex items-center justify-between text-slate-400">
                    <span className="text-[10px] font-mono-tech uppercase">Heart Rate</span>
                    <Heart className="w-3.5 h-3.5 text-rose-500" />
                  </div>
                  <div className="text-xl font-bold font-mono-tech text-white">138 <span className="text-xs text-slate-400">BPM</span></div>
                  <span className="text-[10px] text-slate-500 font-mono-tech">Resting: 52 BPM</span>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-900/60 border border-white/5 space-y-1">
                  <div className="flex items-center justify-between text-slate-400">
                    <span className="text-[10px] font-mono-tech uppercase">Recovery</span>
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  </div>
                  <div className="text-xl font-bold font-mono-tech text-emerald-400">88%</div>
                  <span className="text-[10px] text-slate-500 font-mono-tech">HRV: 72 ms</span>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-900/60 border border-white/5 space-y-1">
                  <div className="flex items-center justify-between text-slate-400">
                    <span className="text-[10px] font-mono-tech uppercase">Step Cadence</span>
                    <Activity className="w-3.5 h-3.5 text-blue-400" />
                  </div>
                  <div className="text-xl font-bold font-mono-tech text-white">8,420</div>
                  <span className="text-[10px] text-slate-500 font-mono-tech">Target: 10,000</span>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-900/60 border border-white/5 space-y-1">
                  <div className="flex items-center justify-between text-slate-400">
                    <span className="text-[10px] font-mono-tech uppercase">Strength Velocity</span>
                    <TrendingUp className="w-3.5 h-3.5 text-cyan-400" />
                  </div>
                  <div className="text-xl font-bold font-mono-tech text-cyan-400">+14.2%</div>
                  <span className="text-[10px] text-slate-500 font-mono-tech">Barbell 1RM speed</span>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-900/60 border border-white/5 space-y-1">
                  <div className="flex items-center justify-between text-slate-400">
                    <span className="text-[10px] font-mono-tech uppercase">Consistency</span>
                    <Award className="w-3.5 h-3.5 text-purple-400" />
                  </div>
                  <div className="text-xl font-bold font-mono-tech text-white">96%</div>
                  <span className="text-[10px] text-slate-500 font-mono-tech">28/30 scheduled</span>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-900/60 border border-white/5 space-y-1">
                  <div className="flex items-center justify-between text-slate-400">
                    <span className="text-[10px] font-mono-tech uppercase">Strain Load</span>
                    <Zap className="w-3.5 h-3.5 text-amber-400" />
                  </div>
                  <div className="text-xl font-bold font-mono-tech text-amber-300">14.8</div>
                  <span className="text-[10px] text-slate-500 font-mono-tech">Optimal Strenuous</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
