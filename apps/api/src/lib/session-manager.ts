import { Message, SYSTEM_PROMPT, TOOL_SCHEMA } from '@org/agent';
import { v4 as uuidv4 } from 'uuid';

export interface ConversationSession {
  id: string;
  createdAt: Date;
  lastActivity: Date;
  messages: Message[];
}

export class SessionManager {
  private sessions = new Map<string, ConversationSession>();

  getOrCreateSession(sessionId?: string): ConversationSession {
    // Buscar sesión existente
    if (sessionId) {
      const existingSession = this.sessions.get(sessionId);

      if (existingSession) {
        existingSession.lastActivity = new Date();
        return existingSession;
      }
    }

    // Crear nueva sesión
    const newSession: ConversationSession = {
      id: uuidv4(),
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
