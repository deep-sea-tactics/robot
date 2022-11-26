import consola from 'consola';
import flyd from 'flyd';
import { Server } from 'socket.io';
import { finalControllerData } from './position.js';
const port = 9000;

const controllerDelay = 20;

/** Starts the robot server with socket.io. */
export function start(): void {
	const robot = new Server(port);

	let lastChange = Date.now();

	// Emit any change that occurs to the position variable
	flyd.on(change => {
		if (Date.now() - lastChange > controllerDelay) {
			robot.emit('controllerData', JSON.stringify(change));
			lastChange = Date.now();
		}
	}, finalControllerData);

	robot.on('connection', robotClient => {
		consola.info(`Robot connected! ID: ${robotClient.id}`);

		robotClient.on('close', () => consola.warn('Robot disconected.'));
		robotClient.on('error', error => consola.warn(`An exception with the robot has occured: ${error.toString()}`));
	});

	// Handle any conenction errors
	// NOTE engine needs typings
	// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
	robot.engine.on('connection_error', (err: { message: string }) => consola.warn(err.message));

	consola.info(`Robot socket listening at port ${port}.`);
}
