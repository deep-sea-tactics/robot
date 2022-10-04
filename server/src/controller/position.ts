import flyd from 'flyd';
import { type ControllerData, defaultControllerData } from "typings"

/**
 * General X and Y position interface
 */
export interface Position {
	x: number;
	y: number;
}

//if it works don't ask
export const controllerData = flyd.stream<ControllerData>({ ...defaultControllerData });
export const mixedControllerData = flyd.stream<Partial<ControllerData>>({ ...defaultControllerData });
export const finalControllerData = flyd.combine((controllerData, mixedControllerData) => {
	return({...controllerData(), ...mixedControllerData()}); 
}, [controllerData, mixedControllerData]);

//Tristan is killing me slowly :/

