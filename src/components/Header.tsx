import React, { useState } from "react";
import {
  Sparkles,
  Dumbbell,
  Activity,
  Code2,
  Zap,
  BarChart3,
  Flame,
  User,
  TrendingUp,
  Home,
  X,
  Calendar
} from "lucide-react";
import { ProjectMetadata } from "../types.ts";
import { FitnessTab } from "./BottomNavBar.tsx";

interface HeaderProps {
  currentProject: ProjectMetadata | null;
  projects: ProjectMetadata[];
  onSelectProject: (id: string) => void;
  onNewProject: () => void;
  isWorking: boolean;
  activeView: "fitness" | "studio";
  onSwitchView: (view: "fitness" | "studio") => void;
  activeFitnessTab: FitnessTab;
  onSelectFitnessTab: (tab: FitnessTab) => void;
  onOpenProfile?: () => void;
}

export default function Header({
  currentProject,
  projects,
  onSelectProject,
  onNewProject,
  isWorking,
  activeView,
  onSwitchView,
  activeFitnessTab,
  onSelectFitnessTab,
  onOpenProfile,
}: HeaderProps) {
  const [profileModalOpen, setProfileModalOpen] = useState(false);

  const handleProfileClick = () => {
    setProfileModalOpen(true);
    onOpenProfile?.();
  };

  const navTabs = [
    { id: "home" as FitnessTab, label: "Entrance", icon: Home },
    { id: "workouts" as FitnessTab, label: "Workouts", icon: Calendar },
    { id: "progress" as FitnessTab, label: "Wellness", icon: BarChart3 },
    { id: "coach" as FitnessTab, label: "AI Coach", icon: Sparkles, badge: "AI" },
  ];

  return (
    <>
      <header className="border-b border-white/10 bg-[#0c0f17]/95 backdrop-blur-xl z-50 sticky top-0 w-full transition-all">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 h-14 sm:h-16 flex items-center justify-between gap-2">
          {/* 1. BRAND LOGO (Warm Amber / Orange Theme) */}
          <div
            onClick={() => onSelectFitnessTab("home")}
            className="flex items-center gap-2 cursor-pointer group flex-shrink-0"
          >
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-tr from-amber-500 to-orange-500 flex items-center justify-center text-white shadow-md shadow-orange-500/25 group-hover:scale-105 transition-all">
              <Zap className="w-4 h-4 fill-white text-white" />
            </div>
            <div className="flex items-center gap-1.5">
              <span className="font-black text-sm sm:text-base tracking-tight text-white group-hover:text-orange-400 transition-colors font-display whitespace-nowrap">
                FITBUDDY AI
              </span>
              <span className="hidden sm:inline-block px-1.5 py-0.5 text-[8px] font-bold uppercase tracking-wider rounded-md bg-orange-500/10 text-orange-400 border border-orange-500/30">
                PRO 3D
              </span>
            </div>
          </div>

          {/* 2. THREE-SCREEN NAVIGATION TABS */}
          {activeView === "fitness" && (
            <nav className="hidden md:flex items-center gap-1 bg-slate-900/90 p-1 rounded-full border border-white/10 shadow-inner">
              {navTabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeFitnessTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => onSelectFitnessTab(tab.id)}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
                      isActive
                        ? "bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-md shadow-orange-500/30"
                        : "text-slate-400 hover:text-white hover:bg-white/5"
                    }`}
                  >
                    <Icon className={`w-3.5 h-3.5 ${isActive ? "text-white" : "text-slate-400"}`} />
                    <span>{tab.label}</span>
                    {tab.badge && !isActive && (
                      <span className="px-1.5 py-0.2 rounded-full text-[8px] font-mono-tech bg-orange-500/20 text-orange-300 font-bold">
                        {tab.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>
          )}

          {/* 3. RIGHT ACTIONS: Profile + Start Workout + Mode Toggle */}
          <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
            {/* Profile Button */}
            <button
              onClick={handleProfileClick}
              className="p-1.5 sm:p-2 rounded-xl bg-slate-900 border border-white/10 text-slate-300 hover:text-white hover:border-orange-500/30 transition-all cursor-pointer flex items-center gap-1.5"
              title="Athlete Profile"
            >
              <User className="w-3.5 h-3.5 text-orange-400" />
              <span className="hidden lg:inline text-xs font-medium">Profile</span>
            </button>

            {/* Primary CTA: "Start Workout" - switches to Workout Plan Tab */}
            <button
              onClick={() => onSelectFitnessTab("workouts")}
              className="inline-flex items-center justify-center gap-1.5 px-3.5 sm:px-4 py-1.5 sm:py-2 text-xs font-bold text-white bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 active:scale-95 rounded-full shadow-lg shadow-orange-500/25 transition-all cursor-pointer flex-shrink-0 whitespace-nowrap"
            >
              <Dumbbell className="w-3.5 h-3.5 fill-current flex-shrink-0" />
              <span className="whitespace-nowrap font-bold">Start Workout</span>
            </button>

            {/* Subtle Studio Switcher Icon */}
            <button
              onClick={() => onSwitchView(activeView === "fitness" ? "studio" : "fitness")}
              title={activeView === "fitness" ? "Switch to Agent Studio" : "Return to 3D Fitness"}
              className={`p-1.5 sm:p-2 rounded-xl border text-xs font-mono-tech transition-all cursor-pointer flex items-center gap-1 flex-shrink-0 ${
                activeView === "studio"
                  ? "bg-slate-800 text-orange-400 border-orange-500/40"
                  : "bg-slate-900 text-slate-400 hover:text-white border-white/10 hover:border-orange-500/30"
              }`}
            >
              <Code2 className="w-3.5 h-3.5 text-orange-400" />
              <span className="hidden xl:inline text-[10px]">
                {activeView === "studio" ? "Fitness" : "Studio"}
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* ATHLETIC PROFILE MODAL (Warm Amber Theme) */}
      {profileModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-md rounded-3xl bg-[#0c0f17] border border-orange-500/30 shadow-2xl p-6 space-y-6 relative overflow-hidden text-slate-100">
            {/* Ambient Glow */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/10 rounded-full blur-3xl pointer-events-none -z-10" />

            {/* Header */}
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-500 flex items-center justify-center text-white shadow-lg shadow-orange-500/25">
                  <User className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white font-display">Aryan Rathore</h3>
                  <div className="flex items-center gap-1.5 text-xs text-orange-400 font-mono-tech">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span>FitBuddy Pro Member</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setProfileModalOpen(false)}
                className="p-2 rounded-xl bg-slate-900 border border-white/10 text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Physiological Telemetry Stats */}
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-white/5 space-y-1">
                <span className="text-[10px] font-mono-tech uppercase text-slate-400">Active Streak</span>
                <div className="text-xl font-black font-mono-tech text-orange-400">12 Days</div>
                <p className="text-[10px] text-slate-500">Consecutive consistency</p>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-white/5 space-y-1">
                <span className="text-[10px] font-mono-tech uppercase text-slate-400">Wellness Score</span>
                <div className="text-xl font-black font-mono-tech text-emerald-400">88% (Primed)</div>
                <p className="text-[10px] text-slate-500">Optimal recovery state</p>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-white/5 space-y-1">
                <span className="text-[10px] font-mono-tech uppercase text-slate-400">Daily Calorie Burn</span>
                <div className="text-xl font-black font-mono-tech text-rose-400">642 kcal</div>
                <p className="text-[10px] text-slate-500">Target: 750 kcal</p>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-white/5 space-y-1">
                <span className="text-[10px] font-mono-tech uppercase text-slate-400">Heart Rate</span>
                <div className="text-xl font-black font-mono-tech text-amber-400">150 bpm</div>
                <p className="text-[10px] text-slate-500">Normal cardio rhythm</p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={() => {
                  setProfileModalOpen(false);
                  onSelectFitnessTab("workouts");
                }}
                className="flex-1 py-3 px-4 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold text-xs shadow-lg shadow-orange-500/25 cursor-pointer flex items-center justify-center gap-2"
              >
                <Dumbbell className="w-4 h-4" />
                <span>Start Workout Plan</span>
              </button>

              <button
                onClick={() => setProfileModalOpen(false)}
                className="py-3 px-4 rounded-full bg-slate-900 border border-white/10 text-slate-300 hover:text-white text-xs font-semibold cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
