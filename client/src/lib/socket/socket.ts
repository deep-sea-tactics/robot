import io from 'socket.io-client';

console.log(window.location.href.replace('4000', '3000'))
export const client = io(window.location.href.includes('gitpod.io') ? window.location.href.replace('4000', '3000') : `http://${location.hostname}:3000`, {transports: ["websocket"]});
