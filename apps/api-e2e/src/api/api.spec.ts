import axios from 'axios';

describe('GET /', () => {
  it('should return a message', async () => {
    const res = await axios.get('http://localhost:3333/api/');

    expect(res.status).toBe(200);
    expect(res.data).toEqual({ message: 'Welcome to api!' });
  });

  it('should return a response from the agent', async () => {
    const res = await axios.post('http://localhost:3333/api/chat', {
      message: '¿Qué hora es?',
    });

    console.log('Response from /api/chat:', res.data);
    expect(res.status).toBe(200);
    expect(res.data).toHaveProperty('response');
  }, 20000);
});
