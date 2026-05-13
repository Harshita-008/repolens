export async function generateEmbedding(
  text: string
) {
  const embedding = new Array(384).fill(0);

  for (let i = 0; i < text.length; i++) {
    embedding[i % 384] += text.charCodeAt(i) / 255;
  }

  return embedding;
}