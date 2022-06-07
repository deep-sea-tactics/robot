import { writable } from "svelte/store";

export const screenshots = writable<string[]>([])