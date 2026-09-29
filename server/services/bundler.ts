import * as esbuild from "esbuild";
import path from "path";
import { ProjectStore } from "./projectStore.ts";

export async function bundleProjectForPreview(projectId: string): Promise<string> {
  const project = await ProjectStore.getProject(projectId);
  if (!project) {
    return generateErrorHtml("Project Not Found", `Project "${projectId}" could not be located.`);
  }

  const files = project.files;
  if (!files["src/App.tsx"]) {
    return generateErrorHtml(
      "Missing Entry Point",
      `The file "src/App.tsx" was not found in project ${projectId}.`
    );
  }

  // Create virtual entry point that mounts App to #root with Error Boundary
  const virtualEntry = `
import React, { Component } from 'react';
import { createRoot } from 'react-dom/client';
import App from './src/App';

class PreviewErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  componentDidCatch(error, info) {
    console.error("Runtime error in generated preview:", error, info);
  }
  render() {
    if (this.state.hasError) {
      return React.createElement(
        'div',
        { className: 'min-h-screen bg-rose-50 text-rose-950 p-8 font-sans flex items-center justify-center' },
        React.createElement(
          'div',
          { className: 'max-w-xl w-full bg-white p-6 rounded-2xl shadow-xl border border-rose-200 space-y-4' },
          React.createElement('div', { className: 'flex items-center gap-2 text-rose-600 font-bold text-lg' }, '⚠️ Runtime Preview Error'),
          React.createElement('p', { className: 'text-sm text-slate-600' }, 'An unexpected runtime issue occurred while executing the generated React components:'),
          React.createElement('pre', { className: 'bg-rose-950 text-rose-100 p-4 rounded-xl text-xs font-mono overflow-auto max-h-48' }, String(this.state.error?.stack || this.state.error?.message || this.state.error)),
          React.createElement('p', { className: 'text-xs text-slate-500' }, 'Tip: Use the AI modification chat in WebClone to auto-repair this component.')
        )
      );
    }
    return this.props.children;
  }
}

const rootEl = document.getElementById('root');
if (rootEl) {
  createRoot(rootEl).render(
    React.createElement(PreviewErrorBoundary, null, React.createElement(App))
  );
}
`;

  // esbuild virtual plugin to resolve files from memory
  const virtualFsPlugin: esbuild.Plugin = {
    name: "virtual-fs",
    setup(build) {
      // Intercept the virtual entry
      build.onResolve({ filter: /^virtual-entry$/ }, (args) => ({
        path: args.path,
        namespace: "virtual-ns",
      }));

      build.onLoad({ filter: /.*/, namespace: "virtual-ns" }, () => ({
        contents: virtualEntry,
        loader: "tsx",
        resolveDir: "/",
      }));

      // Resolve relative imports from files
      build.onResolve({ filter: /^\.\.?\// }, (args) => {
        let importer = args.importer || "";
        if (importer.startsWith("/")) importer = importer.slice(1);
        if (importer === "virtual-entry") importer = "";

        const importerDir = importer.includes("/") ? path.dirname(importer) : "";
        let target = path.join(importerDir, args.path);
        target = target.replace(/\\/g, "/").replace(/^\//, "");

        const candidates = [
          target,
          `${target}.tsx`,
          `${target}.ts`,
          `${target}.jsx`,
          `${target}.js`,
          `${target}/index.tsx`,
          `${target}/index.ts`,
        ];

        for (const c of candidates) {
          if (files[c] !== undefined) {
            return { path: c, namespace: "project-file" };
          }
        }

        return { path: args.path, external: true };
      });

      // Load project files from memory
      build.onLoad({ filter: /.*/, namespace: "project-file" }, (args) => {
        const content = files[args.path];
        if (content === undefined) {
          return { errors: [{ text: `File not found: ${args.path}` }] };
        }
        const ext = path.extname(args.path);
        const loader = ext === ".tsx" ? "tsx" : ext === ".jsx" ? "jsx" : ext === ".ts" ? "ts" : "js";
        return {
          contents: content,
          loader,
          resolveDir: "/",
        };
      });
    },
  };

  try {
    const buildResult = await esbuild.build({
      entryPoints: ["virtual-entry"],
      bundle: true,
      format: "esm",
      target: "es2022",
      jsx: "automatic",
      plugins: [virtualFsPlugin],
      external: [
        "react",
        "react/jsx-runtime",
        "react-dom",
        "react-dom/client",
        "lucide-react",
      ],
      write: false,
    });

    const bundleJs = buildResult.outputFiles?.[0]?.text || "";

    return generatePreviewHtml(project.analysis.title, bundleJs);
  } catch (err: any) {
    const errorDetails = err.errors?.map((e: any) => e.text).join("\n") || err.message;
    return generateErrorHtml("Compilation Failed in Preview Sandbox", errorDetails);
  }
}

function generatePreviewHtml(title: string, bundleJs: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${escapeHtml(title)} - WebClone Preview</title>
  <!-- Tailwind CSS CDN -->
  <script src="https://cdn.tailwindcss.com"></script>
  <script>
    tailwind.config = {
      theme: {
        extend: {
          fontFamily: {
            sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
          }
        }
      }
    }
  </script>
  <!-- Google Fonts -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Playfair+Display:ital,wght@0,500;0,700;1,600&display=swap" rel="stylesheet">
  <style>
    html, body {
      margin: 0;
      padding: 0;
      scroll-behavior: smooth;
    }
    /* Hide scrollbar for clean embedded experience */
    ::-webkit-scrollbar {
      width: 8px;
    }
    ::-webkit-scrollbar-track {
      background: rgba(0, 0, 0, 0.05);
    }
    ::-webkit-scrollbar-thumb {
      background: rgba(0, 0, 0, 0.2);
      border-radius: 4px;
    }
  </style>
  <!-- Import Map for standalone browser ESM resolution -->
  <script type="importmap">
  {
    "imports": {
      "react": "https://esm.sh/react@19.0.0",
      "react/jsx-runtime": "https://esm.sh/react@19.0.0/jsx-runtime",
      "react-dom": "https://esm.sh/react-dom@19.0.0",
      "react-dom/client": "https://esm.sh/react-dom@19.0.0/client",
      "lucide-react": "https://esm.sh/lucide-react@0.546.0"
    }
  }
  </script>
</head>
<body class="bg-white text-slate-900 antialiased selection:bg-blue-600 selection:text-white">
  <div id="root">
    <div style="min-height: 100vh; display: flex; align-items: center; justify-content: center; font-family: sans-serif; color: #64748b;">
      <div style="text-align: center;">
        <div style="width: 32px; height: 32px; border: 3px solid #e2e8f0; border-top-color: #3b82f6; border-radius: 50%; animation: spin 0.8s linear infinite; margin: 0 auto 12px auto;"></div>
        <p style="font-size: 14px; font-weight: 500;">Mounting generated React implementation...</p>
      </div>
      <style>@keyframes spin { to { transform: rotate(360deg); } }</style>
    </div>
  </div>

  <script type="module">
${bundleJs}
  </script>
</body>
</html>`;
}

function generateErrorHtml(title: string, details: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Preview Build Error</title>
  <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-slate-900 text-slate-100 min-h-screen flex items-center justify-center p-6 font-sans">
  <div class="max-w-xl w-full bg-slate-800/90 border border-slate-700 rounded-2xl p-6 sm:p-8 space-y-4 shadow-2xl">
    <div class="inline-flex items-center gap-2 px-3 py-1 bg-rose-500/10 text-rose-400 border border-rose-500/20 rounded-full text-xs font-bold uppercase tracking-wider">
      Build Diagnostic
    </div>
    <h1 class="text-xl font-bold text-white">${escapeHtml(title)}</h1>
    <p class="text-sm text-slate-400">The build validator caught an issue during bundle generation:</p>
    <pre class="bg-slate-950 p-4 rounded-xl text-xs font-mono text-rose-300 overflow-x-auto whitespace-pre-wrap leading-relaxed border border-slate-800">${escapeHtml(
      details
    )}</pre>
    <div class="pt-2 text-xs text-slate-500 flex items-center justify-between">
      <span>WebClone AI Build Validator</span>
      <span>Retry or prompt AI to auto-fix</span>
    </div>
  </div>
</body>
</html>`;
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
