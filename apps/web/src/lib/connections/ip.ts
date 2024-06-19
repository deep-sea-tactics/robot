import { VITE_RPI_IP } from '$env/static/public';

export const rpiIp = VITE_RPI_IP && VITE_RPI_IP.length > 1 ? VITE_RPI_IP : undefined;
