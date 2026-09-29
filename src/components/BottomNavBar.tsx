import React from "react";
import { Home, Calendar, Dumbbell, Sparkles } from "lucide-react";

export type FitnessTab = "home" | "workouts" | "progress" | "coach";

interface BottomNavBarProps {
  activeTab: FitnessTab;
  onSelectTab: (tab: FitnessTab) => void;
}

export default function BottomNavBar({ activeTab, onSelectTab }: BottomNavBarProps) {
  return (
    <div className="fixed bottom-6 left-0 right-0 z-50 flex justify-center pointer-events-none px-4">
      {/* Floating Pill Nav Bar matching reference image */}
      <div className="pointer-events-auto bg-white/95 dark:bg-slate-900/90 backdrop-blur-2xl border border-white/20 dark:border-white/10 p-2 rounded-full shadow-2xl shadow-black/30 flex items-center gap-3">
        {/* Button 1: Home (Screen 1) */}
        <button
          onClick={() => onSelectTab("home")}
          className={`w-12 h-12 rounded-full flex items-center justify-center transition-all cursor-pointer ${
            activeTab === "home"
              ? "bg-gradient-to-tr from-amber-500 to-orange-500 text-white shadow-lg shadow-orange-500/40 scale-105"
              : "bg-transparent text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
          }`}
          title="Screen 1: Home & 3D Hero"
        >
          <Home className="w-5 h-5 fill-current" />
        </button>

        {/* Button 2: Workout Plan (Screen 2) */}
        <button
          onClick={() => onSelectTab("workouts")}
          className={`w-12 h-12 rounded-full flex items-center justify-center transition-all cursor-pointer ${
            activeTab === "workouts"
              ? "bg-gradient-to-tr from-amber-500 to-orange-500 text-white shadow-lg shadow-orange-500/40 scale-105"
              : "bg-transparent text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
          }`}
          title="Screen 2: Workout Plan"
        >
          <Calendar className="w-5 h-5" />
        </button>

        {/* Button 3: Fitness Dashboard (Screen 3) */}
        <button
          onClick={() => onSelectTab("progress")}
          className={`w-12 h-12 rounded-full flex items-center justify-center transition-all cursor-pointer ${
            activeTab === "progress"
              ? "bg-gradient-to-tr from-amber-500 to-orange-500 text-white shadow-lg shadow-orange-500/40 scale-105"
              : "bg-transparent text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
          }`}
          title="Screen 3: Fitness Dashboard & Wellness"
        >
          <Dumbbell className="w-5 h-5" />
        </button>

        {/* Optional Button 4: AI Coach */}
        <button
          onClick={() => onSelectTab("coach")}
          className={`w-12 h-12 rounded-full flex items-center justify-center transition-all cursor-pointer ${
            activeTab === "coach"
              ? "bg-gradient-to-tr from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/40 scale-105"
              : "bg-transparent text-slate-500 hover:text-cyan-500 dark:text-slate-400 dark:hover:text-cyan-300"
          }`}
          title="AI Coach Assistant"
        >
          <Sparkles className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
