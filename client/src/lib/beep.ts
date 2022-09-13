// The browser will limit the number of concurrent audio contexts
// So be sure to re-use them whenever you can
let audioContext: AudioContext | null = null;

/**
 * Helper function to emit a beep sound in the browser using the Web Audio API.
 *
 * @param duration - The duration of the beep sound in milliseconds.
 * @param frequency - The frequency of the beep sound.
 * @param volume - The volume of the beep sound.
 *
 * @returns A promise that resolves when the beep sound is finished.
 */
export function beep(duration = 200, frequency = 440, volume = 100): Promise<void> {
	return new Promise((resolve, reject) => {
		if (audioContext == null) audioContext = new AudioContext();

		try {
			const oscillatorNode = audioContext.createOscillator();
			const gainNode = audioContext.createGain();
			oscillatorNode.connect(gainNode);

			// Set the oscillator frequency in hertz
			oscillatorNode.frequency.value = frequency;

			// Set the type of oscillator
			oscillatorNode.type = 'square';
			gainNode.connect(audioContext.destination);

			// Set the gain to the volume
			gainNode.gain.value = volume * 0.01;

			// Start audio with the desired duration
			oscillatorNode.start(audioContext.currentTime);
			oscillatorNode.stop(audioContext.currentTime + duration * 0.001);

			// Resolve the promise when the sound is finished
			oscillatorNode.onended = () => {
				resolve();
			};
		} catch (error) {
			reject(error);
		}
	});
}
