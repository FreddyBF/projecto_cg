import * as THREE from 'three';

import { createRenderer } from './core/createRenderer.js';
import { createScene } from './core/createScene.js';
import { createCamera } from './core/createCamera.js';
import { initControls } from './core/initControls.js';
import { createGround } from './objects/createGround.js';
import { loadModel } from './objects/loadModel.js';
import { setupLights } from './lighting/setupLights.js';
import { setupLightControls } from './lighting/lightController.js';
import { setupLights } from './lighting/setupLights.js';
import { createLightUI } from './ui/lightStatusUI.js';


const container = document.body;
const renderer = createRenderer(container);
const scene = createScene();
const camera = createCamera();
const controls = initControls(camera, renderer);
createGround(scene);

const lights = setupLights(scene);
setupLightControls(lights);

createLightUI(lights);

const carPath = new URL('../public/assets/models/carro.obj', import.meta.url).href;
loadModel(carPath, new THREE.Vector3(2, 0, 0), scene);

// 🚗 Load carro
loadModel(carPath, new THREE.Vector3(-2, 0, 0), scene);

// 🔁 Loop principal
function animate() {
  requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene, camera);
}
animate();
