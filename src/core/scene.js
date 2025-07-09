import * as THREE from 'three';

/**
 * Creates a Three.js scene with background, lights and floor.
 * @param {number|string} [background=0x202020] Background color (hex or CSS color string).
 * @returns {THREE.Scene} The created scene.
 */
function createScene(background = 0x202020) {
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(background);

  // 🌍 Piso
  const planeGeometry = new THREE.PlaneGeometry(50, 50);
  const planeMaterial = new THREE.MeshStandardMaterial({ color: 0x555555 });
  const plane = new THREE.Mesh(planeGeometry, planeMaterial);
  plane.rotation.x = -Math.PI / 2;
  plane.receiveShadow = true;
  scene.add(plane);

  // 💡 Luz ambiente
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
  scene.add(ambientLight);

  // 💡 Luz direcional
  const directionalLight = new THREE.DirectionalLight(0xffffff, 0.7);
  directionalLight.position.set(10, 10, 10);
  directionalLight.castShadow = true;
  scene.add(directionalLight);

  // 💡 Luz ponto
  const pointLight = new THREE.PointLight(0xffaa00, 0.8, 50);
  pointLight.position.set(-10, 5, 0);
  scene.add(pointLight);

  return scene;
}

export default createScene;
