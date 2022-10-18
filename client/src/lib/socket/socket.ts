import io from 'socket.io-client';

export const client = io(
	window.location.href.includes('gitpod.io')
		? window.location.href.replace('4000', '3000')
		: `http://${location.hostname}:3000`,
	{ transports: ['websocket'] } // fixes any cross-domain issues
);
