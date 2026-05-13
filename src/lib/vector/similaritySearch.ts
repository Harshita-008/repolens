import { chroma } from "./chroma";
import { generateEmbedding } from "../ai/embeddings";

export async function searchRepo(
  repoName: string,
  query: string
) {
  const collection =
    await chroma.getCollection({
      name: repoName,
    });

  const embedding = await generateEmbedding(query);

  const results = await collection.query({
    queryEmbeddings: [embedding],
    nResults: 5,
  });

  return results;
}