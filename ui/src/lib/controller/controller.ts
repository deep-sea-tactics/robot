import type { ControllerData } from 'landstown-robotics-types'; /*gitpod says its not referencing the types, please explain?*/ 
import { writable } from 'svelte/store';

/* A position from 0-100 on two axises, where 0 is the top left and 100 is the bottom right. */
export const data = writable<ControllerData | undefined>(undefined);
