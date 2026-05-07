import { McpServer, StdioServerTransport } from '@modelcontextprotocol/server';
import * as z from 'zod';

// 1. Crear una instancia del servidor MCP
// Es la interfaz principal para registrar herramientas y manejar solicitudes de los clientes MCP
export const server = new McpServer({
  name: 'agente-mcp',
  version: '1.0.0',
});

// 2. Registrar herramientas en el servidor
// Cada herramienta tiene un nombre único, una descripción, un esquema de entrada y una función de ejecución
server.registerTool(
  'get_time',
  {
    description: 'Obtiene la hora actual',
    inputSchema: z.object({}) as any,
  },
  async () => {
    return {
      content: [
        {
          type: 'text' as const,
          text: new Date().toISOString(),
        },
      ],
    };
  },
);

server.registerTool(
  'sum_numbers',
  {
    description: 'Suma dos números',
    inputSchema: z.object({
      a: z.number(),
      b: z.number(),
    }) as any,
  },
  async (input: { a: number; b: number }) => {
    const { a, b } = input as { a: number; b: number };

    return {
      content: [
        {
          type: 'text' as const,
          text: (a + b).toString(),
        },
      ],
    };
  },
);

server.registerTool(
  'fetch_weather',
  {
    description: 'Tool to fetch the weather for a given city',
    inputSchema: z.object({
      city: z.string().describe('City name'),
    }),
  },
  async ({ city }) => {
    const response = await fetch(
      `https://geocoding-api.open-meteo.com/v1/search?name=${city}&count=10&language=en&format=json`,
    );
    const data: any = await response.json();
    if (!data.results || data.results.length === 0) {
      return {
        content: [
          {
            type: 'text' as const,
            text: `No se encontraron resultados para la ciudad proporcionada.`,
          },
        ],
      };
    }

    const { latitude, longitude } = data.results[0];

    const weatherResponse = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&hourly=temperature_2m&current=temperature_2m,is_day,precipitation,rain&forecast_days=1`,
    );

    const weatherData = await weatherResponse.json();

    return {
      content: [
        {
          type: 'text' as const,
          text: JSON.stringify(weatherData, null, 2),
        },
      ],
    };
  },
);

// 3. Conectar el servidor a un transporte
// El transporte es el medio por el cual el servidor se comunica con los clientes MCP

const transport = new StdioServerTransport();
await server.connect(transport);

// 4 probar el servidor MCP con el inspector de MCP
// Ejecuta el siguiente comando en la terminal para iniciar el inspector de MCP:
// npx -y @modelcontextprotocol/inspector npx -y tsx libs/mcp/src/lib/server.ts
// Luego, puedes enviar solicitudes a las herramientas registradas desde el inspector y ver las respuestas en tiempo real.
