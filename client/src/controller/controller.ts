import { writable, Writable, get } from "svelte/store";
import type { Position } from './typings';
import { client } from '../socket/socket'

/* A position from 0-100 on two axises, where 0 is the top left and 100 is the bottom right. */
export const position: Writable<Position> = writable({ x: 50, y: 50 })
export const controllerAvailable = writable(false)
export const controllerInUse = writable(false)
export const trigger = writable(false);

controllerInUse.subscribe(change => client.emit("controllerInUse", change))

interface ControllerData {
	position: Position,
	buttons: {
		trigger: boolean
	}
}

client.on("controllerData", (data: ControllerData) => {

	if (!get(controllerInUse)) {
		return
	}

	position.set(data.position)
	trigger.set(data.buttons.trigger)
})

client.on("controllerAvailable", () => {
	controllerAvailable.set(true)
	controllerInUse.set(true)
})