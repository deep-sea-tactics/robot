import { writable, Writable } from "svelte/store";
import type { Position } from './typings';
import { client } from '../socket/socket'

export const position: Writable<Position> = writable({ x: 50, y: 50 })
export const controllerAvailable = writable(false)
export const controllerInUse = writable(false)


let controllerInUseLocal: boolean = false

controllerInUse.subscribe(value => controllerInUseLocal = value)

client.on("controllerPosition", (pos: Position) => {

	if (!controllerInUseLocal) {
		return
	}

	position.set(pos)
})

client.on("controllerAvailable", () => {
	controllerAvailable.set(true)
	controllerInUse.set(true)
})