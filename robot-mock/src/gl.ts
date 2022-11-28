import chalk from 'chalk';
import gl from 'gl';
import * as THREE from 'three';
import type { WebGLRenderer } from 'three';

export function createRenderer({ height, width }: { height: number; width: number }): WebGLRenderer {
	// THREE expects a canvas object to exist, but it doesn't actually have to work.
	const canvas = {
		width,
		height,
		addEventListener: () => undefined,
		removeEventListener: () => undefined,
	};

	const glInstance = gl(width, height, {
		preserveDrawingBuffer: true,
	});

	const renderer = new THREE.WebGLRenderer({
		// as seen, this is pretty wacky. we're just faking this to make sure three.js does what we want.
		canvas: canvas as unknown as HTMLCanvasElement,
		antialias: false,
		powerPreference: 'high-performance',
		context: glInstance,
	});

	renderer.shadowMap.enabled = true;
	renderer.shadowMap.type = THREE.PCFSoftShadowMap; // default PCFShadowMap

	// Enable shadow mapping
	const renderTarget = new THREE.WebGLRenderTarget(width, height, {
		minFilter: THREE.LinearFilter,
		magFilter: THREE.NearestFilter,
		format: THREE.RGBAFormat,
		type: THREE.UnsignedByteType,
	});

	renderer.setRenderTarget(renderTarget);
	return renderer;
}

interface RenderData {
	width: number;
	height: number;
	pixels: Uint8Array;
}

export function extractPixels(context: WebGLRenderingContext): RenderData {
	const width = context.drawingBufferWidth;
	const height = context.drawingBufferHeight;
	const frameBufferPixels = new Uint8Array(width * height * 4);
	context.readPixels(0, 0, width, height, context.RGBA, context.UNSIGNED_BYTE, frameBufferPixels);

	const pixels = new Uint8Array(width * height * 4);
	for (let fbRow = 0; fbRow < height; fbRow += 1) {
		const rowData = frameBufferPixels.subarray(fbRow * width * 4, (fbRow + 1) * width * 4);
		const imgRow = height - fbRow - 1;
		pixels.set(rowData, imgRow * width * 4);
	}
	return { width, height, pixels };
}

export function output({ width, height, pixels }: RenderData) {
	// go through every 2 rows of pixels and output each 2 pixels as a single character
	const trueWidth = width * 4;
	for (let row = 0; row < height; row += 2) {
		for (let i = 0; i < trueWidth; i += 4) {
			process.stdout.write(
				chalk
					.rgb(pixels[i + (row * trueWidth)], pixels[(i + 1) + (row * trueWidth)], pixels[(i + 2) + (row * trueWidth)])
					.bgRgb(
						pixels[i + ((row + 1) * trueWidth)],
						pixels[(i + 1) + ((row + 1) * trueWidth)],
						pixels[(i + 2) + ((row + 1) * trueWidth)],
					)('▀'),
			);
		}
		process.stdout.write('\n');
	}
}
