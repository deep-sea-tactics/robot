import { z } from 'zod';

/**
 * All data sent from the controller
 */
export const controllerDataSchema = z.object({
	/** The current ID of the controller; i.e. logitech */
	id: z.string(),
	/** Whether the controller is currently connected */
	connected: z.boolean(),
	/** How the robot moves. */
	movement: z.object({
		/** The x (sideways) movement. -1 is left, 1 is right */
		x: z.number().min(-1).max(1),
		/** The y (up/down) movement. -1 is down, 1 is up */
		y: z.number().min(-1).max(1),
		/** The z (forward/backwards) movement. -1 is backwards, 1 is forwards */
		z: z.number().min(-1).max(1)
	}),
	tasks: z.object({
		/** Activates the pink square task. */
		pinkSquare: z.boolean(),
		/** Does a barrel roll */
		barrelRoll: z.boolean(),
		/** Does the 3D scanning task */
		scanning: z.boolean()
	}),
	camera: z.object({
		/** Y-movement of the camera. -1 is down, 1 is up */
		y: z.number().min(-1).max(1)
	}),
	rotation: z.object({
		/** Controls the pitch of the ROV. -1 is down, 1 is up */
		pitch: z.number().min(-1).max(1),
		/** Controls the yaw of the ROV. -1 is left, 1 is right */
		yaw: z.number().min(-1).max(1)
	}),
	arm: z.object({
		/** Controls how the arm opens and closes. -1 is closing, 1 is opening */
		openClose: z.number().min(-1).max(1),
		/** Controls how the secondary arm rotates. -1 is counterclockwise, 1 is clockwise */
		rotate: z.number().min(-1).max(1)
	})
});

export const defaultControllerData: ControllerData = Object.freeze({
	id: 'dummy',
	connected: false,
	movement: {
		x: 0,
		y: 0,
		z: 0
	},
	tasks: {
		pinkSquare: false,
		barrelRoll: false,
		scanning: false
	},
	rotation: {
		pitch: 0,
		yaw: 0
	},
	camera: {
		y: 0
	},
	arm: {
		openClose: 0,
		rotate: 0
	}
});

export type ControllerData = z.infer<typeof controllerDataSchema>;
