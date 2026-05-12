import dotenv from 'dotenv';
dotenv.config({
  path: '../../.env.test',
});

import { agent } from '../lib/agent.js';
import { ConversationSession } from '../lib/InterfacesAgent.js';
import { SYSTEM_PROMPT, TOOL_SCHEMA } from '../lib/SYSTEM_PROMPT.js';

const session: ConversationSession = {
  id: 'session-1',
  createdAt: new Date(),
  lastActivity: new Date(),
  messages: [{ role: 'system', content: SYSTEM_PROMPT + '\n\n' + TOOL_SCHEMA }],
};

describe('agent', () => {
  it('should work', async () => {
    session.messages.push({ role: 'user', content: '¿Qué hora es?' });
    const response = await agent(session.messages);
    console.log('Agent response:', response);
    expect(response).toBeDefined();
  }, 20000);
});
