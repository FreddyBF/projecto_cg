// createRenderer.js
import * as THREE from 'three';

/**
 * Cria e configura o WebGLRenderer com suporte a sombras e responsividade.
 * @param {HTMLElement} container Elemento DOM onde o canvas será inserido.
 * @returns {{ renderer: THREE.WebGLRenderer, canvas: HTMLCanvasElement }} Instância do renderer e seu canvas.
 */
function createRenderer(container) {
  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(window.devicePixelRatio);

  // 🌑 Ativação de sombras suaves
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;

  container.appendChild(renderer.domElement);

  // 🔄 Responsividade automática
  window.addEventListener('resize', () => {
    renderer.setSize(window.innerWidth, window.innerHeight);
  });

  return {
    renderer,
    canvas: renderer.domElement
  };
}

export default createRenderer;
