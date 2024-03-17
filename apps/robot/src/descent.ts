/** Construct a tuple type with N elements of type T. */
type Tuple<T, N extends number> = N extends N ? number extends N ? T[] : _TupleOf<T, N, []> : never;
type _TupleOf<T, N extends number, R extends unknown[]> = R['length'] extends N ? R : _TupleOf<T, N, [T, ...R]>;

/** some function that takes N amount of parameters, returning a number */
type Func<N extends number> = (...args: Tuple<number, N>) => number;

/**
 * Finds the local minima of a function with N numerical inputs.
 * 
 * @param func The function to minimize.
 * @param initialGuess The initial guess for the inputs.
 * @param learningRate The learning rate for the gradient descent.
 * @param maxIterations The maximum amount of iterations.
 */
export function gradientDescent<N extends number>(
    func: Func<N>,
    initialGuess: Tuple<number, N>,
    learningRate: number = 0.01,
    maxIterations: number = 100
): Tuple<number, N> {
    let guess = initialGuess;
    for (let i = 0; i < maxIterations; i++) {
        const gradient = calculateGradient(func, guess);
        guess = guess.map((value, index) => value - gradient[index] * learningRate) as Tuple<number, N>;
    }
    return guess;
}

/**
 * Calculates the gradient of a function at a given point.
 * 
 * @param func The function to calculate the gradient for.
 * @param point The point to calculate the gradient at.
 */
function calculateGradient<N extends number>(
    func: Func<N>,
    point: Tuple<number, N>
): Tuple<number, N> {
    const gradient = point.map((value, index) => {
        const delta = 0.0001;
        const deltaInput = point.map((v, i) => i === index ? v + delta : v) as Tuple<number, N>;
        const deltaOutput = func(...deltaInput);
        return (deltaOutput - func(...point)) / delta;
    }) as Tuple<number, N>;
    return gradient;
}
