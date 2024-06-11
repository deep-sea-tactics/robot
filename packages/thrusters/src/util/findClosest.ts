/**
 * Finds the closest element in a sorted list.
 *
 * @param array the array to comb through
 * @param comparison the comparison to make - -1 if it's less, 1 if its greater, 0 if it's equal
 */
export function findClosest<T>(
	array: readonly T[],
	comparison: (arrayElement: T) => -1 | 0 | 1,
	distance: (arrayElement: T) => number,
	minBracket = 0,
	maxBracket = array.length
): [item: T, index: number] {
	if (minBracket > maxBracket) {
		throw new Error(`minBracket (${minBracket}) > maxBracket (${maxBracket}).`);
	}

	// Only one element to search for in this condition!
	if (minBracket === maxBracket) {

		// however, before we return, let's search our neighbors!
		const neighbors = [
			...(minBracket === 0 ? [] : [minBracket - 1]),
			minBracket,
			...(minBracket === array.length - 1 ? [] : [minBracket + 1])
		];

		const [closestIndex] = neighbors
			.map(neighborIndex => [neighborIndex, Math.abs(distance(array[neighborIndex]))] as const)
			.reduce((prev, current) => prev[0] < current[0] ? prev : current )

		return [array[closestIndex], closestIndex];
	}

	const middleElementIndex = Math.floor((minBracket + maxBracket) / 2);
	const middleElement = array[middleElementIndex];

	const foundComparison = comparison(middleElement);

	// exact match!
	if (foundComparison === 0) {
		return [middleElement, middleElementIndex];
		// the middle element is greater than what we're using to search -
		// move the max bracket to the middle
	} else if (foundComparison === 1) {
		return findClosest(array, comparison, distance, minBracket, middleElementIndex);
	} else {
		return findClosest(array, comparison, distance, middleElementIndex + 1, maxBracket);
	}
}
