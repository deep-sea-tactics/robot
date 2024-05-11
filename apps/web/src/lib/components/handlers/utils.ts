/** Converts a boolean to a number, either 0 or 1 */
const booleanToNumber = (bool: boolean): 1 | 0 => (bool ? 1 : 0);

/** Converts a positive - negative button pair to an axis from -1 to 1 */
export const buttonAxis = (positive: boolean, negative: boolean): number => {
	return booleanToNumber(positive) - booleanToNumber(negative);
};
