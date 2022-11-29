import consola from 'consola';
import equals from 'fast-deep-equal';
import type { ClientToServerMap, ServerToClientsMap } from 'landstown-robotics-types';
import { Server } from 'socket.io';
import { controllerData, mixedControllerData } from './position.js';

const port = 3000;

const io = new Server<ClientToServerMap, ServerToClientsMap>(port);

/**
 * Starts the socket server
 */
export const start = (): void => {
	let broadcaster: string;
	consola.debug('Attempting to start socket server.');

	io.on('connection', socket => {
		// The client has connected
		consola.info(`Client connected to web interface. (ID: ${socket.id})`);

		socket.on('dataOverride', mixedControllerData);
		socket.on('clientControllerData', data => {
			if (equals(controllerData(), data)) return;
			controllerData(data);
		});

		// Warn the server if the client has disconnected
		socket.on('disconnect', reason => {
			consola.info(`Client ${socket.id} disconnected from web interface: ${reason}`);
		});

		socket.on('broadcaster', () => {
			broadcaster = socket.id;
			socket.broadcast.emit('broadcaster');
		});
		socket.on('watcher', () => {
			socket.to(broadcaster).emit('watcher', socket.id);
		});
		socket.on('disconnect', () => {
			socket.to(broadcaster).emit('disconnectPeer', socket.id);
		});

		socket.on('offer', (id, message) => {
			socket.to(id).emit('offer', socket.id, message);
		});
		socket.on('answer', (id, message) => {
			socket.to(id).emit('answer', socket.id, message);
		});
		socket.on('candidate', (id, message) => {
			socket.to(id).emit('candidate', socket.id, message);
		});
	});

	consola.info(`Socket listening to ${port}`);
};
