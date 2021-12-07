import { start as startWebsite } from './web'
import { start as startRobot } from './robot'
import { config } from "dotenv"

config()

startWebsite()
startRobot()