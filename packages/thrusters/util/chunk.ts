// from https://stackoverflow.com/a/55435856/7589775 - generator
export function* chunks<T>(array: T[], n: number): Generator<T[], void> {
	for (let i = 0; i < array.length; i += n) {
		yield array.slice(i, i + n);
	}
}
