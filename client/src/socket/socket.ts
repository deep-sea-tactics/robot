import io from 'socket.io-client';

export const client = io("http://localhost:3000")