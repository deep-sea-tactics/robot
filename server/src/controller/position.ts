import flyd from 'flyd';
import { type ControllerData, defaultControllerData } from 'typings';

/**
 * General X and Y position interface
 */
export interface Position {
	x: number;
	y: number;
}

/** The base controller data, coming from either the native client or a browser client */
export const controllerData = flyd.stream<ControllerData>({ ...defaultControllerData });

/** Any controller data an AI task sends */
export const mixedControllerData = flyd.stream<Partial<ControllerData>>({
	...defaultControllerData
});

/** A mix of both the base and overlayd controller data. */
export const finalControllerData = flyd.combine<
	ControllerData,
	Partial<ControllerData>,
	ControllerData
>(
	(controllerData, mixedControllerData) => {
		// We override our native controller data with AI controller data, to give the AI control
		return { ...controllerData(), ...mixedControllerData() };
	},
	[controllerData, mixedControllerData]
);
