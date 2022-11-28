import { createRenderer, output, extractPixels } from './gl.js';
import * as THREE from 'three';
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
	box.position.set(1, 1, 0);
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

const { scene, camera, step } = createScene();

const renderer = createRenderer({ width: 120, height: 50 });
renderer.render(scene, camera);

setInterval(() => {
	step?.();
	renderer.render(scene, camera);
	const pixels = extractPixels(renderer.getContext());
	console.clear();
	output(pixels);
}, 1000 / 10);
