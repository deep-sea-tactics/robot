import { Server } from 'socket.io';
import { rawDataToControllerData } from './controller/controller.js';
import consola from 'consola';
import type { ControllerData } from 'typings';
import { controllerData, mixedControllerData } from './controller/position.js';
import { device } from './controller/device.js';
import equals from 'fast-deep-equal';
import flyd from 'flyd';

const port = 3000;

export interface ServerToClientsMap {
	controllerData: (data: ControllerData) => void;
}

export interface ClientToServerMap {
	dataOverride: (data: Partial<ControllerData>) => void;
	clientControllerData: (data: ControllerData) => void;
}

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
	consola.debug('Attempting to start socket server.');

	io.on('connection', (socket) => {
		// The client has connected
		consola.info(`Client connected to web interface. (ID: ${socket.id})`);

		socket.on('dataOverride', mixedControllerData);
		socket.on('clientControllerData', controllerData);

		// Warn the server if the client has disconnected
		socket.on('disconnect', (reason) => {
			consola.warn(`Client ${socket.id} disconnected from web interface: ${reason}`);
		});
	});

	flyd.on((change) => {
		io.emit(`controllerData`, change);
	}, controllerData);

	flyd.on((controller) => {
		if (!controller) return;

		controller.on('data', (data) => {
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
