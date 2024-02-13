import { Schema, z } from 'zod';

export const AccelerationDataScheme = z.object({
	accelerationValue: z.number()
});

export type AccelerationData = z.infer<typeof AccelerationDataScheme>;
