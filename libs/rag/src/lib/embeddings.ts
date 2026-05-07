import ollama from 'ollama';

export async function embed(text: string): Promise<number[]> {
  const res = await ollama.embeddings({
    model: 'nomic-embed-text',
    prompt: text,
  });

  return res.embedding;
}
