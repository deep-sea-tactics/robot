import { writable } from 'svelte/store';
import type { Position } from './typings';
import { client } from '../socket/socket';
import type { ControllerData } from '@landstown/typings';

/* A position from 0-100 on two axises, where 0 is the top left and 100 is the bottom right. */
export const data = writable<ControllerData>();

client.on('controllerData', ($data: ControllerData) => {
	data.set($data);
});
