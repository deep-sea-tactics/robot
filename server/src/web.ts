import { Server } from 'socket.io';
import { rawDataToControllerData } from './controller/controller.js';
import { logger } from './logger.js';
import type { ControllerData } from 'typings';
import { controllerData, mixedControllerData } from './controller/position.js';
import { device } from './controller/device.js';
import { env_data } from './env.js';
import equals from 'fast-deep-equal';
import flyd from 'flyd';

/* The port. Default is 3000 */
const port = env_data.WEB_PORT | 3000;

export interface ServerToClientsMap {
	controllerData: (data: ControllerData) => void;
}

export interface ClientToServerMap {
	dataOverride: (data: Partial<ControllerData>) => void;
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
	logger.debug('Attempting to start socket server.');

	io.on('connection', (socket) => {
		// The client has connected
		logger.info(`Client connected to web interface. (ID: ${socket.id})`);

		socket.on('dataOverride', (args) => {
			mixedControllerData(args);
		});
		// Warn the server if the client has disconnected
		socket.on('disconnect', (reason) => {
			logger.info(`Client ${socket.id} disconnected from web interface: ${reason}`);
		});
	});

	flyd.on((controller) => {
		if (!controller) return;

		controller.on('data', (data) => {
			const processedData = rawDataToControllerData(data);

			if (processedData === undefined) return;

			if (equals(processedData, controllerData())) return;

			logger.debug(processedData);

			if (processedData === undefined) {
				return;
			}

			io.emit('controllerData', processedData);

			controllerData(processedData);
		});

		controller.on('error', () => {
			logger.warn('Device errored out.');

			device(undefined);
		});
	}, device);

	logger.info(`Socket listening to ${port}`);
};
