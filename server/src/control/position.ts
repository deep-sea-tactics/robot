import { stream, on } from 'flyd'

/**
 * General X and Y position interface
 */
export interface Position {
	x: number;
	y: number;
}

/**
 * Reactive stream for position
 */
export const position = stream<Position>({
    x: 50,
    y: 50
});