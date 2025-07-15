// Importação de módulos e utilitários necessários
import { KeyDisplay } from './utils'; // Utilitário para exibir teclas pressionadas
import { CharacterControls } from './characterControls'; // Classe para controlar o personagem
import * as THREE from 'three'; // Biblioteca principal Three.js
import { CameraHelper } from 'three'; // (Opcional) usado para visualizar a câmera de sombras
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'; // Controles de órbita com o mouse
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'; // Carregador de arquivos .glb/.gltf
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader'; // Carregador para arquivos comprimidos com Draco

// === Cena principal ===
const scene = new THREE.Scene(); // Cria a cena 3D
scene.background = new THREE.Color(0xa8def0); // Define a cor de fundo

// === Câmera ===
const camera = new THREE.PerspectiveCamera(
    45, window.innerWidth / window.innerHeight, 
    0.1, 
    1000
);

camera.position.y = 5;
camera.position.z = 5;
camera.position.x = 0;

// === Renderizador ===
const renderer = new THREE.WebGLRenderer({ antialias: true }); // Suaviza as bordas
renderer.setSize(window.innerWidth, window.innerHeight); // Define o tamanho da tela
renderer.setPixelRatio(window.devicePixelRatio); // Adapta à densidade do dispositivo
renderer.shadowMap.enabled = true; // Ativa sombras

// === Controles de órbita (mouse) ===
const orbitControls = new OrbitControls(camera, renderer.domElement);
orbitControls.enableDamping = true; // Suaviza a movimentação
orbitControls.minDistance = 5;
orbitControls.maxDistance = 15;
orbitControls.enablePan = false;
orbitControls.maxPolarAngle = Math.PI / 2 - 0.05; // Limita a rotação vertical
orbitControls.update();

// === Luzes principais ===
light(); // Ativa a iluminação padrão
setupLights(); // Adiciona luzes extras e controles

// === Piso da cena ===
generateFloor(); // Cria um piso texturizado

// === Carregamento do modelo do personagem com animações ===
var characterControls: CharacterControls;
new GLTFLoader().load('models/Soldier.glb', function (gltf) {
    const model = gltf.scene;
    
    // Ativa sombra para cada parte do modelo
    model.traverse(function (object: any) {
        if (object.isMesh) object.castShadow = true;
    });
    scene.add(model);

    // Carrega animações (exceto "TPose")
    const gltfAnimations: THREE.AnimationClip[] = gltf.animations;
    const mixer = new THREE.AnimationMixer(model);
    const animationsMap: Map<string, THREE.AnimationAction> = new Map();
    gltfAnimations.filter(a => a.name != 'TPose').forEach((a: THREE.AnimationClip) => {
        animationsMap.set(a.name, mixer.clipAction(a));
    });

    // Inicializa controles do personagem
    characterControls = new CharacterControls(
        model, 
        mixer, 
        animationsMap, 
        orbitControls, 
        camera, 
        'Idle'
    );
});


// === Carregamento do modelo de carro com compressão Draco ===

// 1. Cria uma instância do DRACOLoader, que permite descomprimir modelos GLTF/GLB comprimidos com Draco.
const dracoLoader = new DRACOLoader();

// 2. Define o caminho onde os decodificadores (JavaScript e WebAssembly) do Draco estão hospedados.
//    Nesse caso, usamos a CDN oficial do Google.
//    A versão '1.5.6' garante compatibilidade com os codificadores usados durante a exportação do modelo.
dracoLoader.setDecoderPath('https://www.gstatic.com/draco/versioned/decoders/1.5.6/');

// 3. Cria um carregador GLTF padrão do Three.js.
const gltfLoader = new GLTFLoader();

// 4. Associa o DRACOLoader ao GLTFLoader.
//    Assim, quando um arquivo GLTF/GLB comprimido com Draco for carregado,
//    o DRACOLoader será invocado automaticamente para descomprimir os dados antes de renderizar.
gltfLoader.setDRACOLoader(dracoLoader);

gltfLoader.load(
    'models/ferrari.glb',
    (gltf) => {
        const car = gltf.scene;
        car.position.set(5, 0, 2); // Posiciona o carro
        scene.add(car);
        console.log('Carro carregado com Draco!');
    },
    undefined,
    (error) => {
        console.error('Erro ao carregar:', error);
    }
);

// === Controle de teclas ===
const keysPressed = {};
const keyDisplayQueue = new KeyDisplay();

document.addEventListener('keydown', (event) => {
    keyDisplayQueue.down(event.key); // Exibe tecla pressionada
    if (event.shiftKey && characterControls) {
        characterControls.switchRunToggle(); // Alterna entre correr/andar
    } else {
        (keysPressed as any)[event.key.toLowerCase()] = true;
    }
}, false);

document.addEventListener('keyup', (event) => {
    keyDisplayQueue.up(event.key);
    (keysPressed as any)[event.key.toLowerCase()] = false;
}, false);

// === Animação contínua da cena ===
const clock = new THREE.Clock();

function animate() {
    let mixerUpdateDelta = clock.getDelta(); // Tempo desde último frame
    if (characterControls) {
        characterControls.update(mixerUpdateDelta, keysPressed); // Atualiza animações
    }
    orbitControls.update();
    renderer.render(scene, camera); // Renderiza a cena
    requestAnimationFrame(animate); // Chama próximo frame
}

document.body.appendChild(renderer.domElement); // Adiciona canvas à página
animate(); // Inicia loop de animação

// === Reajusta a tela ao redimensionar a janela ===
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    keyDisplayQueue.updatePosition(); // Atualiza interface de teclas
}
window.addEventListener('resize', onWindowResize);

// === Gera o piso texturizado ===
function generateFloor() {
    const textureLoader = new THREE.TextureLoader();

    // Carrega texturas
    const sandBaseColor = textureLoader.load("./textures/sand/textura-rachada-asfalto.jpg");
    const sandNormalMap = textureLoader.load("./textures/sand/Sand 002_NRM.jpg");
    const sandHeightMap = textureLoader.load("./textures/sand/Sand 002_DISP.jpg");
    const sandAmbientOcclusion = textureLoader.load("./textures/sand/Sand 002_OCC.jpg");

    const WIDTH = 80, LENGTH = 80;
    const geometry = new THREE.PlaneGeometry(WIDTH, LENGTH, 512, 512); // Piso detalhado
    const material = new THREE.MeshStandardMaterial({
        map: sandBaseColor,
        normalMap: sandNormalMap,
        displacementMap: sandHeightMap,
        displacementScale: 0.1,
        aoMap: sandAmbientOcclusion,
    });

    // Repete texturas para melhor aparência
    wrapAndRepeatTexture(material.map);
    wrapAndRepeatTexture(material.normalMap);
    wrapAndRepeatTexture(material.displacementMap);
    wrapAndRepeatTexture(material.aoMap);

    const floor = new THREE.Mesh(geometry, material);
    floor.receiveShadow = true;
    floor.rotation.x = -Math.PI / 2; // Deita o plano no chão
    scene.add(floor);
}

// Configura repetição de texturas
function wrapAndRepeatTexture(map: THREE.Texture) {
    map.wrapS = map.wrapT = THREE.RepeatWrapping;
    map.repeat.x = map.repeat.y = 10;
}

// === Luzes básicas ===
let ambientLight: THREE.AmbientLight;
let directionalLight: THREE.DirectionalLight;
let pointLight: THREE.PointLight;

function light() {
    // Luz ambiente básica
    scene.add(new THREE.AmbientLight(0xffffff, 0.7));

    // Luz direcional (como o Sol)
    const dirLight = new THREE.DirectionalLight(0xffffff, 1);
    dirLight.position.set(-60, 100, -10);
    dirLight.castShadow = true;
    dirLight.shadow.camera.top = 50;
    dirLight.shadow.camera.bottom = -50;
    dirLight.shadow.camera.left = -50;
    dirLight.shadow.camera.right = 50;
    dirLight.shadow.camera.near = 0.1;
    dirLight.shadow.camera.far = 200;
    dirLight.shadow.mapSize.width = 4096;
    dirLight.shadow.mapSize.height = 4096;
    scene.add(dirLight);

    // Para debugar sombras
    // scene.add(new THREE.CameraHelper(dirLight.shadow.camera));
}

// === Configuração extra de luzes com controle via teclado ===
function setupLights() {
    // Luz ambiente
    ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
    
    // Luz direcional
    directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(-60, 100, -10);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 4096;
    directionalLight.shadow.mapSize.height = 4096;
    scene.add(directionalLight);
    
    // Ponto de luz (como uma lâmpada)
    pointLight = new THREE.PointLight(0xffaa00, 1, 20);
    pointLight.position.set(5, 5, 5);
    pointLight.castShadow = true;
    scene.add(pointLight);
}

// === Teclas para alternar luzes e controlar personagem ===
document.addEventListener('keydown', (event) => {
    keyDisplayQueue.down(event.key); // Mostra visualmente a tecla pressionada

    if (event.shiftKey && characterControls) {
        characterControls.switchRunToggle(); // Alterna entre correr e andar ao segurar SHIFT
    } else if (event.key === '1') {
        // Alterna visibilidade da luz ambiente
        ambientLight.visible = !ambientLight.visible;
        console.log('Ambient light:', ambientLight.visible ? 'ON' : 'OFF');
    } else if (event.key === '2') {
        // Alterna visibilidade da luz direcional
        directionalLight.visible = !directionalLight.visible;
        console.log('Directional light:', directionalLight.visible ? 'ON' : 'OFF');
    } else if (event.key === '3') {
        // Alterna visibilidade do ponto de luz
        pointLight.visible = !pointLight.visible;
        console.log('Point light:', pointLight.visible ? 'ON' : 'OFF');
    } else {
        // Registra a tecla como pressionada para uso nos controles do personagem
        (keysPressed as any)[event.key.toLowerCase()] = true;
    }
}, false);
