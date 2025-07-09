import * as THREE from 'three';

/**
 * Cria e adiciona o solo à cena.
 * @param {THREE.Scene} scene Cena principal
 * @param {number} size Tamanho do chão
 * @returns {THREE.Mesh} O plano do solo criado
 */
export function createGround(scene, size = 100) {
  const geometry = new THREE.PlaneGeometry(size, size);
  const material = new THREE.MeshStandardMaterial({
    color: 0x505050,
    side: THREE.DoubleSide
  });

  const ground = new THREE.Mesh(geometry, material);
  ground.rotation.x = -Math.PI / 2;
  ground.receiveShadow = true;
  ground.position.y = 0;

  scene.add(ground);
  return ground;
}
