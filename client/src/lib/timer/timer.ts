import { beep } from "../beep"
import { writable, get } from "svelte/store"

setInterval(() => {
  times.set(get(times).map(({ time, active }) => {
    if (time <= 0 && active) {
      beep()
    }

    return ({ time: active ? (time <= 0 ? 0 : time - 1) : time, active })
  }
  ))
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

export function fancyTime(time: number) {
  const minutes = Math.floor(time / 60)
  const normalizedTime = minutes === 0 ? time % 60 : (time % 60).toLocaleString("en-US", { minimumIntegerDigits: 2, useGrouping: false })
  return `${minutes ? minutes + ":" : ""}${normalizedTime}`
}