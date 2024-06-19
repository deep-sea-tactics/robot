type Range = [min: number, max: number];

/** Converts a boolean to a number, either 0 or 1 */
const booleanToNumber = (bool: boolean): 1 | 0 => (bool ? 1 : 0);

/** Converts a positive - negative button pair to an axis from -1 to 1 */
export const buttonAxis = (positive: boolean, negative: boolean): number => {
	return booleanToNumber(positive) - booleanToNumber(negative);
};

/** Removes the deadzone from an axis [-1, 1] */
export const deadzone = (number: number, deadzoneRange: Range): number => {
	const [min, max] = deadzoneRange;

	if (number <= max && number >= min) return 0;

	// TODO: actually change slope
	return number;
};
