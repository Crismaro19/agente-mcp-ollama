import { LLMClient } from '../lib/llmClient.js';

describe('llm', () => {
  it('should return a valid response', async () => {
    const llm = new LLMClient();

    const response = await llm.chat([
      { role: 'system', content: 'Eres un agente MCP que responde corto' },
      { role: 'user', content: '¿Qué es una tool?' },
    ]);

    console.log(response);
    expect(response).toBeDefined();
  }, 20000);
});
