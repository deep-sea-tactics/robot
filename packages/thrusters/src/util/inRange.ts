/**
 * Asserts that a value is in range
 * @param value The value to check
 * @param range The range to assert on, a tuple [min, max], inclusive
 * @param message The message error to throw if the value is not in range.
 */
export function assertRange(value: number, [min, max]: [min: number, max: number], message: string) {
	if (value < min || value > max) {
		throw new RangeError(message);
	}
}
