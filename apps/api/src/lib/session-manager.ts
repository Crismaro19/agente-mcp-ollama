import { buildToolSchema, Message, SYSTEM_PROMPT } from '@org/agent';
import { MCPClient } from '@org/mcp';
import { v4 as uuidv4 } from 'uuid';

export interface ConversationSession {
  id: string;
  createdAt: Date;
  lastActivity: Date;
  messages: Message[];
}

export class SessionManager {
  private sessions = new Map<string, ConversationSession>();

  async getOrCreateSession(sessionId?: string): Promise<ConversationSession> {
    // Buscar sesión existente
    if (sessionId) {
      const existingSession = this.sessions.get(sessionId);

      if (existingSession) {
        existingSession.lastActivity = new Date();
        return existingSession;
      }
    }

    const client = new MCPClient();
    await client.connect(
      process.env.MCP_SERVER_PATH || './libs/mcp/src/lib/server.js',
    );
    const tools = await client.toolsToPrompt();
    const TOOL_SCHEMA = buildToolSchema(tools);

    // Crear nueva sesión
    const newSession: ConversationSession = {
      id: sessionId || uuidv4(),
      createdAt: new Date(),
      lastActivity: new Date(),
      messages: [
        { role: 'system', content: SYSTEM_PROMPT + '\n\n' + TOOL_SCHEMA },
      ],
    };

    this.sessions.set(newSession.id, newSession);

    return newSession;
  }

  getSession(sessionId: string): ConversationSession | undefined {
    return this.sessions.get(sessionId);
  }

  deleteSession(sessionId: string): boolean {
    return this.sessions.delete(sessionId);
  }

  clearSessions(): void {
    this.sessions.clear();
  }

  getAllSessions(): ConversationSession[] {
    return [...this.sessions.values()];
  }
}

export const sessionManager = new SessionManager();
