import io from 'socket.io-client';

export const client = io(`http://${location.hostname}:3000`);
