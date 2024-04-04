import { applyWSSHandler } from '@trpc/server/adapters/ws';
import { WebSocketServer } from 'ws';
import { router } from './server.js';
import { createAlignment } from './stable.js';

const wss = new WebSocketServer({
	port: 9000
});

const server = applyWSSHandler({
	wss,
	router
});

console.log('Listening on http://localhost:9000');
const timeout = createAlignment()

process.on('SIGTERM', () => {
	console.log('SIGTERM');
	server.broadcastReconnectNotification();
	wss.close();
	clearTimeout(timeout);
});
