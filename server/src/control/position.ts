import { stream } from 'flyd'

/**
 * General X and Y position interface
 */
export interface Position {
	x: number;
	y: number;
}

export const position = stream<Position>({
    x: 0,
    y: 0
});