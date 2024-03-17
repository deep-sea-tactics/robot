import type { Vector3 } from "three";

export interface Vector {
    x: number;
    y: number;
    z: number;
}

export type VectorTuple = [x: number, y: number, z: number];

export type VectorLike = Vector | VectorTuple | Vector3;

export function stabilize(v: VectorLike): Vector {
    if (Array.isArray(v)) {
        return { x: v[0], y: v[1], z: v[2] };
    }

    // thanks to type erasure, we don't need to do anything special for Vector3
    return v;
}

export function vector(x: number, y: number, z: number): Vector {
    return { x, y, z };
}

export const add = (a: VectorLike) => (b: VectorLike): Vector => {
    a = stabilize(a);
    b = stabilize(b);
    return {
        x: a.x + b.x,
        y: a.y + b.y,
        z: a.z + b.z
    };
}

export const subtract = (a: VectorLike) => (b: VectorLike): Vector => add(a)(scale(b)(-1));

export const scale = (a: VectorLike) => (b: number): Vector => {
    a = stabilize(a);
    return {
        x: a.x * b,
        y: a.y * b,
        z: a.z * b
    };
}

export const magnitude = (a: VectorLike): number => Math.sqrt(dot(a)(a));
export const normalize = (a: VectorLike): Vector => scale(a)(1 / magnitude(a));
export const dot = (a: VectorLike) => (b: VectorLike): number => {
    a = stabilize(a);
    b = stabilize(b);
    return a.x * b.x + a.y * b.y + a.z * b.z;
}

export const cross = (a: VectorLike) => (b: VectorLike): Vector => {
    a = stabilize(a);
    b = stabilize(b);
    return {
        x: a.y * b.z - a.z * b.y,
        y: a.z * b.x - a.x * b.z,
        z: a.x * b.y - a.y * b.x
    };
}
