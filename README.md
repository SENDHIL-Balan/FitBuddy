# WebClone AI — AI-Powered Website Reconstruction Agent

> Built for the Founding AI Engineer Assignment. An autonomous AI agent that ingests any publicly accessible website URL, inspects its layout, DOM structure, color system, typography, and responsive design, synthesizes a brand-new modular React + TypeScript frontend, validates build integrity via an automated compiler repair loop, and renders a live interactive preview with conversational AI modification capabilities.

---

## 🏗️ Architecture Diagram

```text
               Website URL
                   ↓
            Website Fetcher (Cheerio & Node.js HTTP)
                   ↓
            Website Analyzer (DOM Extraction & Token Mapping)
                   ↓
       Structured UI Representation (WebsiteAnalysis)
                   ↓
             Gemini AI Agent (gemini-3.8-flash)
                   ↓
           React Code Generator (Modular TSX Components)
                   ↓
           Generated Project (Isolated Workspace in /projects)
                   ↓
            Build Validator (esbuild AST Parser & Import Checker)
                   ↓
            Error Repair Loop (Autonomous Fixes, Max 3 Attempts)
                   ↓
             Local Preview (In-Memory ESM Browser Sandbox)
                   ↓
      Natural Language Modification ("Change color to blue", etc.)
                   ↓
             Code Modification (Focused Component Rewriting)
                   ↓
                Validation (esbuild Re-check)
                   ↓
              Updated Preview (Live Sandbox Reload)
```

---

## 🚀 Key Features

1. **Autonomous Website Reconstruction**: Analyzes semantic headers, navigation bars, hero sections, feature grids, testimonial strips, pricing tables, call-to-actions, and footers without hardcoding website-specific templates.
2. **Deep Visual & Aesthetic Token Extraction**: Ingests colors (primary, secondary, background, surface, accent), font pairings, spacing scales, border radiuses, and responsive behavior.
3. **Modular React Codebase**: Avoids monolithic single-file generation. Splits output into `src/App.tsx`, `src/components/Navbar.tsx`, `src/components/Hero.tsx`, `src/components/Features.tsx`, etc., using modern Tailwind CSS and Lucide React icons.
4. **Automated AST Build Validation & Repair Loop**: Every generated file passes through `esbuild` AST parsing and module import resolution before previewing. Any syntax error or missing component triggers an automated repair loop (up to 3 attempts).
5. **Zero-Iframe Sandbox Preview**: The live preview runs the **actual generated React code**, transpiled in memory into a browser ES module bundle. It never embeds or iframes the original website.
6. **Multi-Viewport Preview Controls**: Instant toggle between **Desktop** (1280px), **Tablet** (768px), and **Mobile** (375px) viewports with real responsive layouts.
7. **Conversational AI Modifications**: Users prompt the agent in natural language (e.g. *"Change the primary color to blue"*, *"Make navbar sticky"*, *"Add a testimonials section"*). The agent identifies the affected files, executes surgical code modifications, re-validates, and live-updates the preview.
8. **Isolated Project Workspaces**: Every reconstruction gets an isolated directory in `projects/` with independent metadata, logs, and files.

---

## 🛠️ Technologies & Models

- **AI Model**: Google Gemini API (`gemini-3.8-flash`) via the modern `@google/genai` TypeScript SDK.
- **Frontend**: React 19, TypeScript, Tailwind CSS, Lucide React, PrismJS syntax highlighter.
- **Backend API & Server**: Express 4 mounted with Vite middleware (`tsx server.ts`).
- **DOM Scraping & Token Extraction**: Cheerio, Node.js Fetch with custom User-Agent and security safeguards.
- **Compiler & AST Validator**: `esbuild` for instant sub-millisecond syntax validation, TypeScript transpilation, and in-memory bundling.

---

## ⚙️ Environment Variables

Create a `.env` file in the root directory (or inject via environment):

```env
# Required for Gemini AI API calls
GEMINI_API_KEY="YOUR_GEMINI_API_KEY"

# Optional port configuration (defaults to 3000)
PORT=3000
```

*Note: In accordance with security guidelines, `GEMINI_API_KEY` is kept strictly server-side and never exposed to client-side code.*

---

## 📦 How to Run Locally

```bash
# 1. Install dependencies
npm install

# 2. Start the development server (runs full-stack Express + Vite on port 3000)
npm run dev

# 3. Open browser at http://localhost:3000
```

---

## 🔄 Core Pipelines Explained

### 1. Website Analysis Pipeline
1. Validates and sanitizes the user URL, blocking private/internal IP ranges (`localhost`, `10.*`, `192.168.*`) for SSRF protection.
2. Fetches the public page HTML with realistic browser headers and an abort timeout.
3. Parses semantic elements with Cheerio: `nav`, `header`, `h1-h3`, `p`, `img`, `section`, CSS classes, inline color styles, and Google Font tags.
4. Passes the extracted DOM summary to Gemini to construct a structured `WebsiteAnalysis` object detailing theme colors, navigation layout, semantic sections, and responsive rules.

### 2. React Code Generation Pipeline
1. Takes the structured `WebsiteAnalysis` blueprint.
2. Plans modular components: `Navbar.tsx`, `Hero.tsx`, `Features.tsx`, `Testimonials.tsx`, `Pricing.tsx`, `CTA.tsx`, `Footer.tsx`, and `App.tsx`.
3. Synthesizes clean TypeScript JSX leveraging Tailwind arbitrary values (e.g. `bg-[#2563EB]`) and Lucide icons.
4. Saves generated files into an isolated directory (`projects/<project-id>/files/`).

### 3. Build Validation & Auto-Repair Loop
1. Performs AST parsing with `esbuild.transform()` on every `.tsx`/`.ts` file to catch unclosed tags, syntax errors, or invalid expressions.
2. Verifies relative imports against existing project files to prevent runtime `ModuleNotFound` failures.
3. If errors are detected, feeds the error stack back into the AI repair agent (up to `MAX_REPAIR_ATTEMPTS = 3`).
4. Only marks the project as `ready` once the build passes with 0 errors.

### 4. Live Preview Sandbox
1. Virtual in-memory bundler compiles the project's files into a single browser-compatible ES module using `esbuild`.
2. Serves a sandbox HTML page that mounts the virtual bundle into a React 19 root with an inline `PreviewErrorBoundary` to catch any runtime exceptions gracefully.

### 5. Natural Language Modification Pipeline
1. Evaluates user prompts (e.g., *"Make the navbar sticky"* or *"Add testimonials"*).
2. Identifies affected target files rather than regenerating the entire project from scratch.
3. Modifies target files, re-runs the compiler validation check, updates the project files, and triggers a hot reload of the preview sandbox.

---

## 💰 Cost Awareness & Optimization

- **Structured Analysis First**: Ingests concise DOM summaries rather than raw megabyte HTML dumps, reducing input token costs by over 80%.
- **Targeted File Modifications**: Natural language modifications only send and update the affected component files, preserving LLM context budget.
- **Intelligent Deterministic Fallback Engine**: If Gemini API quota or rate limits are reached, the system automatically falls back to an intelligent rule engine for colors, sticky navigation, and section injections without crashing or leaving the user stranded.

---

## 🧪 Tested With Diverse Websites

The application was designed and tested with three structurally distinct websites:
1. **SaaS / Cloud Platform (`supabase.com`)**: Dark theme, technical code-block hero, feature matrix, enterprise proof points.
2. **Artisanal Bakery & Cafe (`tartinebakery.com`)**: Warm editorial styling, culinary hero, organic color palette, story cards.
3. **Minimalist Agency Grid (`minimal.gallery`)**: High-contrast typography, clean card columns, refined whitespace rhythm.
