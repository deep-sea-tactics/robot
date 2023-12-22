import { z } from 'zod';

/**
 * General X and Y position interface.
 *
 * X and Y are between -1 and 1. 0 is in the middle.
 *
 * -1y means backwards, 1y means forwards
 * -1x means left, 1x means right
 */
export const PositionSchema = z.object({
	x: z.number().min(-1).max(1),
	y: z.number().min(-1).max(1)
});

export type Position = z.infer<typeof PositionSchema>;

/**
 * All data sent from the controller
 */
export const ControllerDataSchema = z.object({
	connected: z.boolean(),
	axes: z.object({
		leftStick: z.object({
			x: z.number(),
			y: z.number()
		}),
		rightStick: z.object({
			x: z.number(),
			y: z.number()
		})
	}),
	dPad: z.object({
		up: z.boolean(),
		down: z.boolean()
	}),
	bumbers: z.object({
		left: z.boolean(),
		right: z.boolean()
	}),
	shapeButtons: z.object({
		up: z.boolean(),
		down: z.boolean(),
		right: z.boolean(),
		left: z.boolean()
	}),
	rightThree: z.boolean()
});

export type ControllerData = z.infer<typeof ControllerDataSchema>;
