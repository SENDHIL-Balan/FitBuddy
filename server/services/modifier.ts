import { ai, GEMINI_MODEL } from "./gemini.ts";
import { ProjectStore } from "./projectStore.ts";
import { validateAndRepairProject } from "./validator.ts";

export interface ModificationResult {
  success: boolean;
  modifiedFiles: string[];
  explanation: string;
  errors?: string[];
}

export async function modifyProjectWithAI(projectId: string, userPrompt: string): Promise<ModificationResult> {
  const project = await ProjectStore.getProject(projectId);
  if (!project) {
    throw new Error(`Project ${projectId} not found`);
  }

  await ProjectStore.addLog(
    projectId,
    "MODIFY",
    `Received modification request: "${userPrompt}"`,
    `Analyzing project dependency graph...`,
    "in_progress"
  );

  const fileKeys = Object.keys(project.files);

  // Step 1: Identify affected files with minimal cost
  const planPrompt = `You are a Senior Frontend Engineer.
The user wants to make a modification to an existing React + Tailwind project:
REQUEST: "${userPrompt}"

EXISTING FILES IN PROJECT:
${fileKeys.join("\n")}

Determine which files must be modified or if a new component file needs to be created.
If a new section/component is needed, you must also include "src/App.tsx" to import and render it.

Respond ONLY with JSON:
{
  "affectedFiles": ["src/components/Navbar.tsx"],
  "createsNewFile": false,
  "explanation": "Brief 1-sentence explanation of what will be changed"
}`;

  let affectedFiles: string[] = [];
  let explanation = "Modifying requested components";

  try {
    const planRes = await ai.models.generateContent({
      model: GEMINI_MODEL,
      contents: planPrompt,
      config: {
        responseMimeType: "application/json",
        temperature: 0.1,
      },
    });

    const parsedPlan = JSON.parse(planRes.text?.trim().replace(/^```json\s*/, "").replace(/\s*```$/, "") || "{}");
    if (parsedPlan.affectedFiles && Array.isArray(parsedPlan.affectedFiles)) {
      affectedFiles = parsedPlan.affectedFiles;
      explanation = parsedPlan.explanation || explanation;
    }
  } catch (err: any) {
    console.warn("AI planning fallback, defaulting to inspect relevant components:", err.message);
  }

  // Fallback heuristic if AI planning returned empty
  if (affectedFiles.length === 0) {
    const pLower = userPrompt.toLowerCase();
    if (pLower.includes("nav") || pLower.includes("menu") || pLower.includes("header")) {
      affectedFiles.push("src/components/Navbar.tsx");
    } else if (pLower.includes("hero") || pLower.includes("headline")) {
      affectedFiles.push("src/components/Hero.tsx");
    } else if (pLower.includes("color") || pLower.includes("style") || pLower.includes("theme")) {
      affectedFiles.push("src/App.tsx", "src/components/Navbar.tsx", "src/components/Hero.tsx");
    } else {
      affectedFiles.push("src/App.tsx");
    }
  }

  await ProjectStore.addLog(
    projectId,
    "MODIFY",
    `Identified target file(s): ${affectedFiles.join(", ")}`,
    explanation,
    "info"
  );

  // Step 2: Build focused context (only relevant files)
  const filesContext: Record<string, string> = {};
  for (const f of affectedFiles) {
    if (project.files[f]) {
      filesContext[f] = project.files[f];
    }
  }
  // Include App.tsx summary if not already included
  if (!filesContext["src/App.tsx"] && project.files["src/App.tsx"]) {
    filesContext["src/App.tsx"] = project.files["src/App.tsx"];
  }

  // Step 3: Generate the precise code modification
  const modifyPrompt = `You are a Principal React Engineer executing a requested code change.
USER PROMPT: "${userPrompt}"

TARGET FILES CONTENT:
${JSON.stringify(filesContext, null, 2)}

ALL PROJECT FILE PATHS:
${fileKeys.join(", ")}

DESIGN TOKENS:
Primary: ${project.analysis.theme.primaryColor}, Background: ${project.analysis.theme.backgroundColor}

INSTRUCTIONS:
1. Apply the user's requested modification directly to the code.
2. If adding a new component, write the new component file and update "src/App.tsx" to import and render it in logical order.
3. Preserve all existing working functionality, responsiveness, and styles that are not meant to change.
4. Maintain valid TypeScript JSX and valid Lucide icon imports.
5. Return the COMPLETE updated code for all modified/created files.

Respond ONLY with valid JSON in this format:
{
  "explanation": "Summary of changes made",
  "files": {
    "src/components/...": "full new file content string",
    "src/App.tsx": "updated App.tsx if modified"
  }
}`;

  let updatedFiles: Record<string, string> = {};

  try {
    const modRes = await ai.models.generateContent({
      model: GEMINI_MODEL,
      contents: modifyPrompt,
      config: {
        responseMimeType: "application/json",
        temperature: 0.2,
      },
    });

    const parsedMod = JSON.parse(modRes.text?.trim().replace(/^```json\s*/, "").replace(/\s*```$/, "") || "{}");
    if (parsedMod.files && typeof parsedMod.files === "object") {
      updatedFiles = parsedMod.files;
      if (parsedMod.explanation) explanation = parsedMod.explanation;
    }
  } catch (err: any) {
    console.warn("Gemini code modification failed or quota reached. Engaging intelligent fallback modifier:", err.message);
    const fallbackResult = applyFallbackModification(userPrompt, project.files, project.analysis);
    if (fallbackResult) {
      updatedFiles = fallbackResult.files;
      explanation = fallbackResult.explanation;
    } else {
      throw new Error(`AI code modification encountered an issue: ${err.message}. Please retry or try a specific command like "Change primary color to blue" or "Add a testimonials section".`);
    }
  }

  if (Object.keys(updatedFiles).length === 0) {
    throw new Error("No file modifications were produced by the AI model. Please try refining your prompt.");
  }

  // Step 4: Merge changes into current project files
  const mergedFiles = { ...project.files, ...updatedFiles };

  // Step 5: Run validation and repair loop
  await ProjectStore.addLog(
    projectId,
    "VALIDATE",
    `Validating modified code with esbuild compiler...`,
    `Checking syntax & imports in ${Object.keys(updatedFiles).length} changed file(s)`,
    "in_progress"
  );

  const { files: validatedFiles, result: valResult } = await validateAndRepairProject(projectId, mergedFiles);

  // Save the validated files
  await ProjectStore.saveProjectFiles(projectId, validatedFiles);

  if (valResult.valid) {
    await ProjectStore.addLog(
      projectId,
      "PREVIEW",
      `Preview updated with modified changes`,
      `Modified files: ${Object.keys(updatedFiles).join(", ")}`,
      "success"
    );

    return {
      success: true,
      modifiedFiles: Object.keys(updatedFiles),
      explanation,
    };
  } else {
    return {
      success: false,
      modifiedFiles: Object.keys(updatedFiles),
      explanation: "Modification completed but build validation reported issues.",
      errors: valResult.errors,
    };
  }
}

/**
 * Intelligent deterministic code modifier used when LLM quota is reached
 * or for fast direct updates to requested components.
 */
function applyFallbackModification(
  userPrompt: string,
  existingFiles: Record<string, string>,
  analysis: any
): { files: Record<string, string>; explanation: string } | null {
  const p = userPrompt.toLowerCase();
  const modified: Record<string, string> = {};

  // 1. Color changes: e.g. "change color to blue", "make button color emerald", "set primary color to #6366F1"
  const colorMap: Record<string, string> = {
    blue: "#2563EB",
    indigo: "#4F46E5",
    emerald: "#059669",
    green: "#16A34A",
    purple: "#7C3AED",
    violet: "#8B5CF6",
    rose: "#E11D48",
    red: "#DC2626",
    amber: "#D97706",
    orange: "#EA580C",
    cyan: "#0891B2",
    teal: "#0D9488",
    sky: "#0284C7",
    pink: "#DB2777",
    dark: "#0F172A",
  };

  let targetColorHex: string | null = null;
  const hexMatch = userPrompt.match(/#[0-9a-fA-F]{3,8}/);
  if (hexMatch) {
    targetColorHex = hexMatch[0];
  } else {
    for (const [name, hex] of Object.entries(colorMap)) {
      if (new RegExp(`\\b${name}\\b`, "i").test(userPrompt)) {
        targetColorHex = hex;
        break;
      }
    }
  }

  if (targetColorHex && (p.includes("color") || p.includes("theme") || p.includes("primary") || p.includes("button"))) {
    const oldPrimary = analysis?.theme?.primaryColor || "#3B82F6";
    // Replace hex references across all files
    for (const [filePath, content] of Object.entries(existingFiles)) {
      if (filePath.endsWith(".tsx") || filePath.endsWith(".ts")) {
        let updated = content;
        if (oldPrimary && updated.includes(oldPrimary)) {
          updated = updated.split(oldPrimary).join(targetColorHex);
        }
        // Also look for common arbitrary tailwind bg colors
        updated = updated.replace(/bg-\[#[0-9a-fA-F]{6}\]/g, `bg-[${targetColorHex}]`);
        updated = updated.replace(/text-\[#[0-9a-fA-F]{6}\]/g, `text-[${targetColorHex}]`);
        updated = updated.replace(/shadow-\[#[0-9a-fA-F]{6}\]/g, `shadow-[${targetColorHex}]`);
        if (updated !== content) {
          modified[filePath] = updated;
        }
      }
    }
    if (Object.keys(modified).length > 0) {
      return {
        files: modified,
        explanation: `Updated primary color palette to ${targetColorHex} across affected components.`,
      };
    }
  }

  // 2. Make navbar sticky
  if (p.includes("sticky") || p.includes("navbar") || p.includes("nav")) {
    if (existingFiles["src/components/Navbar.tsx"]) {
      let nav = existingFiles["src/components/Navbar.tsx"];
      if (!nav.includes("sticky top-0")) {
        nav = nav.replace(/<header\s+className="([^"]*)"/, '<header className="sticky top-0 z-50 backdrop-blur-md $1"');
      } else {
        nav = nav.replace(/backdrop-blur-\w+/, "backdrop-blur-xl");
      }
      return {
        files: { "src/components/Navbar.tsx": nav },
        explanation: "Updated Navbar component with sticky positioning and frosted backdrop blur.",
      };
    }
  }

  // 3. Add Testimonials section
  if (p.includes("testimonial") || p.includes("reviews")) {
    const primary = targetColorHex || analysis?.theme?.primaryColor || "#2563EB";
    const testimonialsCode = `import React from 'react';
import { Star } from 'lucide-react';

export default function Testimonials() {
  const reviews = [
    { name: "Alex Rivera", role: "Product Director", text: "Incredible velocity and immaculate attention to responsive design." },
    { name: "Sophia Zhang", role: "Principal Engineer", text: "Zero layout shift, pristine modern aesthetics, and blazing speed." },
    { name: "Marcus Brody", role: "Creative Founder", text: "Completely elevated our brand presence beyond expectations." }
  ];

  return (
    <section id="testimonials" className="py-20 bg-slate-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-[${primary}]">Endorsements</span>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">Loved by industry leaders</h2>
          <p className="text-slate-400 text-sm">See how modern engineering teams build faster with confidence.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {reviews.map((r, i) => (
            <div key={i} className="p-8 rounded-2xl bg-slate-800/80 border border-slate-700 space-y-4">
              <div className="flex gap-1 text-amber-400">
                {[...Array(5)].map((_, idx) => <Star key={idx} className="w-4 h-4 fill-current" />)}
              </div>
              <p className="text-slate-300 italic text-sm">"{r.text}"</p>
              <div className="pt-4 border-t border-slate-700/60">
                <div className="font-bold text-white text-sm">{r.name}</div>
                <div className="text-xs text-slate-400">{r.role}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
`;
    modified["src/components/Testimonials.tsx"] = testimonialsCode;

    // Update App.tsx to include Testimonials
    if (existingFiles["src/App.tsx"]) {
      let app = existingFiles["src/App.tsx"];
      if (!app.includes("Testimonials")) {
        app = `import Testimonials from './components/Testimonials';\n` + app;
        app = app.replace(/<Footer\s*\/>/, `<Testimonials />\n        <Footer />`);
      }
      modified["src/App.tsx"] = app;
    }

    return {
      files: modified,
      explanation: "Created new Testimonials section component and registered it in App.tsx.",
    };
  }

  // 4. Add Pricing section
  if (p.includes("pricing") || p.includes("plan")) {
    const primary = targetColorHex || analysis?.theme?.primaryColor || "#2563EB";
    const pricingCode = `import React from 'react';
import { Check, ArrowRight } from 'lucide-react';

export default function Pricing() {
  const plans = [
    { name: "Starter", price: "$29", desc: "Core features for small teams", popular: false },
    { name: "Growth", price: "$79", desc: "Advanced tools for scaling teams", popular: true },
    { name: "Enterprise", price: "Custom", desc: "Dedicated scale & 24/7 SLA", popular: false }
  ];

  return (
    <section id="pricing" className="py-20 bg-slate-50 border-y border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-[${primary}]">Pricing</span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">Flexible plans for every stage</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((p, i) => (
            <div key={i} className={\`p-8 rounded-2xl bg-white border flex flex-col justify-between \${p.popular ? 'border-[${primary}] shadow-xl ring-2 ring-[${primary}]/20' : 'border-slate-200'}\`}>
              <div>
                <h3 className="text-xl font-bold text-slate-900">{p.name}</h3>
                <div className="text-4xl font-extrabold text-slate-900 my-4">{p.price}</div>
                <p className="text-sm text-slate-600 mb-6">{p.desc}</p>
                <div className="space-y-3 text-xs text-slate-700">
                  <div className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-600" /> Complete Feature Access</div>
                  <div className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-600" /> Automated Build Checks</div>
                  <div className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-600" /> Priority Support</div>
                </div>
              </div>
              <button className={\`w-full mt-8 py-3 rounded-xl font-semibold text-sm \${p.popular ? 'bg-[${primary}] text-white' : 'bg-slate-100 text-slate-800 hover:bg-slate-200'}\`}>
                Choose {p.name}
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
`;
    modified["src/components/Pricing.tsx"] = pricingCode;

    if (existingFiles["src/App.tsx"]) {
      let app = existingFiles["src/App.tsx"];
      if (!app.includes("Pricing")) {
        app = `import Pricing from './components/Pricing';\n` + app;
        app = app.replace(/<Footer\s*\/>/, `<Pricing />\n        <Footer />`);
      }
      modified["src/App.tsx"] = app;
    }

    return {
      files: modified,
      explanation: "Created new Pricing section component with tier cards and integrated into App.tsx.",
    };
  }

  // 5. Replace Hero / Bakery hero
  if (p.includes("bakery") || (p.includes("hero") && p.includes("replace"))) {
    const bakeryHeroCode = `import React from 'react';
import { ArrowRight, Sparkles, Heart } from 'lucide-react';

export default function Hero() {
  return (
    <section className="relative overflow-hidden py-24 bg-amber-50/70 border-b border-amber-200/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-amber-200/60 text-amber-900 border border-amber-300">
              <Sparkles className="w-3.5 h-3.5 text-amber-700" />
              <span>Artisanal Warm Hearth Baking</span>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-bold text-amber-950 tracking-tight leading-tight">
              Slow Fermented Breads & Morning Pastries
            </h1>
            <p className="text-lg text-amber-900/80 leading-relaxed font-sans">
              Baked fresh daily at dawn using ancient heritage grains, organic local stone-milled flours, and our generational wild sourdough starter.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start pt-2">
              <a href="#menu" className="px-7 py-3.5 bg-amber-800 text-white font-semibold rounded-xl shadow-md hover:bg-amber-900 transition-all inline-flex items-center justify-center gap-2">
                <span>View Daily Bake Menu</span>
                <ArrowRight className="w-4 h-4" />
              </a>
              <a href="#story" className="px-7 py-3.5 bg-white text-amber-900 font-semibold rounded-xl border border-amber-300 hover:bg-amber-100/50 transition-all inline-flex items-center justify-center">
                Our Bakery Story
              </a>
            </div>
          </div>
          <div className="relative">
            <div className="aspect-4/3 rounded-3xl bg-amber-200/50 p-6 flex flex-col justify-end text-amber-950 border border-amber-300/80 shadow-2xl overflow-hidden relative">
              <div className="absolute inset-0 bg-gradient-to-t from-amber-950/80 via-transparent to-transparent z-10" />
              <div className="relative z-20 space-y-2">
                <span className="px-3 py-1 bg-amber-500/80 text-white text-xs font-bold rounded-md">Master Baker's Choice</span>
                <h3 className="text-2xl font-serif font-bold text-white">Signature Country Sourdough</h3>
                <p className="text-xs text-amber-100">Blistered crust, open custard-like crumb, and deep caramelized flavor profile.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
`;
    return {
      files: { "src/components/Hero.tsx": bakeryHeroCode },
      explanation: "Replaced Hero section with an artisanal bakery hero featuring warm typography and bread showcase.",
    };
  }

  // 6. Add announcement banner
  if (p.includes("banner") || p.includes("announcement")) {
    if (existingFiles["src/components/Navbar.tsx"]) {
      let nav = existingFiles["src/components/Navbar.tsx"];
      if (!nav.includes("AnnouncementBanner")) {
        nav = nav.replace(
          /return \(\s*<header/,
          `return (\n    <header>\n      <div className="bg-sky-600 text-white py-2 px-4 text-center text-xs font-semibold flex items-center justify-center gap-2">\n        <span>✨ Special Announcement: AI Website Reconstruction Engine v1.0 is live!</span>\n      </div>\n      <div`
        );
        nav = nav.replace(/<\/header>$/, "</div>\n    </header>");
        return {
          files: { "src/components/Navbar.tsx": nav },
          explanation: "Added top announcement banner above navigation bar.",
        };
      }
    }
  }

  return null;
}

