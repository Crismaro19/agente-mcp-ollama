import { Client, StdioClientTransport } from '@modelcontextprotocol/client';

export class MCPClient {
  private client: Client;

  constructor() {
    this.client = new Client({
      name: 'agente-mcp-client',
      version: '1.0.0',
    });
  }

  async connect(serverPath: string) {
    const transport = new StdioClientTransport({
      command: 'node',
      args: ['--import', 'tsx', serverPath],
    });

    await this.client.connect(transport);
  }

  async listTools() {
    const res = await this.client.listTools();
    return res.tools;
  }

  async toolsToPrompt() {
    const response = await this.client.listTools();

    const tools = response.tools.map((tool) => ({
      type: 'function',
      function: {
        name: tool.name,
        description: tool.description,
        parameters: tool.inputSchema,
      },
    }));

    console.log('📦 Tools construidas prompt:', tools);
    return tools;
  }

  async callTool(name: string, args: any) {
    return this.client.callTool({
      name,
      arguments: args,
    });
  }

  async close() {
    await this.client.close();
  }
}
