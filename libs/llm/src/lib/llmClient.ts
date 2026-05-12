export interface LLMClientOptions {
  model?: string;
  baseUrl?: string;
}

export class LLMClient {
  private model: string;
  private baseUrl: string;

  constructor(options: LLMClientOptions = {}) {
    this.model = options.model ?? 'xxqwen3.5:9b';
    this.baseUrl = options.baseUrl ?? 'xxhttp://localhost:11434';
  }

  async chat(messages: { role: string; content: string }[]) {
    const res = await fetch(`${this.baseUrl}/api/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: this.model,
        messages,
        stream: false,
        options: {
          temperature: 0.7,
          num_ctx: 4096, // contexto
        },
      }),
    });

    const data: any = await res.json();

    if (!data.message) {
      throw new Error(`Invalid Ollama response: ${JSON.stringify(data)}`);
    }

    const content = data.message?.content?.trim();

    if (!content) {
      throw new Error('Respuesta vacía de Ollama');
    }

    return {
      message: {
        content,
        tool_calls: [], // lo manejas tú con JSON parsing
      },
      stop_reason: 'stop',
    };
  }
}
