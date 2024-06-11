/**
 * Finds the closest element in a sorted list.
 *
 * @param array the array to comb through
 * @param comparison the comparison to make - -1 if it's less, 1 if its greater, 0 if it's equal
 */
export function findClosest<T>(
	array: readonly T[],
	comparison: (arrayElement: T) => -1 | 0 | 1,
	minBracket = 0,
	maxBracket = array.length
): [item: T, index: number] {
	// Only one element to search for in this condition!
	if (minBracket === maxBracket) {
		return [array[minBracket], minBracket];
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
		return findClosest(array, comparison, minBracket, middleElementIndex);
	} else {
		return findClosest(array, comparison, middleElementIndex, maxBracket);
	}
}
