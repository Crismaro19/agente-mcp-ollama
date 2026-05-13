import { ChromaClient, Collection } from 'chromadb';
import { embed } from './embeddings.js';
import crypto from 'node:crypto';

export class RAGService {
  private chroma: ChromaClient;
  private collectionName: string;
  private collection: Collection | null = null;
  private initialized = false;

  constructor(collectionName = 'docs') {
    this.collectionName = collectionName;

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

    if (!this.initialized) {
      const docs = [
        'El saldo es el dinero disponible en una cuenta',
        'El interés compuesto se calcula sobre capital + intereses',
        'La tasa puede ser fija o variable',
      ];

      const embeddings = await Promise.all(docs.map(embed));

      await this.collection.add({
        ids: docs.map(() => crypto.randomUUID()),
        documents: docs,
        embeddings,
      });

      this.initialized = true;
    }

    return this.collection;
  }

  async search(query: string, nResults = 1) {
    const collection = await this.init();

    const queryEmbedding = await embed(query);

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

  async addDocuments(documents: string[]) {
    const collection = await this.init();

    const embeddings = await Promise.all(documents.map(embed));

    await collection.add({
      ids: documents.map(() => crypto.randomUUID()),
      documents,
      embeddings,
    });
  }

  async reset() {
    await this.chroma.deleteCollection({
      name: this.collectionName,
    });

    this.collection = null;
    this.initialized = false;
  }
}
