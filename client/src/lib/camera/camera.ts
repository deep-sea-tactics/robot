import { writable } from 'svelte/store';

export type Camera = {
	port: number;
	description: string;
	portEditable?: boolean;
	descriptionEditable?: boolean;
};

export const defaultCameras: readonly Camera[] = Object.freeze([
	{
		port: 8081,
		description: 'Front'
	},
	{
		port: 8083,
		description: 'Bottom'
	}
]);

export const cameras = writable<Camera[]>([...defaultCameras]);
