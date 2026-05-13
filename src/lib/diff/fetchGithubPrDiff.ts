export async function fetchGithubPrDiff(prUrl: string) {
  const parsed = parseGithubPullRequestUrl(prUrl);

  if (!parsed) {
    throw new Error("Enter a valid GitHub pull request URL.");
  }

  const response = await fetch(
    `https://github.com/${parsed.owner}/${parsed.repo}/pull/${parsed.pullNumber}.diff`,
    {
      headers: {
        Accept: "text/plain",
        "User-Agent": "RepoLens",
      },
      cache: "no-store",
    }
  );

  if (!response.ok) {
    throw new Error(
      `Could not fetch PR diff from GitHub (${response.status}).`
    );
  }

  return response.text();
}

function parseGithubPullRequestUrl(url: string) {
  try {
    const parsed = new URL(url);

    if (parsed.hostname !== "github.com") return null;

    const [owner, repo, pullSegment, pullNumber] =
      parsed.pathname.split("/").filter(Boolean);

    if (!owner || !repo || pullSegment !== "pull" || !pullNumber) {
      return null;
    }

    return {
      owner,
      repo,
      pullNumber,
    };
  } catch {
    return null;
  }
}
