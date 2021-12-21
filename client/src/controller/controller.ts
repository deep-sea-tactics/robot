import { writable, Writable, get } from "svelte/store";
import type { Position } from './typings';
import { client } from '../socket/socket'

export const position: Writable<Position> = writable({ x: 50, y: 50 })
export const controllerAvailable = writable(false)
export const controllerInUse = writable(false)
export const trigger = writable(false);

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