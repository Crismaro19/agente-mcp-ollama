export interface ConversationSession {
  id: string;
  createdAt: Date;
  lastActivity: Date;
  messages: Array<{
    role: 'user' | 'assistant' | 'system';
    content: string;
  }>;
}
type Role = 'user' | 'assistant' | 'system';

export interface Message {
  role: Role;
  content: string;
  tool_calls?: Array<{
    id: string;
    function: {
      name: string;
      arguments: string;
    };
  }>;
}
