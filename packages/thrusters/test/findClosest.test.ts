import { expect, test } from 'vitest';
import { findClosest } from '../src/util/findClosest';

const targeting =
	(value: number) =>
	(item: number): -1 | 0 | 1 =>
		value === item ? 0 : value > item ? -1 : 1;

const distance =
	(value: number) =>
	(item: number): number =>
		value - item;

test('findClosest can find exact matches', () => {
	expect(findClosest([1, 2, 3, 5, 7], targeting(5), distance(5))).toStrictEqual([5, 3]);
});

test('findClosest can find near matches', () => {
	expect(findClosest([1, 2, 3, 5, 8], targeting(6), distance(5))).toStrictEqual([5, 3]);
});
