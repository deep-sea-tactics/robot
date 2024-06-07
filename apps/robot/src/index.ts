import { applyWSSHandler } from '@trpc/server/adapters/ws';
import { WebSocketServer } from 'ws';
import { router, queueTick } from './server.js';
import exitHook from 'exit-hook';

const wss = new WebSocketServer({
	port: 9000,
	host: '0.0.0.0'
});

const server = applyWSSHandler({
	wss,
	router
});

console.log('Listening on http://localhost:9000');
const timeout = queueTick();

exitHook(() => {
	server.broadcastReconnectNotification();
	wss.close();
	clearTimeout(timeout);
});
