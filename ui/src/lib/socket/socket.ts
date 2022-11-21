import type { ClientToServerMap, ServerToClientsMap } from 'landstown-robotics-types';
import io, { Socket } from 'socket.io-client';
import { writable } from 'svelte/store';

export const client: Socket<ServerToClientsMap, ClientToServerMap> = io(
	window.location.origin.replace('4000', '3000'),
	{ transports: ['websocket'] }, // fixes any cross-domain issues
);

export const connected = writable<boolean>(false);

client.on('connect', () => {
	connected.set(true);
});

client.on('disconnect', () => {
	connected.set(false);
});
