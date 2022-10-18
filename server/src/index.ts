import { start as startWebsite } from './web.js';
import { start as startRobot } from './robot.js';
import { config } from 'dotenv';
import chalk from 'chalk';

console.log(chalk.magenta('---  Starting server  ---'));

config();

startWebsite();
startRobot();
