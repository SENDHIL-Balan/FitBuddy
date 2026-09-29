import React, { useState } from "react";
import { WorkoutCardItem } from "../types.ts";
import { Timer, Flame, ArrowRight, Play, Zap, Shield, Sparkles, Layers, Dumbbell, Target, CheckCircle2 } from "lucide-react";

interface WorkoutCards3DProps {
  onSelectMuscle: (muscle: string) => void;
  onStartWorkout: (workout: WorkoutCardItem) => void;
  onOpenAiGenerator?: () => void;
}

const FEATURED_WORKOUTS: WorkoutCardItem[] = [
  {
    id: "w_full_body",
    title: "Full Body Workout",
    category: "Full Body",
    level: "All Levels",
    duration: 30,
    calories: 380,
    muscleGroups: ["Core", "Quadriceps", "Chest", "Back"],
    primaryMuscle: "Core",
    intensity: "High",
    exercisesCount: 5,
    description: "Build strength, boost endurance and challenge every major muscle group in a high-density circuit.",
  },
  {
    id: "w_cardio_hiit",
    title: "Pull Up & Cardio Workout",
    category: "Cardio",
    level: "All Levels",
    duration: 25,
    calories: 340,
    muscleGroups: ["Quadriceps", "Core", "Back", "Biceps"],
    primaryMuscle: "Back",
    intensity: "Maximum",
    exercisesCount: 5,
    description: "Improve cardiovascular fitness and endurance with progressive pull volume, interval sprints and kinetic circuits.",
  },
  {
    id: "w_chest_tri",
    title: "Chest & Triceps Hypertrophy",
    category: "Upper Body",
    level: "Intermediate",
    duration: 45,
    calories: 460,
    muscleGroups: ["Chest", "Triceps", "Shoulders"],
    primaryMuscle: "Chest",
    intensity: "High",
    exercisesCount: 5,
    description: "High tension incline barbell work combined with continuous tension cable flyes and close-grip pressing.",
  },
  {
    id: "w_back_bi",
    title: "V-Taper Back & Biceps Power",
    category: "Upper Body",
    level: "Advanced",
    duration: 50,
    calories: 520,
    muscleGroups: ["Back", "Biceps", "Shoulders"],
    primaryMuscle: "Back",
    intensity: "Maximum",
    exercisesCount: 6,
    description: "Heavy latissimus dorsi recruitment via pendlay rows, neutral-grip pulldowns, and incline curls.",
  },
  {
    id: "w_legs_core",
    title: "Quad Drive & Posterior Chain",
    category: "Lower Body",
    level: "Advanced",
    duration: 55,
    calories: 640,
    muscleGroups: ["Quadriceps", "Hamstrings", "Glutes", "Calves"],
    primaryMuscle: "Quadriceps",
    intensity: "Maximum",
    exercisesCount: 6,
    description: "Barbell back squats paired with romanian deadlifts and high-rep walking lunges for maximal systemic output.",
  },
  {
    id: "w_delts_arms",
    title: "3D Deltoids & Arm Sculpt",
    category: "Upper Body",
    level: "Intermediate",
    duration: 40,
    calories: 380,
    muscleGroups: ["Shoulders", "Biceps", "Triceps"],
    primaryMuscle: "Shoulders",
    intensity: "Moderate",
    exercisesCount: 5,
    description: "Strict lateral raises in the scapular plane with overhead extensions and concentrated arm pump sets.",
  },
];

export default function WorkoutCards3D({ onSelectMuscle, onStartWorkout, onOpenAiGenerator }: WorkoutCards3DProps) {
  const [selectedGoal, setSelectedGoal] = useState<string>("Build Muscle");
  const [selectedFilter, setSelectedFilter] = useState<string>("All");
  const [hoveredCardId, setHoveredCardId] = useState<string | null>(null);

  const goals = [
    "Build Muscle",
    "Lose Weight",
    "Improve Fitness",
    "Increase Strength",
    "Improve Endurance",
  ];

  const categories = ["All", "Full Body", "Upper Body", "Lower Body", "Cardio"];

  const filteredWorkouts = selectedFilter === "All"
    ? FEATURED_WORKOUTS
    : FEATURED_WORKOUTS.filter((w) => w.category === selectedFilter);

  return (
    <div id="workouts" className="w-full space-y-6">
      {/* Header matching Reference Design: "One Step Closer To Your Goal" */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-4 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
            <span className="text-[11px] font-mono-tech uppercase font-bold text-orange-400 tracking-wider">
              Personalized Plan • Screen 2
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight font-display">
            One Step Closer To Your Goal
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-xl">
            Select your training goal and explore daily workout regimens customized for peak biomechanical performance.
          </p>
        </div>

        {/* AI Generator CTA */}
        {onOpenAiGenerator && (
          <button
            onClick={onOpenAiGenerator}
            className="px-4 py-2.5 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-white font-bold text-xs shadow-lg shadow-orange-500/25 transition-all flex items-center gap-2 cursor-pointer self-start md:self-auto"
          >
            <Sparkles className="w-4 h-4 text-white" />
            <span>Generate Custom AI Plan</span>
          </button>
        )}
      </div>

      {/* Fitness Goal Pills */}
      <div className="space-y-2">
        <span className="text-[10px] font-mono-tech uppercase font-bold text-slate-400 block">
          Current Fitness Goal:
        </span>
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
          {goals.map((g) => {
            const isSelected = selectedGoal === g;
            return (
              <button
                key={g}
                onClick={() => setSelectedGoal(g)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer border flex items-center gap-1.5 ${
                  isSelected
                    ? "bg-gradient-to-r from-amber-500 to-orange-500 border-orange-400 text-white shadow-md shadow-orange-500/30"
                    : "bg-slate-900/80 border-white/10 text-slate-400 hover:text-white hover:bg-slate-800"
                }`}
              >
                {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-white" />}
                <span>{g}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Category Filter Pills: All, Full Body, Upper Body, Lower Body, Cardio */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1 pt-1">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedFilter(cat)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-mono-tech transition-all cursor-pointer whitespace-nowrap border ${
              selectedFilter === cat
                ? "bg-gradient-to-r from-amber-500 to-orange-500 border-orange-500 text-white shadow-md shadow-orange-500/30 font-semibold"
                : "bg-slate-900/80 border-white/10 text-slate-400 hover:text-white hover:bg-slate-800"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* 3D Workout Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredWorkouts.map((workout) => {
          const isHovered = hoveredCardId === workout.id;
          return (
            <div
              key={workout.id}
              onMouseEnter={() => setHoveredCardId(workout.id)}
              onMouseLeave={() => setHoveredCardId(null)}
              className={`rounded-3xl p-6 border transition-all duration-300 flex flex-col justify-between group cursor-pointer relative overflow-hidden ${
                isHovered
                  ? "bg-slate-900/95 border-orange-500/50 shadow-2xl shadow-orange-950/40 -translate-y-1"
                  : "bg-slate-950/80 border-white/10 shadow-lg hover:border-white/20"
              }`}
            >
              {/* Subtle top glow bar */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 opacity-60 group-hover:opacity-100 transition-opacity" />

              <div className="space-y-4">
                {/* Meta Header */}
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-1 rounded-full bg-orange-500/20 text-orange-300 border border-orange-500/30 text-[10px] font-mono-tech font-bold uppercase tracking-wider">
                    {workout.category}
                  </span>
                  <span className="text-[11px] font-mono-tech text-slate-400">
                    {workout.level}
                  </span>
                </div>

                {/* Title & Description */}
                <div>
                  <h3 className="text-lg font-bold text-white font-display tracking-tight group-hover:text-orange-400 transition-colors">
                    {workout.title}
                  </h3>
                  <p className="text-xs text-slate-400 mt-1.5 leading-relaxed line-clamp-2">
                    {workout.description}
                  </p>
                </div>

                {/* Duration & Calories Telemetry */}
                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-white/5">
                  <div className="flex items-center gap-2 text-xs font-mono-tech text-slate-300">
                    <Timer className="w-4 h-4 text-orange-400" />
                    <span>{workout.duration} Minutes</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs font-mono-tech text-slate-300">
                    <Flame className="w-4 h-4 text-rose-400" />
                    <span>{workout.calories} kcal</span>
                  </div>
                </div>

                {/* Target Muscle Groups Pills */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {workout.muscleGroups.map((m) => (
                    <button
                      key={m}
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectMuscle(m);
                      }}
                      className="px-2.5 py-0.5 rounded-full bg-white/5 hover:bg-orange-500/20 text-[10px] font-mono-tech text-slate-300 hover:text-orange-300 transition-colors border border-white/5"
                    >
                      {m}
                    </button>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-5 flex items-center justify-between border-t border-white/5 mt-4">
                <button
                  onClick={() => onSelectMuscle(workout.primaryMuscle)}
                  className="text-xs font-mono-tech text-orange-400 hover:text-orange-300 flex items-center gap-1 cursor-pointer transition-colors"
                >
                  <span>Inspect 3D Anatomy</span>
                </button>

                <button
                  onClick={() => onStartWorkout(workout)}
                  className="px-4 py-1.5 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-white text-xs font-bold shadow-md shadow-orange-500/30 flex items-center gap-1.5 cursor-pointer transition-all active:scale-95"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>Start</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
