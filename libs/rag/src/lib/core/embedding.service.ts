import ollama from 'ollama';

export class EmbeddingService {
  constructor(private model = 'nomic-embed-text') {}

  async embed(text: string): Promise<number[]> {
    const response = await ollama.embeddings({
      model: this.model,
      prompt: text,
    });

    return response.embedding;
  }

  async embedMany(texts: string[]) {
    return Promise.all(texts.map((text) => this.embed(text)));
  }
}
