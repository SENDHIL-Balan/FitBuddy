import React, { useState, useEffect } from "react";
import Header from "./components/Header.tsx";
import BottomNavBar, { FitnessTab } from "./components/BottomNavBar.tsx";
import AthleteSilhouette3D from "./components/AthleteSilhouette3D.tsx";
import PerformanceDashboard3D from "./components/PerformanceDashboard3D.tsx";
import WorkoutCards3D from "./components/WorkoutCards3D.tsx";
import BodyMuscleViewer3D from "./components/BodyMuscleViewer3D.tsx";
import WorkoutGeneratorSection from "./components/WorkoutGeneratorSection.tsx";
import AiCoachSection from "./components/AiCoachSection.tsx";

// WebClone Studio components for existing functionality preservation
import UrlInputHero from "./components/UrlInputHero.tsx";
import AgentActivityPanel from "./components/AgentActivityPanel.tsx";
import ProjectAnalysisView from "./components/ProjectAnalysisView.tsx";
import FileExplorer from "./components/FileExplorer.tsx";
import LivePreviewPanel from "./components/LivePreviewPanel.tsx";
import AiChatPanel from "./components/AiChatPanel.tsx";

import { WebsiteAnalysis, ProjectMetadata, AgentLog, GeneratedPlan } from "./types.ts";
import {
  Layers,
  FolderCode,
  Terminal,
  AlertCircle,
  Zap,
  Sparkles,
  ArrowRight,
  Shield,
  Activity,
  Flame,
  Heart,
  Calendar,
  Dumbbell,
  Timer,
  CheckCircle2,
  TrendingUp,
  Droplets,
  Crown,
  Play
} from "lucide-react";

export default function App() {
  // Navigation & Flow State
  const [hasEntered, setHasEntered] = useState<boolean>(false);
  const [activeView, setActiveView] = useState<"fitness" | "studio">("fitness");
  const [fitnessTab, setFitnessTab] = useState<FitnessTab>("workouts");
  const [selectedMuscle, setSelectedMuscle] = useState<string | null>("Chest");

  // Sub-view toggle in Workouts tab: Plans, 3D Anatomy, AI Generator
  const [workoutsSubView, setWorkoutsSubView] = useState<"plans" | "anatomy" | "generator">("plans");

  // WebClone Agent Studio State (preserves all existing website reconstruction features)
  const [projects, setProjects] = useState<ProjectMetadata[]>([]);
  const [currentProject, setCurrentProject] = useState<ProjectMetadata | null>(null);
  const [analysis, setAnalysis] = useState<WebsiteAnalysis | null>(null);
  const [files, setFiles] = useState<Record<string, string>>({});
  const [selectedFile, setSelectedFile] = useState<string>("src/App.tsx");
  const [logs, setLogs] = useState<AgentLog[]>([]);
  const [currentUrl, setCurrentUrl] = useState<string>("");

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isModifying, setIsModifying] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [reloadKey, setReloadKey] = useState<number>(1);
  const [leftTab, setLeftTab] = useState<"analysis" | "files" | "logs">("analysis");

  const [modifiedFiles, setModifiedFiles] = useState<string[]>([]);
  const [lastExplanation, setLastExplanation] = useState<string>("");

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const res = await fetch("/api/projects");
      if (res.ok) {
        const data = await res.json();
        setProjects(data);
      }
    } catch {
      // Ignore
    }
  };

  // Studio handlers
  const handleSelectProject = async (id: string) => {
    setError(null);
    try {
      const res = await fetch(`/api/projects/${id}`);
      if (!res.ok) throw new Error("Could not load project");
      const data = await res.json();

      setCurrentProject(data.metadata);
      setAnalysis(data.analysis);
      setFiles(data.files || {});
      setLogs(data.logs || []);
      setCurrentUrl(data.metadata.url);
      setSelectedFile("src/App.tsx");
      setReloadKey((prev) => prev + 1);
      setActiveView("studio");
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleAnalyze = async (url: string) => {
    setError(null);
    setIsLoading(true);
    setCurrentUrl(url);
    setLogs([]);
    setFiles({});
    setAnalysis(null);
    setCurrentProject(null);

    try {
      const analyzeRes = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });

      const analyzeData = await analyzeRes.json();
      if (!analyzeRes.ok) {
        throw new Error(analyzeData.error || "Failed to analyze target website.");
      }

      setAnalysis(analyzeData.analysis);
      setCurrentProject(analyzeData.metadata);
      setLogs(analyzeData.logs || []);
      const projectId = analyzeData.projectId;

      const genRes = await fetch(`/api/projects/${projectId}/generate`, {
        method: "POST",
      });

      const genData = await genRes.json();
      if (!genRes.ok) {
        throw new Error(genData.error || "Failed to generate React frontend.");
      }

      setFiles(genData.files || {});
      setLogs(genData.logs || []);
      setCurrentProject(genData.metadata);
      setSelectedFile("src/App.tsx");
      setReloadKey((prev) => prev + 1);
      fetchProjects();
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred during reconstruction.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleModify = async (prompt: string) => {
    if (!currentProject) return;
    setIsModifying(true);
    setError(null);

    try {
      const res = await fetch(`/api/projects/${currentProject.id}/modify`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to modify website code.");
      }

      setFiles(data.files || files);
      setLogs(data.logs || logs);
      setCurrentProject(data.metadata || currentProject);
      setModifiedFiles(data.modifiedFiles || []);
      setLastExplanation(data.explanation || "");

      if (data.modifiedFiles?.length > 0 && !data.modifiedFiles.includes(selectedFile)) {
        setSelectedFile(data.modifiedFiles[0]);
      }

      setReloadKey((prev) => prev + 1);
    } catch (err: any) {
      setError(err.message || "Code modification failed.");
      throw err;
    } finally {
      setIsModifying(false);
    }
  };

  const handleNewProject = () => {
    setCurrentProject(null);
    setAnalysis(null);
    setFiles({});
    setLogs([]);
    setError(null);
    setCurrentUrl("");
    setActiveView("studio");
  };

  // Entrance handler: User clicks Get Started or swiped
  const handleEnterApp = () => {
    setHasEntered(true);
    setFitnessTab("workouts");
  };

  return (
    <div className="flex flex-col min-h-screen w-screen bg-[#07080b] text-slate-100 font-sans selection:bg-orange-500 selection:text-white">
      {/* ======================================================== */}
      {/* 1. ENTRANCE SCREEN (The first thing the user sees!)      */}
      {/* ======================================================== */}
      {!hasEntered && activeView === "fitness" ? (
        <div className="relative min-h-screen w-full flex flex-col justify-between bg-[#08090d] overflow-hidden select-none animate-in fade-in duration-300">
          {/* Subtle Ambient Glow */}
          <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] bg-orange-500/10 rounded-full blur-[140px] pointer-events-none -z-10" />

          {/* Minimal Top Bar */}
          <header className="px-6 py-5 flex items-center justify-between z-30">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-amber-500 to-orange-500 flex items-center justify-center text-white shadow-md shadow-orange-500/30">
                <Zap className="w-4 h-4 fill-white" />
              </div>
              <span className="font-extrabold text-sm tracking-tight text-white font-display">
                FITBUDDY AI
              </span>
              <span className="px-1.5 py-0.5 text-[8px] font-bold uppercase rounded-md bg-orange-500/10 text-orange-400 border border-orange-500/30">
                PRO 3D
              </span>
            </div>

            <button
              onClick={handleEnterApp}
              className="text-xs font-mono-tech text-slate-400 hover:text-orange-400 transition-colors cursor-pointer flex items-center gap-1"
            >
              <span>Skip Entrance</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </header>

          {/* 3D Muscular Human Running Mannequin with Active Glowing Muscles & Callout Pins */}
          <div className="flex-1 w-full relative flex items-center justify-center">
            <AthleteSilhouette3D
              onGetStarted={handleEnterApp}
              showOverlayUI={true}
            />
          </div>

          {/* Bottom subtle prompt */}
          <footer className="py-4 text-center text-[11px] font-mono-tech text-slate-500">
            <span>Click "Get Started" to enter your personalized fitness experience</span>
          </footer>
        </div>
      ) : (
        /* ======================================================== */
        /* 2. MAIN APPLICATION (All Pages & Features After Entrance) */
        /* ======================================================== */
        <>
          {/* Global Sticky Header */}
          <Header
            currentProject={currentProject}
            projects={projects}
            onSelectProject={handleSelectProject}
            onNewProject={handleNewProject}
            isWorking={isLoading || isModifying}
            activeView={activeView}
            onSwitchView={setActiveView}
            activeFitnessTab={fitnessTab}
            onSelectFitnessTab={(tab) => {
              if (tab === "home") {
                setHasEntered(false);
              } else {
                setFitnessTab(tab);
              }
            }}
          />

          {/* Global Error Banner */}
          {error && !isLoading && (
            <div className="bg-rose-500/10 border-b border-rose-500/30 px-4 py-2 flex items-center justify-between text-xs text-rose-300 z-40">
              <div className="flex items-center gap-2 max-w-5xl mx-auto">
                <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0" />
                <span>{error}</span>
              </div>
              <button
                onClick={() => setError(null)}
                className="text-slate-400 hover:text-white text-xs font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>
          )}

          {activeView === "fitness" && (
            <main className="flex-1 w-full bg-[#08090d] pb-28 md:pb-16">
              {/* ======================================================== */}
              {/* PAGE 1: WORKOUT PLAN (One Step Closer To Your Goal)     */}
              {/* ======================================================== */}
              {fitnessTab === "workouts" && (
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-in fade-in duration-300">
                  {/* Top Sub-Bar: Switch between Workout Plans, 3D Anatomy & AI Generator */}
                  <div className="flex items-center gap-2 border-b border-white/10 pb-4 overflow-x-auto no-scrollbar">
                    <button
                      onClick={() => setWorkoutsSubView("plans")}
                      className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer flex items-center gap-2 ${
                        workoutsSubView === "plans"
                          ? "bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-md shadow-orange-500/30"
                          : "bg-slate-900 text-slate-400 hover:text-white border border-white/5"
                      }`}
                    >
                      <Calendar className="w-3.5 h-3.5" />
                      <span>Workout Plans</span>
                    </button>

                    <button
                      onClick={() => setWorkoutsSubView("anatomy")}
                      className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer flex items-center gap-2 ${
                        workoutsSubView === "anatomy"
                          ? "bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-md shadow-orange-500/30"
                          : "bg-slate-900 text-slate-400 hover:text-white border border-white/5"
                      }`}
                    >
                      <Activity className="w-3.5 h-3.5" />
                      <span>3D Muscle Anatomy Human</span>
                    </button>

                    <button
                      onClick={() => setWorkoutsSubView("generator")}
                      className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer flex items-center gap-2 ${
                        workoutsSubView === "generator"
                          ? "bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-md shadow-orange-500/30"
                          : "bg-slate-900 text-slate-400 hover:text-white border border-white/5"
                      }`}
                    >
                      <Sparkles className="w-3.5 h-3.5 text-orange-400" />
                      <span>AI Workout Generator</span>
                    </button>
                  </div>

                  {/* Sub-View 1: Workout Plans */}
                  {workoutsSubView === "plans" && (
                    <WorkoutCards3D
                      onSelectMuscle={(m) => {
                        setSelectedMuscle(m);
                        setWorkoutsSubView("anatomy");
                      }}
                      onStartWorkout={(_w) => {
                        setWorkoutsSubView("generator");
                      }}
                      onOpenAiGenerator={() => setWorkoutsSubView("generator")}
                    />
                  )}

                  {/* Sub-View 2: 3D Anatomical Human (Interactive body highlighting selected muscles) */}
                  {workoutsSubView === "anatomy" && (
                    <BodyMuscleViewer3D
                      activeMuscleFilter={selectedMuscle}
                      onSelectMuscle={(m) => setSelectedMuscle(m)}
                      onStartMuscleWorkout={(_m) => setWorkoutsSubView("generator")}
                    />
                  )}

                  {/* Sub-View 3: AI Workout Generator */}
                  {workoutsSubView === "generator" && (
                    <WorkoutGeneratorSection
                      onStartCustomPlan={(_plan: GeneratedPlan) => {
                        setFitnessTab("coach");
                      }}
                    />
                  )}
                </div>
              )}

              {/* ======================================================== */}
              {/* PAGE 2: FITNESS DASHBOARD & WELLNESS                    */}
              {/* ======================================================== */}
              {fitnessTab === "progress" && (
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-in fade-in duration-300">
                  <PerformanceDashboard3D />
                </div>
              )}

              {/* ======================================================== */}
              {/* PAGE 3: AI COACH (Conversational Intelligence)          */}
              {/* ======================================================== */}
              {fitnessTab === "coach" && (
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-in fade-in duration-300">
                  <AiCoachSection />
                </div>
              )}

              {/* Footer */}
              <footer className="border-t border-white/10 bg-[#0c0f17] py-10 px-4 sm:px-6 lg:px-8 text-xs text-slate-500 font-mono-tech mt-12">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-amber-500 to-orange-500 flex items-center justify-center text-white">
                      <Zap className="w-4 h-4 fill-white" />
                    </div>
                    <div>
                      <span className="font-extrabold text-white text-sm font-display tracking-tight">FITBUDDY AI</span>
                      <p className="text-[11px] text-slate-400">Your intelligent fitness companion</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-6">
                    <button
                      onClick={() => setHasEntered(false)}
                      className="hover:text-orange-400 transition-colors cursor-pointer"
                    >
                      Entrance
                    </button>
                    <button
                      onClick={() => {
                        setFitnessTab("workouts");
                        setWorkoutsSubView("plans");
                      }}
                      className="hover:text-orange-400 transition-colors cursor-pointer"
                    >
                      Workouts
                    </button>
                    <button
                      onClick={() => {
                        setFitnessTab("workouts");
                        setWorkoutsSubView("anatomy");
                      }}
                      className="hover:text-orange-400 transition-colors cursor-pointer"
                    >
                      3D Anatomy
                    </button>
                    <button
                      onClick={() => setFitnessTab("progress")}
                      className="hover:text-orange-400 transition-colors cursor-pointer"
                    >
                      Wellness
                    </button>
                    <button
                      onClick={() => setFitnessTab("coach")}
                      className="hover:text-orange-400 transition-colors cursor-pointer text-orange-400"
                    >
                      AI Coach
                    </button>
                    <button
                      onClick={() => setActiveView("studio")}
                      className="hover:text-orange-400 transition-colors cursor-pointer flex items-center gap-1 text-slate-300"
                    >
                      <FolderCode className="w-3.5 h-3.5" />
                      <span>Studio</span>
                    </button>
                  </div>

                  <div>
                    <span>© {new Date().getFullYear()} FitBuddy AI. Warm Luxury Biomechanical Edition.</span>
                  </div>
                </div>
              </footer>
            </main>
          )}

          {/* Floating Pill Bottom Navigation Bar */}
          {activeView === "fitness" && (
            <BottomNavBar
              activeTab={fitnessTab}
              onSelectTab={(tab) => {
                if (tab === "home") {
                  setHasEntered(false);
                } else {
                  setFitnessTab(tab);
                }
              }}
            />
          )}

          {/* VIEW 2: WEBCLONE AI AGENT STUDIO (Preserved functionality) */}
          {activeView === "studio" && (
            <div className="flex-1 flex flex-col h-[calc(100vh-4rem)] overflow-hidden">
              {isLoading ? (
                <div className="flex-1 overflow-y-auto">
                  <AgentActivityPanel
                    logs={logs}
                    status={currentProject?.status || "analyzing"}
                    currentUrl={currentUrl}
                    error={error}
                  />
                </div>
              ) : !currentProject || Object.keys(files).length === 0 ? (
                <div className="flex-1 overflow-y-auto">
                  <UrlInputHero onAnalyze={handleAnalyze} isLoading={isLoading} />
                </div>
              ) : (
                <div className="flex-1 flex flex-col md:flex-row w-full h-full overflow-hidden">
                  {/* LEFT COLUMN: Project Info / File Explorer / Logs (Tabbed) */}
                  <div className="w-full md:w-80 lg:w-96 flex flex-col h-full bg-slate-900 border-r border-slate-800 flex-shrink-0">
                    <div className="flex items-center border-b border-slate-800 bg-slate-950/80 p-1 text-xs">
                      <button
                        onClick={() => setLeftTab("analysis")}
                        className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-md font-medium transition-colors cursor-pointer ${
                          leftTab === "analysis"
                            ? "bg-slate-800 text-orange-400 font-semibold"
                            : "text-slate-400 hover:text-white"
                        }`}
                      >
                        <Layers className="w-3.5 h-3.5" />
                        <span>Blueprint</span>
                      </button>

                      <button
                        onClick={() => setLeftTab("files")}
                        className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-md font-medium transition-colors cursor-pointer ${
                          leftTab === "files"
                            ? "bg-slate-800 text-orange-400 font-semibold"
                            : "text-slate-400 hover:text-white"
                        }`}
                      >
                        <FolderCode className="w-3.5 h-3.5" />
                        <span>Files</span>
                      </button>

                      <button
                        onClick={() => setLeftTab("logs")}
                        className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-md font-medium transition-colors cursor-pointer ${
                          leftTab === "logs"
                            ? "bg-slate-800 text-orange-400 font-semibold"
                            : "text-slate-400 hover:text-white"
                        }`}
                      >
                        <Terminal className="w-3.5 h-3.5" />
                        <span>Logs ({logs.length})</span>
                      </button>
                    </div>

                    <div className="flex-1 overflow-hidden">
                      {leftTab === "analysis" && analysis && (
                        <ProjectAnalysisView analysis={analysis} />
                      )}
                      {leftTab === "files" && (
                        <FileExplorer
                          files={files}
                          selectedFile={selectedFile}
                          onSelectFile={(f) => setSelectedFile(f)}
                        />
                      )}
                      {leftTab === "logs" && (
                        <div className="p-3 space-y-2 overflow-y-auto h-full text-xs font-mono">
                          {logs.map((log) => (
                            <div
                              key={log.id}
                              className="p-2 rounded bg-slate-950/80 border border-slate-800/80 space-y-0.5"
                            >
                              <div className="flex items-center justify-between text-[10px] text-slate-400">
                                <span className="text-orange-400 font-bold uppercase">
                                  [{log.stage}]
                                </span>
                                <span>{log.timestamp}</span>
                              </div>
                              <p className="text-slate-300">{log.message}</p>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* RIGHT COLUMN: Live Preview & Chat Modification */}
                  <div className="flex-1 flex flex-col h-full overflow-hidden bg-slate-950">
                    <div className="flex-1 relative overflow-hidden">
                      <LivePreviewPanel
                        projectId={currentProject.id}
                        files={files}
                        selectedFile={selectedFile}
                        reloadKey={reloadKey}
                        onReload={() => setReloadKey((prev) => prev + 1)}
                      />
                    </div>

                    {/* AI Chat Drawer at Bottom of Studio */}
                    <div className="h-64 border-t border-slate-800 bg-slate-900/95 flex-shrink-0">
                      <AiChatPanel
                        onModify={handleModify}
                        isModifying={isModifying}
                        lastExplanation={lastExplanation}
                        modifiedFiles={modifiedFiles}
                        error={error}
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}
