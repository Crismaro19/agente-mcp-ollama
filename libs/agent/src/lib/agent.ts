import { MCPClient } from '@org/mcp';
import { LLMClient } from '@org/llm';
import { tryParseToolCall } from './tools.js';
import { Message } from './InterfacesAgent.js';
import { IngestService, RAGService2 } from '@org/rag';

export async function agent(history: Message[]) {
  const serverPath = process.env.MCP_SERVER_PATH || './libs/papa/server.js';

  let messages = [...history];

  // MCP Client
  const client = new MCPClient();
  await client.connect(serverPath);

  // RAG Initialization
  const rag = new RAGService2();
  await rag.init();
  await rag.reset();
  const ingest = new IngestService(rag);
  await ingest.ingestTxt(process.env.KNOWLEDGE_BASE_PATH || './papa.txt');

  for (let step = 0; step < 5; step++) {
    const llm = new LLMClient({
      model: process.env.LLM_MODEL,
      baseUrl: process.env.OLLAMA_HOST,
    });
    const response = await llm.chat(messages);
    const content = response.message.content || '';

    console.log(`🧠 Step ${step}:`, content);

    const toolCall = tryParseToolCall(content);

    if (!toolCall) {
      return content;
    }

    // =========================
    // TOOL INTERNA RAG
    // =========================

    if (toolCall.tool === 'search_knowledge') {
      console.log('📚 Ejecutando RAG');

      const result = await rag.search(toolCall.arguments.query);

      messages.push({
        role: 'system',
        content: `
Usa este contexto para responder.

Contexto:
${result.documents.join('\n')}
`,
      });

      continue;
    }

    // =========================
    // TOOLS MCP
    // =========================

    console.log(`🔧 Ejecutando tool: ${toolCall.tool}`);

    const result = await client.callTool(toolCall.tool, toolCall.arguments);

    console.log('Resultado de get_time:', JSON.stringify(result));

    messages.push({
      role: 'system',
      content: `Resultado de la herramienta (${toolCall.tool}): ${JSON.stringify(result, null, 2)}`,
    });
  }
  await client.close();
  return 'No se pudo completar la tarea';
}
