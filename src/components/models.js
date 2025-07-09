// modelUtils.js
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

/**
 * Carrega um modelo 3D (.glb) na cena com posicionamento e sombras.
 * @param {string} path Caminho do arquivo .glb
 * @param {THREE.Vector3} position Posição do modelo na cena
 * @param {THREE.Scene} scene Instância da cena principal
 * @returns {Promise<THREE.Object3D>} Promessa resolvida com o modelo carregado
 */
export function loadModel(path, position, scene) {
  const loader = new GLTFLoader();

  return new Promise((resolve, reject) => {
    loader.load(
      path,
      (gltf) => {
        const model = gltf.scene;
        model.position.copy(position);

        // Ativa sombras em todos os meshes
        model.traverse((child) => {
          if (child.isMesh) {
            child.castShadow = true;
            child.receiveShadow = true;
          }
        });

        scene.add(model);
        console.log(`✅ Modelo carregado com sucesso: ${path}`);
        resolve(model);
      },
      undefined,
      (error) => {
        console.error(`❌ Erro ao carregar modelo ${path}:`, error);
        reject(error);
      }
    );
  });
}

/**
 * Cria o solo da cena com tamanho configurável.
 * @param {number} size Tamanho do plano de chão
 * @param {THREE.Scene} scene Instância da cena principal
 * @returns {THREE.Mesh} Objeto do chão
 */
export function createGround(size, scene) {
  const geometry = new THREE.PlaneGeometry(size, size);
  const material = new THREE.MeshStandardMaterial({
    color: 0x555555,
    side: THREE.DoubleSide
  });

  const ground = new THREE.Mesh(geometry, material);
  ground.rotation.x = -Math.PI / 2;
  ground.receiveShadow = true;
  scene.add(ground);

  return ground;
}
