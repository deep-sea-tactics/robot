import { z } from 'zod';

export const accelerationDataScheme = z.object({
	accelerationValueX: z.number(),
	accelerationValueY: z.number(),
	accelerationValueZ: z.number()
});

export type AccelerationData = z.infer<typeof accelerationDataScheme>;
