import consola from 'consola';
import { start as startRobot } from './robot.js';
import { start as startWebsite } from './socket.js';

consola.success('Server starting!');

startWebsite();
startRobot();
