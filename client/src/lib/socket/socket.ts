import io from 'socket.io-client';
import { page } from '$app/stores'; // TODO programatically use gitpod's URl for IO stuffs

export const client = io(`http://${location.hostname}:3000`);
