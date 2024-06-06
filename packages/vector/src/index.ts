import type { Vector3 } from 'three';

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

export function abs(v: VectorLike): Vector {
	const stabilized = stabilize(v);

	return {
		x: Math.abs(stabilized.x),
		y: Math.abs(stabilized.y),
		z: Math.abs(stabilized.z)
	};
}

export function asTuple(v: VectorLike): VectorTuple {
	v = stabilize(v);
	return [v.x, v.y, v.z];
}

export const add =
	(a: VectorLike) =>
	(b: VectorLike): Vector => {
		a = stabilize(a);
		b = stabilize(b);
		return {
			x: a.x + b.x,
			y: a.y + b.y,
			z: a.z + b.z
		};
	};

export const subtract =
	(a: VectorLike) =>
	(b: VectorLike): Vector =>
		add(a)(scale(b)(-1));

export const scale =
	(a: VectorLike) =>
	(b: number): Vector => {
		a = stabilize(a);
		return {
			x: a.x * b,
			y: a.y * b,
			z: a.z * b
		};
	};

export const magnitude = (a: VectorLike): number => Math.sqrt(dot(a)(a));
export const normalize = (a: VectorLike): Vector => scale(a)(1 / magnitude(a));
export const dot =
	(a: VectorLike) =>
	(b: VectorLike): number => {
		a = stabilize(a);
		b = stabilize(b);
		return a.x * b.x + a.y * b.y + a.z * b.z;
	};

export const cross =
	(a: VectorLike) =>
	(b: VectorLike): Vector => {
		a = stabilize(a);
		b = stabilize(b);
		return {
			x: a.y * b.z - a.z * b.y,
			y: a.z * b.x - a.x * b.z,
			z: a.x * b.y - a.y * b.x
		};
	};

export interface Quaternion {
	x: number;
	y: number;
	z: number;
	w: number;
}

export function unitQuaternion(): Quaternion {
	return { x: 0, y: 0, z: 0, w: 1 };
}

export const applyQuaternion =
	(v: VectorLike) =>
	(q: Quaternion): Vector => {
		v = stabilize(v);

		let uv = cross(q)(v);
		let uuv = cross(q)(uv);
		uv = scale(uv)(2 * q.w);
		uuv = scale(uuv)(2);

		return add(v)(add(uv)(uuv));
	};

export const eulerToQuaternion = (v: VectorLike): Quaternion => {
	v = stabilize(v);

	const c1 = Math.cos(v.y / 2);
	const c2 = Math.cos(v.z / 2);
	const c3 = Math.cos(v.x / 2);
	const s1 = Math.sin(v.y / 2);
	const s2 = Math.sin(v.z / 2);
	const s3 = Math.sin(v.x / 2);

	return {
		x: s1 * c2 * c3 - c1 * s2 * s3,
		y: c1 * s2 * c3 + s1 * c2 * s3,
		z: c1 * c2 * s3 - s1 * s2 * c3,
		w: c1 * c2 * c3 + s1 * s2 * s3
	};
};
