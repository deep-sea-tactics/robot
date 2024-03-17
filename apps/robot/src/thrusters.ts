import { gradientDescent } from "./descent.js";
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

const orderedMotorTypes = thrusters.map((t) => t.type);

interface MotorMovement {
    type: Motor;
    speed: number;
}

interface MoveOutput {
    motors: MotorMovement[];
    directionDifference: vector.Vector;
    torqueDifference: vector.Vector;
}

function calculateForce(motorMovement: MotorMovement[]): vector.Vector {
    return motorMovement.reduce((force, movement) => {
        const motor = thrusters.find((t) => t.type === movement.type);
        if (!motor) {
            return force;
        }
        return vector.add(force)(vector.scale(motor.thrustDirection)(movement.speed));
    }, vector.vector(0, 0, 0));
}

function calculateTorque(motorMovement: MotorMovement[]): vector.Vector {
    return motorMovement.reduce((torque, movement) => {
        const motor = thrusters.find((t) => t.type === movement.type);
        if (!motor) {
            return torque;
        }
        return vector.add(torque)(vector.cross(motor.position)(vector.scale(motor.thrustDirection)(movement.speed)));
    }, vector.vector(0, 0, 0));
}

/**
 * Gives the optimal configuration
 * to direct the robot in the given direction.
 * 
 * @param direction The desired direction.
 * @param torque The desired torque.
 * 
 * @returns The optimal configuration. Difference variables are provided if deviations are needed.
 * This function will compromise evenly between direction and torque, getting the smallest difference on both.
 */
export function move(
    direction: vector.Vector,
    torque: vector.Vector
): MoveOutput {
    // we can abstract this problem as to finding the local minima of a function with 6 numerical inputs clamped to [-1, 1]
    // if we say f(a, b, c, d, e, g) = (directionDifference(a, b, c, d, e, g) + torqueDifference(a, b, c, d, e, g)) / 2
    // we can use a gradient descent algorithm to find the local minima

    const outputs = gradientDescent(
        (a, b, c, d, e, g) => {
            const motorMovement: MotorMovement[] = [
                { type: Motor.BottomLeft, speed: a },
                { type: Motor.BottomRight, speed: b },
                { type: Motor.TopLeft, speed: c },
                { type: Motor.TopRight, speed: d },
                { type: Motor.VerticalLeft, speed: e },
                { type: Motor.VerticalRight, speed: g }
            ];

            const directionDifference = vector.magnitude(vector.subtract(direction)(calculateForce(motorMovement)));
            const torqueDifference = vector.magnitude(vector.subtract(torque)(calculateTorque(motorMovement)));

            return (directionDifference + torqueDifference) / 2;
        },
        [0, 0, 0, 0, 0, 0]
    );

    const motorMovement: MotorMovement[] = [
        { type: Motor.BottomLeft, speed: outputs[0] },
        { type: Motor.BottomRight, speed: outputs[1] },
        { type: Motor.TopLeft, speed: outputs[2] },
        { type: Motor.TopRight, speed: outputs[3] },
        { type: Motor.VerticalLeft, speed: outputs[4] },
        { type: Motor.VerticalRight, speed: outputs[5] }
    ];

    const directionDifference = vector.subtract(direction)(calculateForce(motorMovement));
    const torqueDifference = vector.subtract(torque)(calculateTorque(motorMovement));

    return {
        motors: motorMovement,
        directionDifference,
        torqueDifference
    };
}
