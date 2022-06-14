import { writable } from "svelte/store"

interface Timer {
  active?: boolean;
  time: number;
}

export const times = writable<Timer[]>([])