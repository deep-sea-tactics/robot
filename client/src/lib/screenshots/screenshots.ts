import { writable } from "svelte/store";

export const screenshot = writable<string | null>(null)