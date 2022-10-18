import { Server } from 'socket.io';
import consola from 'consola';
import flyd from 'flyd';
import { finalControllerData } from './controller/position.js';
const port = 9000;

const controllerDelay = 20;

/** Starts the robot server with socket.io. */
export async function start(): Promise<void> {
	const robot = new Server(port);

	let lastChange = new Date();

	// Emit any change that occurs to the position variable
	flyd.on((change) => {
		if (new Date().getTime() - lastChange.getTime() > controllerDelay) {
			robot.emit('controllerData', JSON.stringify(change));
			lastChange = new Date();
		}
	}, finalControllerData);

	robot.on('connection', (robotClient) => {
		consola.info(`Robot connected! ID: ${robotClient.id}`);

		robotClient.on('close', () => consola.warn('Robot disconected.'));
		robotClient.on('error', (error) =>
		consola.warn('An exception with the robot has occured: ' + error)
		);
	});

	// Handle any conenction errors
	robot.engine.on('connection_error', (err: { message: string }) => consola.warn(err.message));

	consola.info(`Robot ready to connected at port ${port}.`);
}
