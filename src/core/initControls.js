import * as THREE from 'three';

import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

export function initControls(camera, renderer) {
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableZoom = true;
  controls.maxPolarAngle = Math.PI / 2;
  return controls;
}
