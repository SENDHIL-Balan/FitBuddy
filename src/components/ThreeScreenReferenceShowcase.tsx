import React, { useState } from "react";
import AthleteSilhouette3D from "./AthleteSilhouette3D.tsx";
import {
  Heart,
  Flame,
  Zap,
  Play,
  Timer,
  Droplets,
  Activity,
  Award,
  Crown,
  ChevronRight,
  Sparkles,
  Calendar,
  Home,
  Dumbbell
} from "lucide-react";
import { WorkoutCardItem } from "../types.ts";

interface ThreeScreenReferenceShowcaseProps {
  onStartWorkout?: (workoutId: string) => void;
  onOpenAiGenerator?: () => void;
  onOpenAiCoach?: () => void;
  onSelectMuscle?: (muscle: string) => void;
}

export default function ThreeScreenReferenceShowcase({
  onStartWorkout,
  onOpenAiGenerator,
  onOpenAiCoach,
  onSelectMuscle,
}: ThreeScreenReferenceShowcaseProps) {
  const [activeScreenIndex, setActiveScreenIndex] = useState<number>(0);
  const [selectedDay, setSelectedDay] = useState<string>("Wed 09");
  const [selectedCategory, setSelectedCategory] = useState<string>("All Workouts");

  const days = [
    { day: "Mon", date: "07" },
    { day: "Tue", date: "08" },
    { day: "Wed", date: "09" },
    { day: "Thu", date: "10" },
    { day: "Fri", date: "11" },
    { day: "Sat", date: "12" },
  ];

  return (
    <div className="w-full space-y-6">
      {/* View Mode Bar for Desktop / Tablet */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-slate-900/80 border border-white/10 shadow-lg">
        <div className="flex items-center gap-2.5">
          <div className="w-2.5 h-2.5 rounded-full bg-orange-500 animate-pulse" />
          <span className="text-xs font-mono-tech uppercase font-bold text-orange-400 tracking-wider">
            FitBuddy AI 3-Screen Architecture
          </span>
          <span className="hidden sm:inline text-xs text-slate-400">
            • Inspired by your reference design
          </span>
        </div>

        {/* Tab Switcher Pills */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-950 rounded-xl border border-white/10">
          <button
            onClick={() => setActiveScreenIndex(0)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              activeScreenIndex === 0
                ? "bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-md shadow-orange-500/30"
                : "text-slate-400 hover:text-white"
            }`}
          >
            Screen 1: Hero & 3D Human
          </button>
          <button
            onClick={() => setActiveScreenIndex(1)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              activeScreenIndex === 1
                ? "bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-md shadow-orange-500/30"
                : "text-slate-400 hover:text-white"
            }`}
          >
            Screen 2: Workout Plan
          </button>
          <button
            onClick={() => setActiveScreenIndex(2)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              activeScreenIndex === 2
                ? "bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-md shadow-orange-500/30"
                : "text-slate-400 hover:text-white"
            }`}
          >
            Screen 3: Dashboard & Wellness
          </button>
        </div>
      </div>

      {/* THREE SCREENS DISPLAY GRID */}
      {/* On desktop (xl:), shows all 3 phones side-by-side matching the reference image! */}
      {/* On mobile / tablet (< xl:), shows the selected active screen */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 items-start justify-center">
        {/* ========================================================================= */}
        {/* SCREEN 1: GET STARTED / 3D RUNNING ATHLETE WITH GLOWING MUSCLES           */}
        {/* ========================================================================= */}
        <div
          className={`w-full max-w-sm mx-auto rounded-[42px] border-4 border-slate-800 bg-[#0c0f17] shadow-2xl overflow-hidden relative transition-all duration-300 ${
            activeScreenIndex === 0
              ? "ring-2 ring-orange-500/40"
              : "opacity-90 xl:opacity-100 hidden xl:block"
          }`}
        >
          {/* Phone Status Bar */}
          <div className="h-8 px-6 pt-2 flex items-center justify-between text-[11px] font-mono-tech text-slate-400 z-30 relative select-none">
            <span>9:41</span>
            <div className="w-20 h-4 rounded-full bg-slate-900 border border-white/5" />
            <div className="flex items-center gap-1.5">
              <span>5G</span>
              <div className="w-5 h-2.5 rounded-sm border border-slate-400 p-0.5">
                <div className="w-full h-full bg-slate-200 rounded-2xs" />
              </div>
            </div>
          </div>

          {/* 3D Athlete Canvas with Glowing Muscle Callouts */}
          <div className="h-[580px] relative">
            <AthleteSilhouette3D
              onGetStarted={() => setActiveScreenIndex(1)}
              showOverlayUI={true}
            />
          </div>
        </div>

        {/* ========================================================================= */}
        {/* SCREEN 2: WORKOUT PLAN (MIDDLE SCREEN OF REFERENCE IMAGE)                 */}
        {/* ========================================================================= */}
        <div
          className={`w-full max-w-sm mx-auto rounded-[42px] border-4 border-slate-800 bg-[#f8fafc] text-slate-900 shadow-2xl overflow-hidden relative min-h-[620px] transition-all duration-300 flex flex-col justify-between ${
            activeScreenIndex === 1
              ? "ring-2 ring-orange-500/40"
              : "opacity-90 xl:opacity-100 hidden xl:flex"
          }`}
        >
          {/* Phone Status Bar (Dark text on light card) */}
          <div className="h-8 px-6 pt-2 flex items-center justify-between text-[11px] font-mono-tech text-slate-700 z-30 relative select-none">
            <span>9:41</span>
            <div className="w-20 h-4 rounded-full bg-slate-200" />
            <div className="flex items-center gap-1.5">
              <span>5G</span>
              <div className="w-5 h-2.5 rounded-sm border border-slate-700 p-0.5">
                <div className="w-full h-full bg-slate-800 rounded-2xs" />
              </div>
            </div>
          </div>

          <div className="p-5 space-y-5 flex-1">
            {/* User Profile Header: Aryan Rathore + Pro Crown */}
            <div className="flex items-center justify-between pt-1">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-amber-400 to-orange-500 p-0.5 shadow-md shadow-orange-500/25">
                  <div className="w-full h-full rounded-full bg-slate-800 flex items-center justify-center text-white font-bold text-sm">
                    AR
                  </div>
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 leading-tight">Aryan Rathore</h3>
                  <div className="flex items-center gap-1 text-[11px] text-slate-500 font-medium">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    <span>FitBuddy Athlete</span>
                  </div>
                </div>
              </div>

              {/* Pro Badge */}
              <div className="px-2.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-600 font-bold text-[11px] flex items-center gap-1">
                <span>Pro</span>
                <Crown className="w-3 h-3 fill-amber-500 text-amber-500" />
              </div>
            </div>

            {/* Headline matching Reference: "One Step Closer To Your Goal" */}
            <div className="space-y-1">
              <h2 className="text-2xl font-black text-slate-950 font-display tracking-tight leading-tight">
                One Step Closer To <br />
                <span className="text-slate-900">Your Goal</span>
              </h2>
            </div>

            {/* Category Pills: All Workouts, Full Body, Lower Body */}
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pt-1">
              {["All Workouts", "Full Body", "Lower Body"].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer whitespace-nowrap shadow-xs ${
                    selectedCategory === cat
                      ? "bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-md shadow-orange-500/30"
                      : "bg-white text-slate-600 hover:text-slate-900 border border-slate-200"
                  }`}
                >
                  {cat === "Full Body" && <span className="mr-1">✕</span>}
                  {cat === "Lower Body" && <span className="mr-1">⬆</span>}
                  <span>{cat}</span>
                </button>
              ))}
            </div>

            {/* Subheader: Your Plan + See More */}
            <div className="flex items-center justify-between pt-1">
              <span className="text-base font-extrabold text-slate-950">Your Plan</span>
              <button
                onClick={onOpenAiGenerator}
                className="text-xs font-semibold text-slate-500 hover:text-orange-500 transition-colors cursor-pointer"
              >
                See More
              </button>
            </div>

            {/* Workout Card 1: Full Body Workout (with 3D Mannequin Seated Dumbbell Press) */}
            <div className="p-4 rounded-3xl bg-white border border-slate-200/80 shadow-md shadow-slate-200/50 space-y-3 relative overflow-hidden group hover:border-orange-300 transition-all">
              <div className="flex items-start gap-4">
                {/* 3D Mannequin Muscle Graphic Box */}
                <div className="w-24 h-24 rounded-2xl bg-gradient-to-b from-slate-100 to-slate-200 border border-slate-200 flex items-center justify-center relative overflow-hidden flex-shrink-0">
                  <div className="absolute inset-0 bg-radial from-orange-500/15 to-transparent" />
                  <div className="relative text-center">
                    <Dumbbell className="w-8 h-8 text-slate-700 mx-auto" />
                    <span className="text-[9px] font-mono-tech text-orange-600 font-bold block mt-1">
                      DELTS & CHEST
                    </span>
                  </div>
                </div>

                {/* Details */}
                <div className="space-y-1 flex-1">
                  <span className="px-2 py-0.5 rounded-full bg-orange-100 text-orange-600 text-[10px] font-bold uppercase tracking-wider inline-block">
                    Muscle
                  </span>
                  <h4 className="text-base font-bold text-slate-950 leading-snug">
                    Full Body Workout
                  </h4>
                  <p className="text-[11px] text-slate-500 leading-relaxed line-clamp-2">
                    Build Strength, Boost Endurance, And Challenge Every Muscle.
                  </p>
                  <div className="flex items-center gap-1.5 text-xs text-slate-600 font-medium pt-1">
                    <Timer className="w-3.5 h-3.5 text-slate-400" />
                    <span>30 Minutes</span>
                  </div>
                </div>
              </div>

              {/* Start CTA */}
              <button
                onClick={() => onStartWorkout?.("w_full_body")}
                className="w-full py-2 rounded-xl bg-slate-900 hover:bg-orange-500 text-white text-xs font-bold transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Start Workout</span>
              </button>
            </div>

            {/* Workout Card 2: Pull Up / Cardio Workout */}
            <div className="p-4 rounded-3xl bg-white border border-slate-200/80 shadow-md shadow-slate-200/50 space-y-3 relative overflow-hidden group hover:border-orange-300 transition-all">
              <div className="flex items-start gap-4">
                {/* 3D Graphic Box */}
                <div className="w-24 h-24 rounded-2xl bg-gradient-to-b from-slate-100 to-slate-200 border border-slate-200 flex items-center justify-center relative overflow-hidden flex-shrink-0">
                  <div className="absolute inset-0 bg-radial from-amber-500/15 to-transparent" />
                  <div className="relative text-center">
                    <Activity className="w-8 h-8 text-slate-700 mx-auto" />
                    <span className="text-[9px] font-mono-tech text-amber-600 font-bold block mt-1">
                      KINETIC PULL
                    </span>
                  </div>
                </div>

                {/* Details */}
                <div className="space-y-1 flex-1">
                  <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 text-[10px] font-bold uppercase tracking-wider inline-block">
                    Cardio
                  </span>
                  <h4 className="text-base font-bold text-slate-950 leading-snug">
                    Pull Up Workout
                  </h4>
                  <p className="text-[11px] text-slate-500 leading-relaxed line-clamp-2">
                    Lat recruitment, dynamic core stability and grip endurance.
                  </p>
                  <div className="flex items-center gap-1.5 text-xs text-slate-600 font-medium pt-1">
                    <Timer className="w-3.5 h-3.5 text-slate-400" />
                    <span>25 Minutes</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Floating Reference Pill Bottom Bar */}
          <div className="p-4 flex justify-center bg-transparent">
            <div className="bg-white border border-slate-200 p-1.5 rounded-full shadow-lg flex items-center gap-2">
              <button
                onClick={() => setActiveScreenIndex(0)}
                className="w-10 h-10 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-800"
              >
                <Home className="w-4 h-4" />
              </button>
              <button
                onClick={() => setActiveScreenIndex(1)}
                className="w-10 h-10 rounded-full bg-gradient-to-tr from-amber-500 to-orange-500 text-white flex items-center justify-center shadow-md shadow-orange-500/30"
              >
                <Calendar className="w-4 h-4" />
              </button>
              <button
                onClick={() => setActiveScreenIndex(2)}
                className="w-10 h-10 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-800"
              >
                <Dumbbell className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* SCREEN 3: FITNESS DASHBOARD / WELLNESS (RIGHT SCREEN OF REFERENCE IMAGE) */}
        {/* ========================================================================= */}
        <div
          className={`w-full max-w-sm mx-auto rounded-[42px] border-4 border-slate-800 bg-[#f8fafc] text-slate-900 shadow-2xl overflow-hidden relative min-h-[620px] transition-all duration-300 flex flex-col justify-between ${
            activeScreenIndex === 2
              ? "ring-2 ring-orange-500/40"
              : "opacity-90 xl:opacity-100 hidden xl:flex"
          }`}
        >
          {/* Phone Status Bar */}
          <div className="h-8 px-6 pt-2 flex items-center justify-between text-[11px] font-mono-tech text-slate-700 z-30 relative select-none">
            <span>9:41</span>
            <div className="w-20 h-4 rounded-full bg-slate-200" />
            <div className="flex items-center gap-1.5">
              <span>5G</span>
              <div className="w-5 h-2.5 rounded-sm border border-slate-700 p-0.5">
                <div className="w-full h-full bg-slate-800 rounded-2xs" />
              </div>
            </div>
          </div>

          <div className="p-5 space-y-4 flex-1">
            {/* Top Calendar Strip: Mon 07, Tue 08, Wed 09 (active orange circle), Thu 10, Fri 11, Sat 12 */}
            <div className="flex items-center justify-between gap-1 pt-1">
              {days.map((item) => {
                const isSelected = selectedDay === `${item.day} ${item.date}`;
                return (
                  <button
                    key={item.day}
                    onClick={() => setSelectedDay(`${item.day} ${item.date}`)}
                    className={`py-2 px-2 rounded-2xl flex flex-col items-center justify-center transition-all cursor-pointer ${
                      isSelected
                        ? "bg-gradient-to-tr from-amber-500 to-orange-500 text-white shadow-md shadow-orange-500/35 scale-105"
                        : "bg-white text-slate-500 hover:text-slate-900 border border-slate-200/80"
                    }`}
                  >
                    <span className="text-[10px] font-medium">{item.day}</span>
                    <span className="text-xs font-bold mt-0.5">{item.date}</span>
                  </button>
                );
              })}
            </div>

            {/* Heart Rate Card with 3D Anatomical Heart graphic */}
            <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-md shadow-slate-200/50 relative overflow-hidden">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm font-bold text-slate-900">Heart Rate</span>
                    <span className="text-rose-500 text-xs">❤️</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-[11px] text-emerald-600 font-semibold mt-0.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span>Normal</span>
                  </div>

                  <div className="text-3xl font-black text-slate-950 font-display mt-3">
                    150 <span className="text-sm text-slate-400 font-normal">Bpm</span>
                  </div>
                </div>

                {/* Heart Graphic with Pulse Wave */}
                <div className="relative w-24 h-20 flex items-center justify-center">
                  <div className="w-14 h-14 rounded-2xl bg-rose-50 border border-rose-200 flex items-center justify-center shadow-inner">
                    <Heart className="w-8 h-8 text-rose-500 fill-rose-500 animate-pulse" />
                  </div>
                  {/* ECG wave SVG overlay */}
                  <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 100 60">
                    <path
                      d="M 5 30 L 25 30 L 35 15 L 45 45 L 55 10 L 65 35 L 75 30 L 95 30"
                      fill="none"
                      stroke="#f97316"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                    />
                  </svg>
                </div>
              </div>
            </div>

            {/* Two Side-by-Side Metric Cards: Blood Pressure & Water */}
            <div className="grid grid-cols-2 gap-3">
              {/* Blood Pressure Card */}
              <div className="p-4 rounded-3xl bg-white border border-slate-200 shadow-md shadow-slate-200/50 space-y-2">
                <div className="flex items-center gap-1 text-xs font-bold text-slate-900">
                  <span>Blood Pressure</span>
                  <span className="text-rose-500 text-[10px]">🫀</span>
                </div>
                <div className="text-lg font-black text-slate-950 font-display">
                  170 <span className="text-[10px] text-slate-400 font-normal">Mg/Hg</span>
                </div>
                {/* Mini Bar Chart */}
                <div className="flex items-end justify-between h-9 pt-1 gap-1">
                  {[40, 70, 50, 95, 60].map((h, i) => (
                    <div
                      key={i}
                      className="flex-1 rounded-full bg-gradient-to-t from-amber-400 to-orange-500"
                      style={{ height: `${h}%` }}
                    />
                  ))}
                </div>
              </div>

              {/* Water Intake Card */}
              <div className="p-4 rounded-3xl bg-white border border-slate-200 shadow-md shadow-slate-200/50 space-y-2">
                <div className="flex items-center gap-1 text-xs font-bold text-slate-900">
                  <span>Water</span>
                  <Droplets className="w-3.5 h-3.5 text-sky-500" />
                </div>
                <div className="text-lg font-black text-slate-950 font-display">
                  1,20 <span className="text-[10px] text-slate-400 font-normal">Liters</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden mt-3">
                  <div className="h-full bg-gradient-to-r from-sky-400 to-blue-500 rounded-full w-[65%]" />
                </div>
                <span className="text-[10px] text-slate-400 block pt-1">
                  65% of daily 2.0L goal
                </span>
              </div>
            </div>

            {/* Wellness Score Card with Semi-Circular Radial Arc matching Reference */}
            <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-md shadow-slate-200/50 relative overflow-hidden space-y-2">
              <span className="text-sm font-bold text-slate-950 block">Wellness Score</span>

              <div className="relative w-full h-32 flex items-center justify-center">
                <svg className="w-48 h-32" viewBox="0 0 200 120">
                  {/* Background Arc */}
                  <path
                    d="M 25 105 A 75 75 0 0 1 175 105"
                    fill="none"
                    stroke="#f1f5f9"
                    strokeWidth="16"
                    strokeLinecap="round"
                  />
                  {/* Progress Orange Arc */}
                  <path
                    d="M 25 105 A 75 75 0 0 1 155 45"
                    fill="none"
                    stroke="url(#wellnessArc)"
                    strokeWidth="16"
                    strokeLinecap="round"
                  />
                  <defs>
                    <linearGradient id="wellnessArc" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#f59e0b" />
                      <stop offset="100%" stopColor="#ea580c" />
                    </linearGradient>
                  </defs>
                </svg>

                <div className="absolute bottom-2 flex flex-col items-center">
                  <span className="text-3xl font-black text-slate-950 font-display">88%</span>
                  <span className="text-[10px] font-bold text-orange-600 uppercase">Optimal Recovery</span>
                </div>
              </div>
            </div>
          </div>

          {/* Floating Reference Pill Bottom Bar */}
          <div className="p-4 flex justify-center bg-transparent">
            <div className="bg-white border border-slate-200 p-1.5 rounded-full shadow-lg flex items-center gap-2">
              <button
                onClick={() => setActiveScreenIndex(0)}
                className="w-10 h-10 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-800"
              >
                <Home className="w-4 h-4" />
              </button>
              <button
                onClick={() => setActiveScreenIndex(1)}
                className="w-10 h-10 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-800"
              >
                <Calendar className="w-4 h-4" />
              </button>
              <button
                onClick={() => setActiveScreenIndex(2)}
                className="w-10 h-10 rounded-full bg-gradient-to-tr from-amber-500 to-orange-500 text-white flex items-center justify-center shadow-md shadow-orange-500/30"
              >
                <Dumbbell className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
