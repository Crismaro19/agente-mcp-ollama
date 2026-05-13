import path from 'node:path';

import { TxtLoader } from '../loaders/txt.loader.js';

import { ChunkerService } from '../core/chunker.service.js';

import { RAGService2 } from '../core/rag.service.js';

export class IngestService {
  constructor(
    private rag: RAGService2,
    private txtLoader = new TxtLoader(),
    private chunker = new ChunkerService(),
  ) {}

  async ingestTxt(filePath: string) {
    const content = await this.txtLoader.load(filePath);

    const chunks = this.chunker.splitText(content);

    console.log(
      `Ingesting ${chunks.length} chunks from ${filePath} chunks:`,
      chunks,
    );

    await this.rag.addDocuments(
      chunks,

      chunks.map(() => ({
        source: path.basename(filePath),
        type: 'txt',
      })),
    );
  }
}
