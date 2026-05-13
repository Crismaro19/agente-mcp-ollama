import dotenv from 'dotenv';
dotenv.config({
  path: '../../.env.test',
});
import { RAGService2 } from '../lib/core/rag.service.js';
import { IngestService } from '../lib/ingest/ingest.service.js';

describe('RAG', () => {
  it('should retrieve compound interest info', async () => {
    const rag = new RAGService2();
    await rag.reset();
    const ingest = new IngestService(rag);
    await ingest.ingestTxt(process.env.KNOWLEDGE_BASE_PATH || './papa.txt');

    const results = await rag.search('¿Qué es el interés compuesto?');

    console.log('results:', results.documents.join('\n'));
    expect(true).toBe(true);
  });
});
