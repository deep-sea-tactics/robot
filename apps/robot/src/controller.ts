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
	stickAxes: z.object({
		leftStick: PositionSchema,
		rightStick: PositionSchema
	}),
	stickButtons: z.object({
		leftStick: z.boolean(),
		rightStick: z.boolean()
	}),
	// NOTE: triggers can be axes but we are using them a buttons, hence boolean (button#pressed)
	triggers: z.object({
		left: z.boolean(),
		right: z.boolean()
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
	})
});

export type ControllerData = z.infer<typeof controllerDataSchema>;
