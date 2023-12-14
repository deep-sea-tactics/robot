import { applyWSSHandler } from '@trpc/server/adapters/ws';
import ws from 'ws';
import { router } from './server.js';

const wss = new ws.Server({
  port: 9000
})

const server = applyWSSHandler({
  wss,
  router
});

console.log('Listening on http://localhost:9000');

process.on('SIGTERM', () => {
  console.log('SIGTERM');
  server.broadcastReconnectNotification();
  wss.close();
});