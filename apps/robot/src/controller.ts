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
export const controllerDataSchema = z.object({
	id: z.string(),
	connected: z.boolean(),
	mainAxes: z.object({
		x: z.number().min(-1).max(1),
		y: z.number().min(-1).max(1)
	}),
	secondaryAxes: z.object({
		x: z.number().min(-1).max(1),
		y: z.number().min(-1).max(1)
	}),
	yaw: z.number().min(-1).max(1),
	trigger: z.boolean(),
	buttons: z.object({
		leftSmall: z.boolean(),
		rightSmall: z.boolean(),
		leftBig: z.boolean(),
		rightBig: z.boolean(),
	})
});

export type ControllerData = z.infer<typeof controllerDataSchema>;
