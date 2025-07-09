import * as THREE from 'three';


export function createRenderer(container) {
  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  container.appendChild(renderer.domElement);

  window.addEventListener('resize', () => {
    renderer.setSize(window.innerWidth, window.innerHeight);
  });

  return renderer;
}
