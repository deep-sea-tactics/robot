import { start as startWebsite } from './socket.js';
import { start as startRobot } from './robot.js';
import consola from 'consola';

consola.success('Server starting!');

startWebsite();
startRobot();

consola.info(`Web (possibly) listening to http://localhost:4000`);