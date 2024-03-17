import { z } from 'zod';

export const accelerationDataSchema = z.object({
	x: z.number(),
	y: z.number(),
	z: z.number()
});

export type AccelerationData = z.infer<typeof accelerationDataSchema>;

export const gyroDataSchema = z.object({
	x: z.number(),
	y: z.number(),
	z: z.number()
});

export type GyroData = z.infer<typeof gyroDataSchema>;
