import * as esbuild from "esbuild";
import { ai, GEMINI_MODEL } from "./gemini.ts";
import { ProjectStore } from "./projectStore.ts";

export interface ValidationResult {
  valid: boolean;
  errors: string[];
  repaired: boolean;
  repairAttempts: number;
}

export const MAX_REPAIR_ATTEMPTS = 3;

/**
 * Validates a single TSX/JSX/TS file using esbuild's parser and AST compiler.
 */
export async function validateSourceFile(filePath: string, code: string): Promise<string | null> {
  const isTsx = filePath.endsWith(".tsx") || filePath.endsWith(".jsx");
  const isTs = filePath.endsWith(".ts") || filePath.endsWith(".js");

  if (!isTsx && !isTs) {
    if (filePath.endsWith(".json")) {
      try {
        JSON.parse(code);
        return null;
      } catch (err: any) {
        return `JSON syntax error in ${filePath}: ${err.message}`;
      }
    }
    return null;
  }

  try {
    await esbuild.transform(code, {
      loader: isTsx ? "tsx" : "ts",
      target: "es2022",
      jsx: "automatic",
      sourcemap: false,
    });
    return null;
  } catch (err: any) {
    const msg = err.errors?.[0]?.text || err.message || "Syntax error";
    const line = err.errors?.[0]?.location?.line;
    const col = err.errors?.[0]?.location?.column;
    return `Error in ${filePath}${line ? ` (line ${line}:${col})` : ""}: ${msg}`;
  }
}

/**
 * Validates internal component import paths across all files.
 */
export function validateProjectImports(files: Record<string, string>): string[] {
  const errors: string[] = [];
  const knownFiles = new Set(Object.keys(files));

  for (const [filePath, content] of Object.entries(files)) {
    if (!filePath.endsWith(".tsx") && !filePath.endsWith(".ts")) continue;

    // Match relative imports like: import ... from './components/Navbar';
    const importRegex = /import\s+[\s\S]*?from\s+['"](\.[^'"]+)['"]/g;
    let match: RegExpExecArray | null;

    while ((match = importRegex.exec(content)) !== null) {
      const relImport = match[1];
      // Normalize relative to current file's directory
      const dir = filePath.includes("/") ? filePath.substring(0, filePath.lastIndexOf("/")) : "";
      let targetPath = dir ? `${dir}/${relImport}` : relImport;
      targetPath = targetPath.replace(/^\.\//, "");

      const possibleExtensions = [
        targetPath,
        `${targetPath}.tsx`,
        `${targetPath}.ts`,
        `${targetPath}.jsx`,
        `${targetPath}.js`,
        `${targetPath}/index.tsx`,
        `${targetPath}/index.ts`,
      ];

      const exists = possibleExtensions.some((p) => knownFiles.has(p));
      if (!exists) {
        errors.push(`Unresolved internal import "${relImport}" referenced in ${filePath}`);
      }
    }
  }

  return errors;
}

/**
 * Runs the full validation & automated repair loop up to MAX_REPAIR_ATTEMPTS.
 */
export async function validateAndRepairProject(
  projectId: string,
  files: Record<string, string>
): Promise<{ files: Record<string, string>; result: ValidationResult }> {
  let currentFiles = { ...files };
  let attempts = 0;
  let allErrors: string[] = [];

  while (attempts <= MAX_REPAIR_ATTEMPTS) {
    allErrors = [];

    // Step 1: Syntax & Transpilation check on every file
    for (const [filePath, content] of Object.entries(currentFiles)) {
      const fileErr = await validateSourceFile(filePath, content);
      if (fileErr) {
        allErrors.push(fileErr);
      }
    }

    // Step 2: Component imports resolution check
    const importErrors = validateProjectImports(currentFiles);
    allErrors.push(...importErrors);

    // If no errors, validation passed!
    if (allErrors.length === 0) {
      await ProjectStore.addLog(
        projectId,
        "VALIDATE",
        attempts === 0 ? "Build validation passed (0 errors)" : `Automated repair successful on attempt ${attempts}`,
        `Compiled ${Object.keys(currentFiles).length} files with esbuild AST validator. Zero syntax or import errors.`,
        "success"
      );
      await ProjectStore.updateStatus(projectId, "ready", attempts);
      return {
        files: currentFiles,
        result: {
          valid: true,
          errors: [],
          repaired: attempts > 0,
          repairAttempts: attempts,
        },
      };
    }

    // Errors were found
    attempts++;
    await ProjectStore.addLog(
      projectId,
      attempts <= MAX_REPAIR_ATTEMPTS ? "REPAIR" : "ERROR",
      `Build validation detected ${allErrors.length} issue(s)`,
      allErrors.join("\n"),
      attempts <= MAX_REPAIR_ATTEMPTS ? "warning" : "error"
    );

    if (attempts > MAX_REPAIR_ATTEMPTS) {
      break;
    }

    // Attempt automated repair with Gemini
    await ProjectStore.addLog(
      projectId,
      "REPAIR",
      `Executing AI repair loop (attempt ${attempts}/${MAX_REPAIR_ATTEMPTS})...`,
      `Addressing errors: ${allErrors.slice(0, 3).join("; ")}`,
      "in_progress"
    );

    try {
      const repairedFiles = await attemptAiRepair(currentFiles, allErrors);
      currentFiles = { ...currentFiles, ...repairedFiles };
      await ProjectStore.saveProjectFiles(projectId, currentFiles);
    } catch (repairErr: any) {
      await ProjectStore.addLog(
        projectId,
        "REPAIR",
        `AI repair attempt ${attempts} encountered error: ${repairErr.message}`,
        undefined,
        "warning"
      );
    }
  }

  // If still failing after MAX_REPAIR_ATTEMPTS
  await ProjectStore.addLog(
    projectId,
    "ERROR",
    `Generation completed with unresolved build errors after ${MAX_REPAIR_ATTEMPTS} repair attempts.`,
    allErrors.join("\n"),
    "error"
  );
  await ProjectStore.updateStatus(projectId, "error", attempts - 1, allErrors);

  return {
    files: currentFiles,
    result: {
      valid: false,
      errors: allErrors,
      repaired: false,
      repairAttempts: attempts - 1,
    },
  };
}

/**
 * Sends failing files and errors to Gemini to generate precise fixes.
 */
async function attemptAiRepair(
  files: Record<string, string>,
  errors: string[]
): Promise<Record<string, string>> {
  // Identify which files have errors
  const affectedFileNames = new Set<string>();
  for (const err of errors) {
    for (const f of Object.keys(files)) {
      if (err.includes(f) || err.includes(f.replace("src/", ""))) {
        affectedFileNames.add(f);
      }
    }
  }

  // If no specific file matched, inspect App.tsx by default
  if (affectedFileNames.size === 0) {
    affectedFileNames.add("src/App.tsx");
  }

  const fileContexts: Record<string, string> = {};
  for (const f of affectedFileNames) {
    if (files[f]) fileContexts[f] = files[f];
  }

  const prompt = `You are an expert React TypeScript compiler repair assistant.
The following build errors occurred during project compilation:

ERRORS:
${errors.join("\n")}

AFFECTED SOURCE FILES:
${JSON.stringify(fileContexts, null, 2)}

ALL PROJECT FILE PATHS:
${Object.keys(files).join(", ")}

TASK:
Fix the syntax errors, unclosed tags, or broken imports in the affected files.
Ensure the repaired code is 100% valid TypeScript/JSX and uses proper React and Lucide-react imports.

Respond ONLY with a JSON object containing the repaired file(s):
{
  "files": {
    "path/to/file.tsx": "fixed full content string"
  }
}
Do NOT include markdown formatting outside the JSON.`;

  const response = await ai.models.generateContent({
    model: GEMINI_MODEL,
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      temperature: 0.1,
    },
  });

  const text = response.text?.trim() || "";
  const cleaned = text.replace(/^```json\s*/, "").replace(/\s*```$/, "");
  const parsed = JSON.parse(cleaned);

  if (parsed.files && typeof parsed.files === "object") {
    return parsed.files;
  }
  return {};
}
