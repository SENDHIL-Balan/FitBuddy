import React, { useState } from "react";
import { GeneratedPlan, WorkoutExerciseItem } from "../types.ts";
import { Sparkles, Brain, CheckCircle2, Loader2, ArrowRight, Play, Zap, Target, Dumbbell, Flame, Shield, Compass } from "lucide-react";

interface WorkoutGeneratorSectionProps {
  onStartCustomPlan?: (plan: GeneratedPlan) => void;
}

export default function WorkoutGeneratorSection({ onStartCustomPlan }: WorkoutGeneratorSectionProps) {
  const [goal, setGoal] = useState("Hypertrophy & Muscle Growth");
  const [experience, setExperience] = useState("Intermediate");
  const [equipment, setEquipment] = useState("Full Commercial Gym");
  const [duration, setDuration] = useState<number>(45);
  const [daysPerWeek, setDaysPerWeek] = useState<number>(4);
  const [focusArea, setFocusArea] = useState("Chest & Triceps");

  const [isGenerating, setIsGenerating] = useState(false);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [generatedPlan, setGeneratedPlan] = useState<GeneratedPlan | null>(null);
  const [error, setError] = useState<string | null>(null);

  const goalOptions = [
    { id: "Hypertrophy & Muscle Growth", label: "Hypertrophy & Growth", desc: "Targeted volume & fiber overload" },
    { id: "Maximum Strength & Power", label: "Max Strength & Power", desc: "High load neurological recruitment" },
    { id: "Athletic Speed & Conditioning", label: "Speed & Conditioning", desc: "Kinetic velocity & VO2 max" },
    { id: "Fat Loss & High Metabolic Output", label: "Metabolic Fat Loss", desc: "Density training & caloric output" },
    { id: "Joint Mobility & Active Recovery", label: "Mobility & Recovery", desc: "Myofascial length & joint health" },
  ];

  const experienceOptions = [
    { id: "Beginner", label: "Beginner", desc: "0 - 1 Years Training" },
    { id: "Intermediate", label: "Intermediate", desc: "1 - 3 Years Training" },
    { id: "Advanced", label: "Advanced", desc: "3 - 6 Years Training" },
    { id: "Elite Athlete", label: "Elite Athlete", desc: "6+ Years Competition" },
  ];

  const equipmentOptions = [
    { id: "Full Commercial Gym", label: "Full Commercial Gym", desc: "Barbells, cables & machines" },
    { id: "Dumbbells & Adjustable Bench", label: "Dumbbells & Bench", desc: "Free weights & incline bench" },
    { id: "Bodyweight & Calisthenics", label: "Calisthenics Only", desc: "Bodyweight, pull-up bar & rings" },
    { id: "Kettlebells & Resistance Bands", label: "Kettlebells & Bands", desc: "Functional dynamic loads" },
    { id: "Home Gym Garage Setup", label: "Home Gym Setup", desc: "Power rack, barbell & plates" },
  ];

  const focusOptions = [
    { id: "Chest & Triceps", label: "Chest & Triceps", tag: "Push Kinetic" },
    { id: "Back & Biceps", label: "Back & Biceps", tag: "Pull Kinetic" },
    { id: "Quadriceps & Glutes", label: "Quadriceps & Glutes", tag: "Legs Power" },
    { id: "Full Body Athletic", label: "Full Body Compound", tag: "Total Kinetic" },
    { id: "Shoulders & Abs", label: "Shoulders & Abs", tag: "Upper & Core" },
  ];

  const steps = [
    "Analyzing physiological profile & recovery status...",
    "Understanding metabolic goal & kinetic curves...",
    "Optimizing exercise sequence & biomechanical tension...",
    "Calibrating rest intervals & neuromuscular RPE ratings...",
    "Synthesizing personalized 3D training protocol...",
  ];

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsGenerating(true);
    setCurrentStepIndex(0);
    setError(null);
    setGeneratedPlan(null);

    // Step cycle interval
    const stepInterval = setInterval(() => {
      setCurrentStepIndex((prev) => {
        if (prev < steps.length - 1) return prev + 1;
        return prev;
      });
    }, 700);

    try {
      const res = await fetch("/api/fitness/generate-workout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          goal,
          experience,
          equipment,
          duration,
          daysPerWeek,
          focusMuscles: [focusArea],
        }),
      });

      clearInterval(stepInterval);

      if (!res.ok) {
        throw new Error("Workout generation request failed.");
      }

      const plan: GeneratedPlan = await res.json();
      setCurrentStepIndex(steps.length - 1);
      setTimeout(() => {
        setGeneratedPlan(plan);
        setIsGenerating(false);
      }, 500);
    } catch (err: any) {
      clearInterval(stepInterval);
      setError(err.message || "Failed to generate workout.");
      setIsGenerating(false);
    }
  };

  return (
    <div id="generator" className="w-full glass-panel rounded-3xl p-5 sm:p-8 md:p-10 border border-white/10 shadow-2xl relative overflow-hidden">
      {/* Background Glows */}
      <div className="absolute top-1/2 left-1/4 w-96 h-96 bg-cyan-600/10 rounded-full blur-3xl pointer-events-none -z-10" />

      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <span className="text-[11px] font-mono-tech uppercase font-bold text-cyan-400 tracking-wider">
              Autonomous Synthesis Engine
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white tracking-tight font-display">
            AI Workout Generator
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl leading-relaxed">
            Select your training parameters below. FitBuddy AI's kinesiology model will assemble a hyper-customized workout plan with exercise biomechanics, rest intervals, and volume parameters.
          </p>
        </div>

        <div className="px-3.5 py-1.5 rounded-xl bg-slate-900 border border-white/10 text-xs font-mono-tech text-slate-300 self-start md:self-auto flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
          <span>Model: <strong className="text-cyan-400">Gemini 3.8 Flash</strong></span>
        </div>
      </div>

      {/* Main Generator Form with CLEAR VISIBLE OPTIONS */}
      <div className="pt-6">
        <form onSubmit={handleGenerate} className="space-y-6">
          {/* ROW 1: Goal & Experience */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* 1. Goal Options */}
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-mono-tech uppercase font-bold text-slate-200 flex items-center gap-2">
                  <span className="w-5 h-5 rounded-md bg-blue-600/30 text-cyan-400 flex items-center justify-center text-[10px]">1</span>
                  <span>Training Goal</span>
                </label>
                <span className="text-[11px] font-mono-tech text-cyan-400 font-medium truncate max-w-[200px]">
                  {goal}
                </span>
              </div>

              {/* Clickable Option Cards - Fully visible at all times */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {goalOptions.map((opt) => {
                  const isSelected = goal === opt.id;
                  return (
                    <button
                      type="button"
                      key={opt.id}
                      onClick={() => setGoal(opt.id)}
                      disabled={isGenerating}
                      className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                        isSelected
                          ? "bg-gradient-to-r from-blue-600/30 to-cyan-500/20 border-cyan-400 text-white shadow-md shadow-cyan-950/40"
                          : "bg-slate-900/80 border-white/5 text-slate-300 hover:text-white hover:bg-slate-850 hover:border-white/15"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold font-display">{opt.label}</span>
                        {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 flex-shrink-0" />}
                      </div>
                      <p className="text-[10px] text-slate-400 mt-0.5 line-clamp-1">{opt.desc}</p>
                    </button>
                  );
                })}
              </div>

              {/* Fallback Native Select (with explicit dark contrast) */}
              <select
                value={goal}
                onChange={(e) => setGoal(e.target.value)}
                disabled={isGenerating}
                style={{ colorScheme: "dark" }}
                className="w-full mt-1 px-3 py-2 bg-slate-900 text-slate-200 border border-white/10 rounded-xl text-xs focus:outline-none focus:border-cyan-500 cursor-pointer [color-scheme:dark]"
              >
                {goalOptions.map((opt) => (
                  <option key={opt.id} value={opt.id} className="bg-slate-900 text-white py-1.5">
                    {opt.id}
                  </option>
                ))}
              </select>
            </div>

            {/* 2. Experience Level */}
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-mono-tech uppercase font-bold text-slate-200 flex items-center gap-2">
                  <span className="w-5 h-5 rounded-md bg-blue-600/30 text-cyan-400 flex items-center justify-center text-[10px]">2</span>
                  <span>Experience Level</span>
                </label>
                <span className="text-[11px] font-mono-tech text-cyan-400 font-medium">
                  {experience}
                </span>
              </div>

              {/* Clickable Option Cards */}
              <div className="grid grid-cols-2 gap-2">
                {experienceOptions.map((opt) => {
                  const isSelected = experience === opt.id;
                  return (
                    <button
                      type="button"
                      key={opt.id}
                      onClick={() => setExperience(opt.id)}
                      disabled={isGenerating}
                      className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                        isSelected
                          ? "bg-gradient-to-r from-blue-600/30 to-cyan-500/20 border-cyan-400 text-white shadow-md shadow-cyan-950/40"
                          : "bg-slate-900/80 border-white/5 text-slate-300 hover:text-white hover:bg-slate-850 hover:border-white/15"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold font-display">{opt.label}</span>
                        {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 flex-shrink-0" />}
                      </div>
                      <p className="text-[10px] text-slate-400 mt-0.5">{opt.desc}</p>
                    </button>
                  );
                })}
              </div>

              {/* Fallback Native Select */}
              <select
                value={experience}
                onChange={(e) => setExperience(e.target.value)}
                disabled={isGenerating}
                style={{ colorScheme: "dark" }}
                className="w-full mt-1 px-3 py-2 bg-slate-900 text-slate-200 border border-white/10 rounded-xl text-xs focus:outline-none focus:border-cyan-500 cursor-pointer [color-scheme:dark]"
              >
                {experienceOptions.map((opt) => (
                  <option key={opt.id} value={opt.id} className="bg-slate-900 text-white py-1.5">
                    {opt.id} ({opt.desc})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* ROW 2: Equipment & Focus Target */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* 3. Available Equipment */}
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-mono-tech uppercase font-bold text-slate-200 flex items-center gap-2">
                  <span className="w-5 h-5 rounded-md bg-blue-600/30 text-cyan-400 flex items-center justify-center text-[10px]">3</span>
                  <span>Available Equipment</span>
                </label>
                <span className="text-[11px] font-mono-tech text-cyan-400 font-medium truncate max-w-[200px]">
                  {equipment}
                </span>
              </div>

              {/* Clickable Option Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {equipmentOptions.map((opt) => {
                  const isSelected = equipment === opt.id;
                  return (
                    <button
                      type="button"
                      key={opt.id}
                      onClick={() => setEquipment(opt.id)}
                      disabled={isGenerating}
                      className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                        isSelected
                          ? "bg-gradient-to-r from-blue-600/30 to-cyan-500/20 border-cyan-400 text-white shadow-md shadow-cyan-950/40"
                          : "bg-slate-900/80 border-white/5 text-slate-300 hover:text-white hover:bg-slate-850 hover:border-white/15"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold font-display">{opt.label}</span>
                        {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 flex-shrink-0" />}
                      </div>
                      <p className="text-[10px] text-slate-400 mt-0.5 line-clamp-1">{opt.desc}</p>
                    </button>
                  );
                })}
              </div>

              {/* Fallback Native Select */}
              <select
                value={equipment}
                onChange={(e) => setEquipment(e.target.value)}
                disabled={isGenerating}
                style={{ colorScheme: "dark" }}
                className="w-full mt-1 px-3 py-2 bg-slate-900 text-slate-200 border border-white/10 rounded-xl text-xs focus:outline-none focus:border-cyan-500 cursor-pointer [color-scheme:dark]"
              >
                {equipmentOptions.map((opt) => (
                  <option key={opt.id} value={opt.id} className="bg-slate-900 text-white py-1.5">
                    {opt.id}
                  </option>
                ))}
              </select>
            </div>

            {/* 6. Focus Muscle Group */}
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-mono-tech uppercase font-bold text-slate-200 flex items-center gap-2">
                  <span className="w-5 h-5 rounded-md bg-blue-600/30 text-cyan-400 flex items-center justify-center text-[10px]">6</span>
                  <span>Target Muscle Focus</span>
                </label>
                <span className="text-[11px] font-mono-tech text-cyan-400 font-medium">
                  {focusArea}
                </span>
              </div>

              {/* Clickable Option Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {focusOptions.map((opt) => {
                  const isSelected = focusArea === opt.id;
                  return (
                    <button
                      type="button"
                      key={opt.id}
                      onClick={() => setFocusArea(opt.id)}
                      disabled={isGenerating}
                      className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                        isSelected
                          ? "bg-gradient-to-r from-blue-600/30 to-cyan-500/20 border-cyan-400 text-white shadow-md shadow-cyan-950/40"
                          : "bg-slate-900/80 border-white/5 text-slate-300 hover:text-white hover:bg-slate-850 hover:border-white/15"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold font-display">{opt.label}</span>
                        {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 flex-shrink-0" />}
                      </div>
                      <span className="inline-block mt-1 px-1.5 py-0.5 rounded bg-white/5 text-[9px] font-mono-tech text-cyan-300">
                        {opt.tag}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Fallback Native Select */}
              <select
                value={focusArea}
                onChange={(e) => setFocusArea(e.target.value)}
                disabled={isGenerating}
                style={{ colorScheme: "dark" }}
                className="w-full mt-1 px-3 py-2 bg-slate-900 text-slate-200 border border-white/10 rounded-xl text-xs focus:outline-none focus:border-cyan-500 cursor-pointer [color-scheme:dark]"
              >
                {focusOptions.map((opt) => (
                  <option key={opt.id} value={opt.id} className="bg-slate-900 text-white py-1.5">
                    {opt.label} ({opt.tag})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* ROW 3: Duration & Frequency Controls */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
            {/* 4. Target Duration */}
            <div className="p-4 rounded-2xl bg-slate-900/70 border border-white/5 space-y-2">
              <div className="flex justify-between items-center text-xs font-mono-tech">
                <span className="uppercase font-bold text-slate-200 flex items-center gap-1.5">
                  <span className="w-4 h-4 rounded bg-blue-600/30 text-cyan-400 flex items-center justify-center text-[10px]">4</span>
                  <span>Session Duration</span>
                </span>
                <span className="text-cyan-400 font-bold bg-cyan-500/10 px-2 py-0.5 rounded-md border border-cyan-500/20">
                  {duration} Minutes
                </span>
              </div>
              <div className="grid grid-cols-5 gap-2 pt-1">
                {[30, 45, 60, 75, 90].map((mins) => (
                  <button
                    type="button"
                    key={mins}
                    onClick={() => setDuration(mins)}
                    disabled={isGenerating}
                    className={`py-2 rounded-xl text-xs font-mono-tech transition-all cursor-pointer border text-center ${
                      duration === mins
                        ? "bg-blue-600 border-blue-400 text-white font-bold shadow-lg shadow-blue-600/30"
                        : "bg-slate-950 border-white/5 text-slate-400 hover:text-white hover:bg-slate-800"
                    }`}
                  >
                    {mins}m
                  </button>
                ))}
              </div>
            </div>

            {/* 5. Days Per Week */}
            <div className="p-4 rounded-2xl bg-slate-900/70 border border-white/5 space-y-2">
              <div className="flex justify-between items-center text-xs font-mono-tech">
                <span className="uppercase font-bold text-slate-200 flex items-center gap-1.5">
                  <span className="w-4 h-4 rounded bg-blue-600/30 text-cyan-400 flex items-center justify-center text-[10px]">5</span>
                  <span>Weekly Frequency</span>
                </span>
                <span className="text-cyan-400 font-bold bg-cyan-500/10 px-2 py-0.5 rounded-md border border-cyan-500/20">
                  {daysPerWeek} Days / Week
                </span>
              </div>
              <div className="grid grid-cols-4 gap-2 pt-1">
                {[3, 4, 5, 6].map((days) => (
                  <button
                    type="button"
                    key={days}
                    onClick={() => setDaysPerWeek(days)}
                    disabled={isGenerating}
                    className={`py-2 rounded-xl text-xs font-mono-tech transition-all cursor-pointer border text-center ${
                      daysPerWeek === days
                        ? "bg-blue-600 border-blue-400 text-white font-bold shadow-lg shadow-blue-600/30"
                        : "bg-slate-950 border-white/5 text-slate-400 hover:text-white hover:bg-slate-800"
                    }`}
                  >
                    {days} Days
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isGenerating}
              className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-blue-600 via-cyan-500 to-indigo-600 hover:opacity-95 active:scale-[0.99] text-white font-bold text-sm sm:text-base shadow-xl shadow-blue-600/30 transition-all flex items-center justify-center gap-3 cursor-pointer disabled:opacity-50"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Synthesizing Training Architecture...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  <span>Create My Workout With AI</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </form>

        {/* AI Generation State Checklist Animation */}
        {isGenerating && (
          <div className="mt-8 p-6 rounded-2xl bg-slate-950 border border-cyan-500/30 shadow-2xl space-y-4 animate-in fade-in">
            <div className="flex items-center gap-3 border-b border-white/10 pb-3">
              <Brain className="w-5 h-5 text-cyan-400 animate-pulse" />
              <span className="text-sm font-bold text-white font-display">
                FitBuddy Neural Synthesis Pipeline
              </span>
            </div>

            <div className="space-y-2.5">
              {steps.map((step, idx) => {
                const isPast = idx < currentStepIndex;
                const isCurrent = idx === currentStepIndex;
                return (
                  <div
                    key={idx}
                    className={`flex items-center gap-3 text-xs font-mono-tech transition-all duration-300 ${
                      isCurrent
                        ? "text-cyan-300 font-bold"
                        : isPast
                        ? "text-slate-400"
                        : "text-slate-600"
                    }`}
                  >
                    {isPast ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                    ) : isCurrent ? (
                      <Loader2 className="w-4 h-4 text-cyan-400 animate-spin flex-shrink-0" />
                    ) : (
                      <div className="w-4 h-4 rounded-full border border-slate-700 flex-shrink-0" />
                    )}
                    <span>{step}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Generated Plan Card Display */}
        {generatedPlan && !isGenerating && (
          <div className="mt-10 p-6 sm:p-8 rounded-3xl bg-slate-950 border border-cyan-500/40 shadow-2xl space-y-6 animate-in zoom-in-95 duration-400">
            {/* Plan Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
              <div>
                <span className="text-[10px] font-mono-tech uppercase font-bold text-cyan-400 tracking-wider">
                  Generated Protocol • {generatedPlan.splitName}
                </span>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight font-display mt-1">
                  {generatedPlan.title}
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Biomechanical Focus: {generatedPlan.biomechanicFocus}
                </p>
              </div>

              <div className="flex items-center gap-3">
                <div className="p-3 rounded-xl bg-slate-900 border border-white/5 text-center">
                  <div className="text-[10px] text-slate-500 font-mono-tech">Est. Cal</div>
                  <div className="text-base font-bold font-mono-tech text-rose-400">
                    {generatedPlan.estimatedCalories} kcal
                  </div>
                </div>
                <div className="p-3 rounded-xl bg-slate-900 border border-white/5 text-center">
                  <div className="text-[10px] text-slate-500 font-mono-tech">Duration</div>
                  <div className="text-base font-bold font-mono-tech text-cyan-400">
                    {generatedPlan.durationMinutes} min
                  </div>
                </div>
              </div>
            </div>

            {/* Warmup List */}
            <div className="p-4 rounded-xl bg-slate-900/60 border border-white/5 space-y-2">
              <span className="text-[11px] font-mono-tech uppercase font-bold text-slate-400">
                Warm-up Activation Sequence:
              </span>
              <div className="flex flex-wrap gap-2 text-xs text-slate-300">
                {generatedPlan.warmup.map((item, idx) => (
                  <span key={idx} className="px-2.5 py-1 rounded-md bg-slate-800 text-slate-200">
                    • {item}
                  </span>
                ))}
              </div>
            </div>

            {/* Exercises Table */}
            <div className="space-y-3">
              <span className="text-[11px] font-mono-tech uppercase font-bold text-slate-400 block">
                Primary Exercise Sequence ({generatedPlan.exercises.length} Movements)
              </span>

              <div className="space-y-2.5">
                {generatedPlan.exercises.map((ex, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-xl bg-slate-900/80 border border-white/5 hover:border-cyan-500/30 transition-all space-y-2"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="flex items-center gap-2.5">
                        <span className="w-6 h-6 rounded-md bg-blue-600/30 text-cyan-400 text-xs font-mono-tech font-bold flex items-center justify-center">
                          {idx + 1}
                        </span>
                        <h4 className="text-sm font-bold text-white font-display">
                          {ex.name}
                        </h4>
                        <span className="px-2 py-0.5 rounded-md bg-white/5 text-[10px] font-mono-tech text-cyan-300">
                          {ex.targetMuscle}
                        </span>
                      </div>

                      <div className="flex items-center gap-4 text-xs font-mono-tech text-slate-300">
                        <span>{ex.sets} Sets × {ex.reps}</span>
                        <span className="text-slate-500">Rest: {ex.restSeconds}s</span>
                        {ex.rpe && <span className="text-cyan-400">RPE: {ex.rpe}</span>}
                      </div>
                    </div>

                    <p className="text-xs text-slate-400 leading-relaxed pl-8">
                      <strong className="text-slate-300 font-medium">Kinetic Cue:</strong> {ex.cue}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Coach Notes */}
            <div className="p-4 rounded-xl bg-cyan-950/20 border border-cyan-500/25 space-y-1">
              <span className="text-[10px] font-mono-tech uppercase font-bold text-cyan-400">
                FitBuddy AI Coach Notes
              </span>
              <p className="text-xs text-slate-300 leading-relaxed">
                {generatedPlan.coachNotes}
              </p>
            </div>

            {/* Start Button */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => onStartCustomPlan?.(generatedPlan)}
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 active:scale-98 text-white font-semibold text-xs shadow-lg shadow-blue-600/30 transition-all flex items-center gap-2 cursor-pointer"
              >
                <Play className="w-4 h-4 fill-current" />
                <span>Start This Workout Now</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
