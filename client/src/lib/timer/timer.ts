import { writable, get } from "svelte/store"

setInterval(() => {
  times.set(get(times).map(({ time, active }) => ({ time: active ? (time <= 0 ? 0 : time - 1) : time, active })))
}, 1000)

interface Timer {
  active?: boolean;
  time: number;
}

export const times = writable<Timer[]>([
  {
    time: 15 * 60
  },
  {
    time: 5 * 60
  }
])