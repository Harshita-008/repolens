import fs from "fs";
import path from "path";
import { IGNORE_FOLDERS } from "../constants";

export function generateRepoTree(
  dir: string,
  level = 0
): string {
  let tree = "";

  const files = fs.readdirSync(dir);

  for (const file of files) {
    if (IGNORE_FOLDERS.includes(file)) continue;

    const filePath = path.join(dir, file);

    const stat = fs.statSync(filePath);

    tree += `${"  ".repeat(level)}- ${file}\n`;

    if (stat.isDirectory()) {
      tree += generateRepoTree(filePath, level + 1);
    }
  }

  return tree;
}