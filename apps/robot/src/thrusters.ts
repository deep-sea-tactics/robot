import { Motor } from "./motor.js";
import * as vector from 'vector';

export interface MotorConstraint {
    type: Motor;
    position: vector.Vector;
    maxThrust: number;
    thrustDirection: vector.Vector;
}

const t200_12v_max_newtons = 32.5;
const thrustOffset = -30;

// measured manually via fusion :}
export const thrusters: MotorConstraint[] = [
    {
        type: Motor.BottomLeft,
        position: vector.vector(85.075 / 1000, -67.57 / 1000, 95.417 / 1000),
        maxThrust: t200_12v_max_newtons + thrustOffset,
        thrustDirection: vector.vector(-1, 0, 1)
    },
    {
        type: Motor.BottomRight,
        position: vector.vector(85.075 / 1000, -67.57 / 1000, -95.417 / 1000),
        maxThrust: t200_12v_max_newtons + thrustOffset,
        thrustDirection: vector.vector(-1, 0, -1)
    },
    {
        type: Motor.TopLeft,
        position: vector.vector(-114.204 / 1000, 65.297 / 1000, 103.873 / 1000),
        maxThrust: t200_12v_max_newtons + thrustOffset,
        thrustDirection: vector.vector(1, 0, 1)
    },
    {
        type: Motor.TopRight,
        position: vector.vector(-114.204 / 1000, 65.297 / 1000, -103.873 / 1000),
        maxThrust: t200_12v_max_newtons + thrustOffset,
        thrustDirection: vector.vector(1, 0, -1)
    },
    {
        type: Motor.VerticalLeft,
        position: vector.vector(20.755 / 1000, 80.601 / 1000, 99.732 / 1000),
        maxThrust: t200_12v_max_newtons + thrustOffset,
        thrustDirection: vector.vector(0, 1, 0)
    },
    {
        type: Motor.VerticalRight,
        position: vector.vector(20.755 / 1000, 80.601 / 1000, -99.732 / 1000),
        maxThrust: t200_12v_max_newtons + thrustOffset,
        thrustDirection: vector.vector(0, 1, 0)
    }
];
