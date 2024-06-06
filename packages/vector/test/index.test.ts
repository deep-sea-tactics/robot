import * as vector from '../src/index';
import { expect, test } from 'vitest';

test('abs vector', () => {
	expect(vector.abs({ x: -1, y: -5.2, z: 9.8 })).toStrictEqual({ x: 1, y: 5.2, z: 9.8 });
});

test('stabilize', () => {
	expect(vector.stabilize([5, -4, 2.3])).toStrictEqual({ x: 5, y: -4, z: 2.3 });
	expect({ x: 1.1, y: -2.2, z: 3.3 }).toStrictEqual({ x: 1.1, y: -2.2, z: 3.3 });
});
