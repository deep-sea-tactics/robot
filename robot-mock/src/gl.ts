import chalk from 'chalk';
import gl from 'gl';
import * as THREE from 'three';
import type { WebGLRenderer } from 'three';

interface SceneInstance {
	scene: THREE.Scene;
	camera: THREE.Camera;
	step?: () => void;
}

function createScene(): SceneInstance {
	let rotation = 0;

	const scene = new THREE.Scene();
	scene.background = new THREE.Color('papayawhip');
	scene.fog = new THREE.FogExp2('papayawhip', 0.1);
	scene.castShadow = true;

	const camera = new THREE.PerspectiveCamera();
	camera.position.set(1, 1, 3);
	scene.add(camera);

	const plane = new THREE.Mesh();
	plane.geometry = new THREE.PlaneGeometry(50, 50);
	plane.material = new THREE.MeshStandardMaterial({ color: 'burlywood' });
	plane.receiveShadow = true;
	plane.rotation.set(-Math.PI / 2, 0, 0);
	plane.position.set(0, -0.5, 0);
	scene.add(plane);

	const grid = new THREE.GridHelper(50, 50, 'papayawhip', 'papayawhip');
	grid.position.set(0, -0.5 + 0.0001, 0);
	scene.add(grid);

	const box = new THREE.Mesh();
	box.geometry = new THREE.BoxGeometry();
	box.scale.set(1, 1, 1);
	box.material = new THREE.MeshStandardMaterial({ color: 0xff3e00 });
	box.castShadow = true;
	scene.add(box);

	const ambientLight = new THREE.AmbientLight('white', 0.6);
	scene.add(ambientLight);

	const directionalLight = new THREE.DirectionalLight('white', 0.6);
	directionalLight.position.set(-2, 3, 2);
	directionalLight.shadow.mapSize.width = 2048;
	directionalLight.shadow.mapSize.height = 2048;
	scene.add(directionalLight);

	return {
		scene,
		camera,
		step() {
			rotation += 0.1;
			box.rotation.set(0, rotation, 0);
		},
	};
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

const { scene, camera, step } = createScene();

const renderer = createRenderer({ width: 120, height: 50 });
renderer.render(scene, camera);

setInterval(() => {
	step?.();
	renderer.render(scene, camera);
	console.clear()
	output(extractPixels(renderer.getContext()));
}, 1000 / 10);
