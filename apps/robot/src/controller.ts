import { z } from 'zod';

/**
 * General X and Y position interface.
 *
 * X and Y are between 0-100. 50 is in the middle.
 *
 * 0y means backwards, 100y means forwards
 * 0x means left, 100x means right
 */
export const PositionSchema = z.object({
  x: z.number().min(0).max(100),
  y: z.number().min(0).max(100)
});

export type Position = z.infer<typeof PositionSchema>;

/**
 * All data sent from the controller
 */
export const ControllerDataSchema = z.object({
  position: PositionSchema,
  yaw: z.number(),
  view: PositionSchema,
  throttle: z.number(),
  buttons: z.object({
    trigger: z.boolean(),
    side_grip: z.boolean(),
  })
});

export type ControllerData = z.infer<typeof ControllerDataSchema>;
