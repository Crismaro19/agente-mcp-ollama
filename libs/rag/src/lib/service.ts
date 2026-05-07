import { ChromaClient } from 'chromadb';
import { embed } from './embeddings.js';

const chroma = new ChromaClient({
  host: 'localhost',
  port: 8000,
});

const collectionName = 'docs';
let collection: any;
let initialized = false;

export async function initRAG() {
  if (collection) return collection;

  collection = await chroma.getOrCreateCollection({
    name: collectionName,
  });

  if (!initialized) {
    const docs = [
      'El saldo es el dinero disponible en una cuenta',
      'El interés compuesto se calcula sobre capital + intereses',
      'La tasa puede ser fija o variable',
    ];

    const embeddings = await Promise.all(docs.map(embed));

    await collection.add({
      ids: docs.map((_, i) => i.toString()),
      documents: docs,
      embeddings,
    });

    initialized = true;
  }

  return collection;
}

export async function searchRAG(query: string) {
  const col = await initRAG();

  const queryEmb = await embed(query);

  const res = await col.query({
    queryEmbeddings: [queryEmb],
    nResults: 1,
  });

  return res.documents?.[0] ?? [];
}
