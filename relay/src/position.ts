import flyd from 'flyd';
import { type ControllerData, defaultControllerData } from 'landstown-robotics-types';

/** The base controller data, coming from either the native client or a browser client */
export const controllerData = flyd.stream<ControllerData>({ ...defaultControllerData });
