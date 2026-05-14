import simpleGit from "simple-git";
import path from "path";
import fs from "fs";
import os from "os";
import { fetchGithubRepo } from "./fetchGithubRepo";

const git = simpleGit();

export async function cloneRepo(repoUrl: string) {
  try {
    if (process.env.VERCEL) {
      return fetchGithubRepo(repoUrl);
    }

    const repoName = repoUrl
      .split("/")
      .pop()
      ?.replace(".git", "");

    if (!repoName) {
      throw new Error("Invalid repository URL");
    }

    const uniqueRepoName = `${repoName}-${Date.now()}`;

    const reposRoot = path.join(
      os.tmpdir(),
      "repolens",
      "repos"
    );
    const repoPath = path.join(reposRoot, uniqueRepoName);

    fs.mkdirSync(reposRoot, { recursive: true });

    await git.clone(repoUrl, repoPath);

    return {
      repoName,
      repoPath,
    };
  } catch (error) {
    console.error(error);

    if (process.env.VERCEL && error instanceof Error) {
      throw error;
    }

    throw new Error("Failed to clone repository");
  }
}
