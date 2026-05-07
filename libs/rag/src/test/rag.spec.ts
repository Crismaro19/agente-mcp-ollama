import { initRAG, searchRAG } from '../lib/service.js';

// docker run -p 8000:8000 chromadb/chroma
describe('rag', () => {
  beforeAll(async () => {
    await initRAG();
  });
  it('should initialize and search about the balance', async () => {
    const result = await searchRAG('¿Qué es el saldo?');
    result?.forEach((doc: any) => console.log(`     • ${doc}`));
    expect(result).toBeDefined();
  });
  it('should initialize and search about the interest', async () => {
    const result = await searchRAG('¿Cómo se calcula el interés?');
    result?.forEach((doc: any) => console.log(`     • ${doc}`));
    expect(result).toBeDefined();
  });
  it('should initialize and search about the rates', async () => {
    const result = await searchRAG('¿Qué tipos de tasa existen?');
    result?.forEach((doc: any) => console.log(`     • ${doc}`));
    expect(result).toBeDefined();
  });
});
