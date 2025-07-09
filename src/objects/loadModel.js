import * as THREE from 'three';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js';

/**
 * Carrega um modelo .obj na cena com posicionamento e sombra ativada.
 * @param {string} path Caminho do arquivo .obj
 * @param {THREE.Vector3} position Posição do modelo
 * @param {THREE.Scene} scene Cena principal
 * @returns {Promise<THREE.Group>} Promessa resolvida com o modelo carregado
 */
export function loadModel(path, position, scene) {
  const loader = new OBJLoader();

  return new Promise((resolve, reject) => {
    loader.load(
      path,
      (object) => {
        object.position.copy(position);

        object.traverse((child) => {
          if (child instanceof THREE.Mesh) {
            child.castShadow = true;
            child.receiveShadow = true;
          }
        });

        scene.add(object);
        console.log(`✅ Modelo OBJ carregado: ${path}`);
        resolve(object);
      },
      undefined,
      (error) => {
        console.error(`❌ Erro ao carregar modelo .obj: ${path}`, error);
        reject(error);
      }
    );
  });
}

