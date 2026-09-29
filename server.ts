import express from "express";
import path from "path";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";
import { scrapeWebsite } from "./server/services/scraper.ts";
import { analyzeWebsiteWithAI } from "./server/services/analyzer.ts";
import { ProjectStore } from "./server/services/projectStore.ts";
import { generateReactFrontend } from "./server/services/generator.ts";
import { validateAndRepairProject } from "./server/services/validator.ts";
import { modifyProjectWithAI } from "./server/services/modifier.ts";
import { bundleProjectForPreview } from "./server/services/bundler.ts";
import { chatWithFitnessCoach, generateAiWorkout } from "./server/services/fitnessAi.ts";

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json({ limit: "15mb" }));

// 1. Analyze Website Endpoint
app.post("/api/analyze", async (req, res) => {
  const { url } = req.body;
  if (!url || typeof url !== "string") {
    return res.status(400).json({ error: "Missing or invalid website URL parameter." });
  }

  try {
    // Fetch and parse website DOM
    const scraped = await scrapeWebsite(url);

    // AI-driven structural and aesthetic analysis
    const analysis = await analyzeWebsiteWithAI(scraped);

    // Initialize isolated workspace for this reconstruction
    const metadata = await ProjectStore.createProject(url, analysis);

    await ProjectStore.addLog(
      metadata.id,
      "ANALYZE",
      `Synthesized website architectural blueprint`,
      `Extracted theme (${analysis.theme.mood}), ${analysis.sections.length} sections, and responsive hierarchy.`,
      "success"
    );

    const updated = await ProjectStore.getProject(metadata.id);

    return res.json({
      projectId: metadata.id,
      analysis,
      metadata: updated?.metadata || metadata,
      logs: updated?.logs || [],
    });
  } catch (err: any) {
    console.error("Analysis failed:", err);
    return res.status(500).json({
      error: err.message || "Failed to analyze website. Please check the URL and try again.",
    });
  }
});

// 2. Generate React Project Endpoint
app.post("/api/projects/:id/generate", async (req, res) => {
  const { id } = req.params;
  const project = await ProjectStore.getProject(id);
  if (!project) {
    return res.status(404).json({ error: `Project ${id} not found.` });
  }

  try {
    await ProjectStore.updateStatus(id, "generating");
    await ProjectStore.addLog(
      id,
      "CODEGEN",
      "Generating modular React + TypeScript components...",
      `Planning components for ${project.analysis.sections.length} sections with Tailwind CSS and Lucide icons.`,
      "in_progress"
    );

    // Generate code
    const generated = await generateReactFrontend(project.analysis);

    // Save initial generated files
    await ProjectStore.saveProjectFiles(id, generated.files);

    await ProjectStore.addLog(
      id,
      "CODEGEN",
      `Generated ${Object.keys(generated.files).length} project files`,
      `Components: ${generated.componentPlan.join(", ")}`,
      "success"
    );

    // Run build validation and repair loop
    await ProjectStore.updateStatus(id, "validating");
    await ProjectStore.addLog(
      id,
      "VALIDATE",
      "Running compiler and AST build validation...",
      "Simulating TypeScript transpilation and checking component imports.",
      "in_progress"
    );

    const { files: validatedFiles, result: valResult } = await validateAndRepairProject(id, generated.files);

    await ProjectStore.saveProjectFiles(id, validatedFiles);

    if (valResult.valid) {
      await ProjectStore.addLog(
        id,
        "PREVIEW",
        "Live preview sandbox compiled and ready",
        "React virtual DOM mounted successfully. Ready for interactive inspection and modification.",
        "success"
      );
    }

    const updated = await ProjectStore.getProject(id);

    return res.json({
      success: valResult.valid,
      metadata: updated?.metadata,
      files: validatedFiles,
      logs: updated?.logs,
      validationResult: valResult,
    });
  } catch (err: any) {
    console.error("Code generation error:", err);
    await ProjectStore.addLog(id, "ERROR", `Code generation failed: ${err.message}`, undefined, "error");
    await ProjectStore.updateStatus(id, "error");
    return res.status(500).json({ error: err.message });
  }
});

// 3. AI Modification Endpoint
app.post("/api/projects/:id/modify", async (req, res) => {
  const { id } = req.params;
  const { prompt } = req.body;

  if (!prompt || typeof prompt !== "string" || !prompt.trim()) {
    return res.status(400).json({ error: "Missing natural language modification prompt." });
  }

  try {
    const result = await modifyProjectWithAI(id, prompt.trim());
    const updated = await ProjectStore.getProject(id);

    return res.json({
      ...result,
      metadata: updated?.metadata,
      files: updated?.files,
      logs: updated?.logs,
    });
  } catch (err: any) {
    console.error("Modification failed:", err);
    return res.status(500).json({ error: err.message || "Failed to modify project code." });
  }
});

// 4. Live Preview Bundle Endpoint
app.get("/api/projects/:id/preview", async (req, res) => {
  const { id } = req.params;
  try {
    const html = await bundleProjectForPreview(id);
    res.setHeader("Content-Type", "text/html; charset=utf-8");
    // Ensure iframe can render without strict X-Frame-Options blocking self
    res.setHeader("X-Frame-Options", "SAMEORIGIN");
    return res.send(html);
  } catch (err: any) {
    return res.status(500).send(`<h3>Preview Bundle Failed: ${err.message}</h3>`);
  }
});

// 5. Get Project Details
app.get("/api/projects/:id", async (req, res) => {
  const { id } = req.params;
  const project = await ProjectStore.getProject(id);
  if (!project) {
    return res.status(404).json({ error: `Project ${id} not found.` });
  }
  return res.json(project);
});

// 6. List Projects
app.get("/api/projects", async (_req, res) => {
  const list = await ProjectStore.listProjects();
  return res.json(list);
});

// ================= FITBUDDY AI ROUTES =================

// Fitness Coach Chat Endpoint
app.post("/api/fitness/chat", async (req, res) => {
  try {
    const { messages, userContext } = req.body;
    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: "Missing messages array." });
    }
    const result = await chatWithFitnessCoach(messages, userContext);
    return res.json(result);
  } catch (err: any) {
    console.error("Fitness chat route error:", err);
    return res.status(500).json({ error: err.message || "Failed to process coach query." });
  }
});

// Fitness Workout Generator Endpoint
app.post("/api/fitness/generate-workout", async (req, res) => {
  try {
    const { goal, experience, equipment, duration, daysPerWeek, focusMuscles } = req.body;
    const plan = await generateAiWorkout({
      goal: goal || "Hypertrophy & Strength",
      experience: experience || "Intermediate",
      equipment: equipment || "Full Commercial Gym",
      duration: Number(duration) || 45,
      daysPerWeek: Number(daysPerWeek) || 4,
      focusMuscles: Array.isArray(focusMuscles) ? focusMuscles : ["Chest", "Triceps"],
    });
    return res.json(plan);
  } catch (err: any) {
    console.error("Workout generation route error:", err);
    return res.status(500).json({ error: err.message || "Failed to generate workout plan." });
  }
});

// Fitness Telemetry Snapshot Endpoint
app.get("/api/fitness/telemetry", (_req, res) => {
  return res.json({
    athleteName: "Alex Mercer",
    status: "OPTIMAL_PRIMED",
    todayPerformance: {
      caloriesBurned: 642,
      targetCalories: 750,
      workoutMinutes: 48,
      targetMinutes: 60,
      streakDays: 12,
      activeHeartRate: 138,
      restingHeartRate: 52,
      vo2Max: 54.2,
      recoveryScore: 88,
      consistencyRate: 96,
      strainIndex: 14.8,
      steps: 8420,
    },
    weeklyVolume: [
      { day: "Mon", push: 14, pull: 0, legs: 0, calories: 590 },
      { day: "Tue", push: 0, pull: 16, legs: 0, calories: 620 },
      { day: "Wed", push: 0, pull: 0, legs: 18, calories: 710 },
      { day: "Thu", push: 0, pull: 0, legs: 0, calories: 340, activeRecovery: true },
      { day: "Fri", push: 12, pull: 12, legs: 0, calories: 680 },
      { day: "Sat", push: 0, pull: 0, legs: 16, calories: 642 },
      { day: "Sun", push: 0, pull: 0, legs: 0, calories: 290, planned: true },
    ],
    targetedMusclesState: {
      Chest: { activation: 94, status: "Peak Pump", soreness: "Mild", recoveryHours: 28 },
      Triceps: { activation: 88, status: "Trained", soreness: "Low", recoveryHours: 18 },
      Shoulders: { activation: 82, status: "Primed", soreness: "None", recoveryHours: 0 },
      Back: { activation: 45, status: "Recovering", soreness: "Moderate", recoveryHours: 14 },
      Biceps: { activation: 50, status: "Recovered", soreness: "None", recoveryHours: 0 },
      Core: { activation: 78, status: "Engaged", soreness: "Low", recoveryHours: 8 },
      Quadriceps: { activation: 60, status: "Ready", soreness: "None", recoveryHours: 0 },
      Hamstrings: { activation: 55, status: "Ready", soreness: "None", recoveryHours: 0 },
      Glutes: { activation: 62, status: "Ready", soreness: "None", recoveryHours: 0 },
      Calves: { activation: 70, status: "Conditioned", soreness: "None", recoveryHours: 0 },
    }
  });
});

// 7. Mount Vite Middleware or Serve Static
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static("dist"));
    app.get("*", (_req, res) => {
      res.sendFile(path.resolve("dist/index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`WebClone AI server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error("Fatal server start error:", err);
  process.exit(1);
});
