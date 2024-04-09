import { z } from 'zod';

export const vectorSchema = z.object({
	x: z.number(),
	y: z.number(),
	z: z.number()
});
