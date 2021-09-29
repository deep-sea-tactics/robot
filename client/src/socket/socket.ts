import io from 'socket.io-client';
import { controllerAvailable } from '../controller/controller';

export const client = io()

client.on("controllerAvailable", () => {
	controllerAvailable.set(true)
})