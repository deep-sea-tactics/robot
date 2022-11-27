import chalk from 'chalk';
import gl from 'gl';
import * as THREE from 'three';
import type { WebGLRenderer } from 'three';

function createScene() {
	const scene = new THREE.Scene();

	const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);

	const geometry = new THREE.BoxGeometry(1, 1, 1);
	const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
	const cube = new THREE.Mesh(geometry, material);
	scene.add(cube);
	cube.rotation.set(0, Math.PI / 4, 0);

	camera.position.z = 5;

	return { scene, camera };
}

function createRenderer({ height, width }: { height: number; width: number }): WebGLRenderer {
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

function extractPixels(context: WebGLRenderingContext): RenderData {
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

function output({ width, height, pixels }: RenderData) {
	process.stdout.write(['P3\n# gl.ppm\n', width, ' ', height, '\n255\n'].join(''));

	for (let i = 0; i < pixels.length; i += 4) {
		process.stdout.write(chalk.rgb(pixels[i], pixels[i + 1], pixels[i + 2])('█'));

		if ((i / 4 + 1) % width === 0) {
			process.stdout.write('\n');
		}
	}
}

const { scene, camera } = createScene();

const renderer = createRenderer({ width: 200, height: 200 });
renderer.render(scene, camera);

output(extractPixels(renderer.getContext()));
