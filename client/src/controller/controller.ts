import { writable, Writable } from "svelte/store";
import type { Position } from './typings';

export const position: Writable<Position> = writable({ x: 0, y: 0 })