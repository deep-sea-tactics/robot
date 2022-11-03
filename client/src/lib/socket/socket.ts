import io from 'socket.io-client';

export const client = io(
	window.location.origin.replace('4000', '3000'),
	{ transports: ['websocket'] }, // fixes any cross-domain issues
);
