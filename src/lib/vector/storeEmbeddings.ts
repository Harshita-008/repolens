import { chroma } from "./chroma";
import { generateEmbedding } from "../ai/embeddings";

interface RepoFile {
  path: string;
  content: string;
}

export async function storeRepoEmbeddings(
  repoName: string,
  files: RepoFile[]
) {
  const collection =
    await chroma.getOrCreateCollection({
      name: repoName,
    });

  const limitedFiles = files.slice(0, 40);

  for (const file of limitedFiles) {
    const embedding = await generateEmbedding(
      file.content.slice(0, 5000)
    );

    await collection.add({
      ids: [file.path],
      embeddings: [embedding],
      documents: [file.content.slice(0, 5000)],
      metadatas: [
        {
          path: file.path,
        },
      ],
    });
  }

  return collection;
}