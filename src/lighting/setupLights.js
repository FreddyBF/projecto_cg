import * as THREE from 'three';

export function setupLights(scene) {
  const lights = {};

  lights.ambient = new THREE.AmbientLight(0xffffff, 0.3);
  scene.add(lights.ambient);

  lights.directional = new THREE.DirectionalLight(0xffffff, 0.8);
  lights.directional.position.set(10, 10, 5);
  lights.directional.castShadow = true;
  scene.add(lights.directional);

  lights.point = new THREE.PointLight(0xffaa00, 0.8);
  lights.point.position.set(-10, 5, 0);
  scene.add(lights.point);

  return lights;
}
