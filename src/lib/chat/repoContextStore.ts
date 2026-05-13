import { RepoFile } from "../git/fileScanner";
import { chunkRepoFiles } from "./chunkRepoFiles";
import { RepoChatContext } from "./types";

const STORE_KEY = "__repolens_repo_contexts__";
const MAX_CONTEXTS = 5;

type GlobalWithRepoStore = typeof globalThis & {
  [STORE_KEY]?: Map<string, RepoChatContext>;
};

function getStore() {
  const globalStore =
    globalThis as GlobalWithRepoStore;

  if (!globalStore[STORE_KEY]) {
    globalStore[STORE_KEY] = new Map();
  }

  return globalStore[STORE_KEY];
}

export function saveRepoContext(input: {
  repoName: string;
  tree: string;
  summary: string;
  roadmap: string;
  files: RepoFile[];
}) {
  const store = getStore();

  store.set(input.repoName, {
    ...input,
    chunks: chunkRepoFiles(input.files),
  });

  const oldestKeys = Array.from(store.keys()).slice(
    0,
    Math.max(0, store.size - MAX_CONTEXTS)
  );

  for (const key of oldestKeys) {
    store.delete(key);
  }
}

export function getRepoContext(repoName: string) {
  return getStore().get(repoName);
}

export function hasRepoContext(repoName: string) {
  return getStore().has(repoName);
}
