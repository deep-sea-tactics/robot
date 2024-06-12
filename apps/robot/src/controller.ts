import { z } from 'zod';

/**
 * All data sent from the controller
 */
export const controllerDataSchema = z
	.object({
		id: z.string().describe('The current ID of the controller; i.e. logitech').default('dummy'),
		connected: z.boolean().describe('Whether the controller is currently connected').default(false),
		movement: z
			.object({
				x: z
					.number()
					.min(-1)
					.max(1)
					.default(0)
					.describe('The x (sideways) movement. -1 is left, 1 is right.'),
				y: z
					.number()
					.min(-1)
					.max(1)
					.default(0)
					.describe('The y (up/down) movement. -1 is down, 1 is up.'),
				z: z
					.number()
					.min(-1)
					.max(1)
					.default(0)
					.describe('The z (forward/backwards) movement. -1 is backwards, 1 is forwards.')
			})
			.required()
			.describe('What direction the ROV moves in.')
			.default({}),
		tasks: z
			.object({
				pinkSquare: z.boolean().default(false).describe('Activates the pink square task.'),
				scanning: z.boolean().default(false).describe('Does the 3D scanning task.')
			})
			.required()
			.describe('Triggerable tasks')
			.default({}),
		camera: z
			.object({
				y: z
					.number()
					.min(-1)
					.max(1)
					.default(0)
					.describe('Y-movement of the camera. -1 is down, 1 is up')
			})
			.required()
			.describe('Camera axis movements')
			.default({}),
		rotation: z
			.object({
				pitch: z
					.number()
					.min(-1)
					.max(1)
					.default(0)
					.describe('Controls the pitch of the ROV. -1 is down, 1 is up.'),
				yaw: z
					.number()
					.min(-1)
					.max(1)
					.default(0)
					.describe('Controls the yaw of the ROV. -1 is left, 1 is right.')
			})
			.required()
			.describe('ROV rotational movements')
			.default({}),
		arm: z
			.object({
				openClose: z
					.number()
					.min(-1)
					.max(1)
					.default(0)
					.describe('Controls how the arm opens and closes. -1 is closing, 1 is opening.'),
				rotate: z
					.number()
					.min(-1)
					.max(1)
					.default(0)
					.describe('Controls how the arm rotates. -1 is counterclockwise, 1 is clockwise')
			})
			.required()
			.describe('ROV arm control')
			.default({})
	})
	.required()
	.strict()
	.brand<'ControllerData'>()
	.default({});

controllerDataSchema._def.innerType

export type ControllerData = z.infer<typeof controllerDataSchema>;
