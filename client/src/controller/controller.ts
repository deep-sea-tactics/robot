import { writable, Writable } from "svelte/store";
import type { Position } from './typings';
import { client } from '../socket/socket'

export const position: Writable<Position> = writable({ x: 0, y: 0 })
export const controllerAvailable = writable(false)
export const controllerInUse = writable(false)

client.on("controllerPosition", (pos: Position) => {
	position.set(pos)
})

client.on("controllerAvailable", () => {
	controllerAvailable.set(true)
	controllerInUse.set(true)
})