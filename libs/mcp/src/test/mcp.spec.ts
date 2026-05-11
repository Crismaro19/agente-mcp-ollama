import { Client, StdioClientTransport } from '@modelcontextprotocol/client';
import { MCPClient } from '../lib/client.js';

const serverPath =
  '/home/maro/proyectos/trabajo/test1/libs/mcp/src/lib/server.js';

describe('MCPClient (integration)', () => {
  it('should list tools', async () => {
    const client = new Client({
      name: 'agente-mcp-client',
      version: '1.0.0',
    });
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
});
