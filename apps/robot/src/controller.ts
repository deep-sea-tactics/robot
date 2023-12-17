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
	position: PositionSchema,
	yaw: z.number(),
	// TODO: transform into position
	view: z.number(),
	throttle: z.number(),
	buttons: z.object({
		trigger: z.boolean(),
		side_grip: z.boolean(),
		joystick: z.object({
			lowerLeft: z.boolean(),
			lowerRight: z.boolean(),
			upperLeft: z.boolean(),
			upperRight: z.boolean()
		}),
		grid: z.object({
			topLeft: z.boolean(),
			topRight: z.boolean(),
			middleLeft: z.boolean(),
			middleRight: z.boolean(),
			bottomLeft: z.boolean(),
			bottomRight: z.boolean()
		})
	})
});

export type ControllerData = z.infer<typeof ControllerDataSchema>;
