import { Server } from 'socket.io';
import { rawDataToControllerData } from './controller/controller.js';
import consola from 'consola';
import type { ServerToClientsMap, ClientToServerMap } from 'typings';
import { controllerData, mixedControllerData } from './controller/position.js';
import { device } from './controller/device.js';
import equals from 'fast-deep-equal';
import flyd from 'flyd';

const port = 3000;

const io = new Server<ClientToServerMap, ServerToClientsMap>(port, {
	cors: {
		origin: '*',
		methods: ['GET', 'POST']
	}
});

/**
 * Starts the socket server
 */
export const start = async (): Promise<void> => {
	let broadcaster: string;
	consola.debug('Attempting to start socket server.');

	io.on('connection', socket => {
		// The client has connected
		consola.info(`Client connected to web interface. (ID: ${socket.id})`);

		socket.on('dataOverride', mixedControllerData);
		socket.on('clientControllerData', controllerData);

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

	flyd.on(change => {
		io.emit(`controllerData`, change);
	}, controllerData);

	flyd.on(controller => {
		if (!controller) return;

		controller.on('data', data => {
			const processedData = rawDataToControllerData(data);

			if (processedData === undefined) return;

			if (equals(processedData, controllerData())) return;

			consola.debug(processedData);

			if (processedData === undefined) {
				return;
			}

			controllerData(processedData);
		});

		controller.on('error', () => {
			consola.warn('Device errored out.');

			device(undefined);
		});
	}, device);

	consola.info(`Socket listening to ${port}`);
};
