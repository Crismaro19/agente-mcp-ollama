import dotenv from 'dotenv';
dotenv.config({
  path: '../../.env.test',
});
import { Client, StdioClientTransport } from '@modelcontextprotocol/client';
import { MCPClient } from '../lib/client.js';

const serverPath = process.env.MCP_SERVER_PATH || './papa/server.js';

function buildToolSchema(tools: any[]) {
  return `
Tienes acceso a herramientas.

Cuando necesites usar una herramienta,
DEBES responder ÚNICAMENTE con JSON válido.

La respuesta debe poder parsearse usando JSON.parse().

NO expliques nada.
NO uses markdown.
NO uses bloques de código.
NO agregues texto antes ni después del JSON.

Formato EXACTO:

{
  "tool": "nombre_de_la_herramienta",
  "arguments": {
    ...
  }
}

Si NO necesitas herramientas,
responde normalmente al usuario.

Usa SOLO herramientas disponibles.
Nunca inventes herramientas.

Después de recibir resultado de herramienta,
responde normalmente al usuario.

Herramientas disponibles:

${JSON.stringify(tools, null, 2)}

Ejemplos:

Usuario: ¿Qué hora es?

Respuesta:
{
  "tool": "get_time",
  "arguments": {}
}

Usuario: suma 5 y 7

Respuesta:
{
  "tool": "sum_numbers",
  "arguments": {
    "a": 5,
    "b": 7
  }
}
`;
}

describe('MCPClient (integration)', () => {
  it('should list tools', async () => {
    const client = new Client({
      name: 'agente-mcp-client',
      version: '1.0.0',
    }); /*  */
    const transport = new StdioClientTransport({
      command: 'node',
      args: ['--import', 'tsx', serverPath],
    });

    await client.connect(transport);
    const response = await client.listTools();

    expect(response.tools.length).toBeGreaterThan(0);
  });

  it('should list tools with class', async () => {
    const client = new MCPClient();
    await client.connect(serverPath);
    const tools = await client.listTools();

    expect(tools.length).toBeGreaterThan(0);
  });

  it('should call sum_numbers tool', async () => {
    const client = new MCPClient();
    await client.connect(serverPath);
    const response = await client.callTool('sum_numbers', { a: 5, b: 7 });

    expect(response.content).toStrictEqual([{ type: 'text', text: '12' }]);
  });

  it('should get the tools as a prompt', async () => {
    const client = new MCPClient();
    await client.connect(serverPath);
    const tools = await client.toolsToPrompt();
    const TOOL_SCHEMA = buildToolSchema(tools);

    console.log('📦 TOOL_SCHEMA:', TOOL_SCHEMA);

    expect(tools.length).toBeGreaterThan(0);
  });
});
