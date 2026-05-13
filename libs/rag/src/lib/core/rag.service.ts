import crypto from 'node:crypto';

import { ChromaClient, Collection } from 'chromadb';

import { EmbeddingService } from './embedding.service.js';

export class RAGService2 {
  private chroma: ChromaClient;

  private collection: Collection | null = null;

  constructor(
    private collectionName = 'docs',
    private embeddingService = new EmbeddingService(),
  ) {
    this.chroma = new ChromaClient({
      host: process.env.CHROMA_HOST || 'localhost',

      port: parseInt(process.env.CHROMA_PORT || '8000'),
    });
  }

  async init() {
    if (this.collection) {
      return this.collection;
    }

    this.collection = await this.chroma.getOrCreateCollection({
      name: this.collectionName,
    });

    return this.collection;
  }

  async addDocuments(documents: string[], metadatas?: Record<string, any>[]) {
    const collection = await this.init();

    const embeddings = await this.embeddingService.embedMany(documents);

    await collection.add({
      ids: documents.map(() => crypto.randomUUID()),

      documents,

      embeddings,

      metadatas,
    });
  }

  async search(query: string, nResults = 2) {
    const collection = await this.init();

    const queryEmbedding = await this.embeddingService.embed(query);

    const result = await collection.query({
      queryEmbeddings: [queryEmbedding],
      nResults,
    });

    return {
      documents: result.documents?.[0] ?? [],

      distances: result.distances?.[0] ?? [],

      metadatas: result.metadatas?.[0] ?? [],
    };
  }

  async reset() {
    await this.chroma.deleteCollection({
      name: this.collectionName,
    });

    this.collection = null;
  }
}
