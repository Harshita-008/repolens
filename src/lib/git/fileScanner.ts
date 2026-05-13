import fs from "fs";
import path from "path";

import {
  IGNORE_FOLDERS,
  IMPORTANT_EXTENSIONS,
  MAX_FILE_SIZE,
} from "../constants";

const MAX_FILES = 250;

export interface RepoFile {
  path: string;
  content: string;
}

export function scanRepoFiles(
  dir: string,
  baseDir: string = dir
): RepoFile[] {
  let results: RepoFile[] = [];

  const files = fs.readdirSync(dir);

  for (const file of files) {
    const filePath = path.join(dir, file);

    const stat =
      fs.statSync(filePath);

    // =========================
    // DIRECTORIES
    // =========================

    if (stat.isDirectory()) {
      if (
        IGNORE_FOLDERS.includes(file)
      ) {
        continue;
      }

      if (
        results.length >= MAX_FILES
      ) {
        break;
      }

      results = results.concat(
        scanRepoFiles(
          filePath,
          baseDir
        )
      );

      continue;
    }

    // =========================
    // EXTENSION FILTER
    // =========================

    const ext = path.extname(file);

    if (
      !IMPORTANT_EXTENSIONS.includes(
        ext
      )
    ) {
      continue;
    }

    // =========================
    // FILE SIZE FILTER
    // =========================

    if (
      stat.size > MAX_FILE_SIZE
    ) {
      continue;
    }

    // =========================
    // IMPORTANT FILE FILTER
    // =========================

    const importantPatterns = [
      "app",
      "api",
      "components",
      "lib",
      "hooks",
      "pages",
      "src",
      "store",
      "state",
      "auth",
      "db",
      "database",
      "models",
      "ai",
      "vector",
      "README",
      "package.json",
      "config",
    ];

    const normalizedPath =
      filePath.replace(/\\/g, "/");

    const isImportant =
      importantPatterns.some(
        (pattern) =>
          normalizedPath.includes(
            pattern
          )
      );

    if (!isImportant) {
      continue;
    }

    // =========================
    // READ FILE
    // =========================

    try {
      const content =
        fs.readFileSync(
          filePath,
          "utf-8"
        );

      // IMPORTANT FIX:
      // relative to repo root

      const relativePath =
        path
          .relative(
            baseDir,
            filePath
          )
          .replace(/\\/g, "/");

      results.push({
        path: relativePath,
        content,
      });
    } catch {
      continue;
    }
  }

  return results;
}