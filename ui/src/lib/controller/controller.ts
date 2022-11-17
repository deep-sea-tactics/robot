import type { ControllerData } from 'landstown-robotics-types';
import { writable } from 'svelte/store';
import { client } from '../socket/socket';

/* A position from 0-100 on two axises, where 0 is the top left and 100 is the bottom right. */
export const data = writable<ControllerData>();

client.on('controllerData', ($data: ControllerData) => {
	data.set($data);
});
