// Create context
const width = 64;
const height = 64;
import { default as glConstructor } from 'gl';
import chalk from 'chalk';

const gl = glConstructor(width, height, { preserveDrawingBuffer: true });

if (!gl) {
	throw new Error('Could not initialize WebGL');
}

// Clear screen to red
gl.clearColor(1, 0, 0, 1);
gl.clear(gl.COLOR_BUFFER_BIT);

// Draw a green triangle
gl.enable(gl.BLEND);
gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
gl.enable(gl.DEPTH_TEST);
gl.depthFunc(gl.LEQUAL);
gl.enable(gl.CULL_FACE);
gl.cullFace(gl.BACK);
gl.frontFace(gl.CCW);

// Write output as a PPM formatted image
const pixels = new Uint8Array(width * height * 4);
gl.readPixels(0, 0, width, height, gl.RGBA, gl.UNSIGNED_BYTE, pixels);
process.stdout.write(['P3\n# gl.ppm\n', width, ' ', height, '\n255\n'].join(''));

for (let i = 0; i < pixels.length; i += 4) {
		process.stdout.write(chalk.rgb(pixels[i], pixels[i + 1], pixels[i + 2])('█'));

	if ((i / 4 + 1) % width === 0) {
		process.stdout.write('\n');
	}
}
