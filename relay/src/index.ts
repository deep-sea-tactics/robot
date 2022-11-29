import consola from 'consola';
import { start as startRobot } from './robot.js';
import { start as startSocket } from './socket.js';

consola.success('Server starting!');

startSocket();
startRobot();
