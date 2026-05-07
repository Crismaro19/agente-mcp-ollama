import { MCPClient } from '@org/mcp';
import { LLMClient } from '@org/llm';
import { tryParseToolCall } from './tools.js';
import { Message } from './InterfacesAgent.js';

export async function agent(history: Message[]) {
  const serverPath =
    '/home/maro/proyectos/trabajo/agente-mcp-ollama/libs/mcp/src/lib/server.js';

  let messages = [...history];

  const client = new MCPClient();
  await client.connect(serverPath);

  for (let step = 0; step < 5; step++) {
    const llm = new LLMClient();
    const response = await llm.chat(messages);
    const content = response.message.content || '';

    console.log(`🧠 Step ${step}:`, content);

    const toolCall = tryParseToolCall(content);

    if (!toolCall) {
      return content;
    }

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
