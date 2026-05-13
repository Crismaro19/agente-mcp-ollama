import dotenv from 'dotenv';

dotenv.config({
  path: '../../.env.test',
});

import { beforeAll, describe, expect, it } from 'vitest';
import { RAGService } from '../lib/service.js';

describe('rag', () => {
  let rag: RAGService;

  beforeAll(async () => {
    rag = new RAGService();

    await rag.init();
  });

  it('should initialize and search about the balance', async () => {
    const result = await rag.search('¿Qué es el saldo?');

    result.documents.forEach((doc: any) => console.log(`     • ${doc}`));

    expect(result.documents).toBeDefined();
  });

  it('should initialize and search about the interest', async () => {
    const result = await rag.search('¿Cómo se calcula el interés?');

    result.documents.forEach((doc: any) => console.log(`     • ${doc}`));

    expect(result.documents).toBeDefined();
  });

  it('should initialize and search about the rates', async () => {
    const result = await rag.search('¿Qué tipos de tasa existen?');

    result.documents.forEach((doc: any) => console.log(`     • ${doc}`));

    expect(result.documents).toBeDefined();
  });
});
