import simpleGit from "simple-git";
import path from "path";
import fs from "fs";

const git = simpleGit();

export async function cloneRepo(repoUrl: string) {
  try {
    const repoName = repoUrl
      .split("/")
      .pop()
      ?.replace(".git", "");

    if (!repoName) {
      throw new Error("Invalid repository URL");
    }

    const uniqueRepoName = `${repoName}-${Date.now()}`;

    const repoPath = path.join(
      process.cwd(),
      "repos",
      uniqueRepoName
    );

    await git.clone(repoUrl, repoPath);

    return {
      repoName,
      repoPath,
    };
  } catch (error) {
    console.error(error);
    throw new Error("Failed to clone repository");
  }
}