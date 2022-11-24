// Create context
const width = 64;
const height = 64;
import glConstructor from 'gl';

const gl = glConstructor(width, height, { preserveDrawingBuffer: true });

if (!gl) {
	throw new Error('Could not initialize WebGL');
}

// Clear screen to red
gl.clearColor(1, 0, 0, 1);
gl.clear(gl.COLOR_BUFFER_BIT);

// Write output as a PPM formatted image
const pixels = new Uint8Array(width * height * 4);
gl.readPixels(0, 0, width, height, gl.RGBA, gl.UNSIGNED_BYTE, pixels);
process.stdout.write(['P3\n# gl.ppm\n', width, ' ', height, '\n255\n'].join(''));

for (let i = 0; i < pixels.length; i += 4) {
	for (let j = 0; j < 3; ++j) {
		process.stdout.write(pixels[i + j] + ' ');
	}
}
