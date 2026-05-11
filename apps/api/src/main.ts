import {
  ConversationSession,
  SYSTEM_PROMPT,
  TOOL_SCHEMA,
  agent,
} from '@org/agent';
import express from 'express';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use('/assets', express.static(path.join(__dirname, 'assets')));

app.get('/api', (req, res) => {
  res.send({ message: 'Welcome to api!' });
});

app.post('/api/chat', async (req, res) => {
  const session: ConversationSession = {
    id: 'session-1',
    createdAt: new Date(),
    lastActivity: new Date(),
    messages: [
      { role: 'system', content: SYSTEM_PROMPT + '\n\n' + TOOL_SCHEMA },
    ],
  };
  session.messages.push({ role: 'user', content: '¿Qué hora es?' });
  const response = await agent(session.messages);

  res.send({ message: 'POST request received!', response });
});

const port = process.env.PORT || 3333;
const server = app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}/api`);
});
server.on('error', console.error);
