import fs from "fs/promises";
import path from "path";
import crypto from "crypto";
import { AgentLog, ProjectMetadata, WebsiteAnalysis } from "../types.ts";

const PROJECTS_DIR = path.resolve("./projects");

// Ensure projects directory exists
async function ensureProjectsDir() {
  try {
    await fs.mkdir(PROJECTS_DIR, { recursive: true });
  } catch (err) {
    // Ignore already exists
  }
}

export class ProjectStore {
  static async createProject(url: string, analysis: WebsiteAnalysis): Promise<ProjectMetadata> {
    await ensureProjectsDir();
    const id = "proj_" + Date.now().toString(36) + "_" + crypto.randomBytes(3).toString("hex");
    const projectDir = path.join(PROJECTS_DIR, id);
    const filesDir = path.join(projectDir, "files");

    await fs.mkdir(filesDir, { recursive: true });

    const now = new Date().toISOString();
    const metadata: ProjectMetadata = {
      id,
      url,
      title: analysis.title || new URL(url).hostname,
      createdAt: now,
      updatedAt: now,
      status: "analyzing",
      repairAttempts: 0,
      files: [],
    };

    const initialLogs: AgentLog[] = [
      {
        id: "log_" + Date.now() + "_1",
        timestamp: new Date().toLocaleTimeString(),
        stage: "INIT",
        message: `Project workspace created: ${id}`,
        status: "info",
      },
      {
        id: "log_" + Date.now() + "_2",
        timestamp: new Date().toLocaleTimeString(),
        stage: "FETCH",
        message: `Fetched website structure from ${url}`,
        details: `Detected ${analysis.sections.length} semantic sections, ${analysis.navigation.links.length} nav links, primary color ${analysis.theme.primaryColor}`,
        status: "success",
      },
    ];

    await fs.writeFile(path.join(projectDir, "metadata.json"), JSON.stringify(metadata, null, 2), "utf-8");
    await fs.writeFile(path.join(projectDir, "analysis.json"), JSON.stringify(analysis, null, 2), "utf-8");
    await fs.writeFile(path.join(projectDir, "logs.json"), JSON.stringify(initialLogs, null, 2), "utf-8");

    return metadata;
  }

  static async getProject(id: string) {
    await ensureProjectsDir();
    const projectDir = path.join(PROJECTS_DIR, id);
    try {
      const metaContent = await fs.readFile(path.join(projectDir, "metadata.json"), "utf-8");
      const analysisContent = await fs.readFile(path.join(projectDir, "analysis.json"), "utf-8");
      const logsContent = await fs.readFile(path.join(projectDir, "logs.json"), "utf-8");

      const metadata: ProjectMetadata = JSON.parse(metaContent);
      const analysis: WebsiteAnalysis = JSON.parse(analysisContent);
      const logs: AgentLog[] = JSON.parse(logsContent);

      const files = await this.readAllProjectFiles(id);

      return { metadata, analysis, logs, files };
    } catch (err) {
      return null;
    }
  }

  static async saveProjectFiles(id: string, files: Record<string, string>) {
    const projectDir = path.join(PROJECTS_DIR, id);
    const filesDir = path.join(projectDir, "files");

    for (const [relPath, content] of Object.entries(files)) {
      const fullPath = path.join(filesDir, relPath);
      await fs.mkdir(path.dirname(fullPath), { recursive: true });
      await fs.writeFile(fullPath, content, "utf-8");
    }

    // Update metadata files list
    const metaPath = path.join(projectDir, "metadata.json");
    try {
      const metaRaw = await fs.readFile(metaPath, "utf-8");
      const meta: ProjectMetadata = JSON.parse(metaRaw);
      meta.files = Object.keys(files);
      meta.updatedAt = new Date().toISOString();
      await fs.writeFile(metaPath, JSON.stringify(meta, null, 2), "utf-8");
    } catch {
      // Ignore
    }
  }

  static async readAllProjectFiles(id: string): Promise<Record<string, string>> {
    const filesDir = path.join(PROJECTS_DIR, id, "files");
    const result: Record<string, string> = {};

    async function walk(dir: string, base: string) {
      try {
        const entries = await fs.readdir(dir, { withFileTypes: true });
        for (const entry of entries) {
          const fullPath = path.join(dir, entry.name);
          const relPath = path.relative(base, fullPath);
          if (entry.isDirectory()) {
            await walk(fullPath, base);
          } else {
            const content = await fs.readFile(fullPath, "utf-8");
            result[relPath] = content;
          }
        }
      } catch {
        // Files directory might be empty initially
      }
    }

    await walk(filesDir, filesDir);
    return result;
  }

  static async addLog(
    id: string,
    stage: AgentLog["stage"],
    message: string,
    details?: string,
    status: AgentLog["status"] = "info"
  ): Promise<AgentLog> {
    const projectDir = path.join(PROJECTS_DIR, id);
    const logsPath = path.join(projectDir, "logs.json");

    const newLog: AgentLog = {
      id: "log_" + Date.now() + "_" + Math.random().toString(36).substring(2, 6),
      timestamp: new Date().toLocaleTimeString(),
      stage,
      message,
      details,
      status,
    };

    try {
      let logs: AgentLog[] = [];
      try {
        const raw = await fs.readFile(logsPath, "utf-8");
        logs = JSON.parse(raw);
      } catch {
        logs = [];
      }
      logs.push(newLog);
      await fs.writeFile(logsPath, JSON.stringify(logs, null, 2), "utf-8");
    } catch (err) {
      console.error("Error writing log:", err);
    }

    return newLog;
  }

  static async updateStatus(
    id: string,
    status: ProjectMetadata["status"],
    repairAttempts?: number,
    lastValidationErrors?: string[]
  ) {
    const projectDir = path.join(PROJECTS_DIR, id);
    const metaPath = path.join(projectDir, "metadata.json");
    try {
      const metaRaw = await fs.readFile(metaPath, "utf-8");
      const meta: ProjectMetadata = JSON.parse(metaRaw);
      meta.status = status;
      meta.updatedAt = new Date().toISOString();
      if (typeof repairAttempts === "number") meta.repairAttempts = repairAttempts;
      if (lastValidationErrors) meta.lastValidationErrors = lastValidationErrors;
      await fs.writeFile(metaPath, JSON.stringify(meta, null, 2), "utf-8");
    } catch {
      // Ignore
    }
  }

  static async listProjects(): Promise<ProjectMetadata[]> {
    await ensureProjectsDir();
    try {
      const dirs = await fs.readdir(PROJECTS_DIR);
      const list: ProjectMetadata[] = [];
      for (const d of dirs) {
        try {
          const metaRaw = await fs.readFile(path.join(PROJECTS_DIR, d, "metadata.json"), "utf-8");
          list.push(JSON.parse(metaRaw));
        } catch {
          // ignore corrupted or non-project dirs
        }
      }
      return list.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
    } catch {
      return [];
    }
  }
}
