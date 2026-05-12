import 'dotenv/config';
import { agent } from '@org/agent';
import express from 'express';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { ChatRequestSchema, validateInput } from './lib/validation.js';
import { sessionManager } from './lib/session-manager.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use('/assets', express.static(path.join(__dirname, 'assets')));

app.get('/api', (req, res) => {
  res.send({ message: 'Welcome to api!' });
});

app.post('/api/chat', async (req, res) => {
  const { sessionId, message } = validateInput(ChatRequestSchema, req.body);

  const session = sessionManager.getOrCreateSession(sessionId ?? undefined);

  session.messages.push({
    role: 'user',
    content: message,
  });

  const response = await agent(session.messages);

  session.messages.push({
    role: 'assistant',
    content: response,
  });

  res.json({
    sessionId: session.id,
    response,
  });
});

const port = parseInt(process.env.API_PORT || '3334');
const host = process.env.API_HOST || 'localhost';
const server = app.listen(port, host, () => {
  console.log(`Listening at http://${host}:${port}/api`);
});
server.on('error', console.error);
