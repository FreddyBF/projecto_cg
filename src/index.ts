import { KeyDisplay } from './utils';
import { CharacterControls } from './characterControls';
import * as THREE from 'three'
import { CameraHelper } from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader';

// SCENE
const scene = new THREE.Scene();
scene.background = new THREE.Color(0xa8def0);

// CAMERA
const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.y = 5;
camera.position.z = 5;
camera.position.x = 0;

// RENDERER
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
renderer.shadowMap.enabled = true

// CONTROLS
const orbitControls = new OrbitControls(camera, renderer.domElement);
orbitControls.enableDamping = true
orbitControls.minDistance = 5
orbitControls.maxDistance = 15
orbitControls.enablePan = false
orbitControls.maxPolarAngle = Math.PI / 2 - 0.05
orbitControls.update();

// LIGHTS
light()

// FLOOR
generateFloor()

// MODEL WITH ANIMATIONS
var characterControls: CharacterControls
new GLTFLoader().load('models/Soldier.glb', function (gltf) {
    const model = gltf.scene;
    model.traverse(function (object: any) {
        if (object.isMesh) object.castShadow = true;
    });
    scene.add(model);

    const gltfAnimations: THREE.AnimationClip[] = gltf.animations;
    const mixer = new THREE.AnimationMixer(model);
    const animationsMap: Map<string, THREE.AnimationAction> = new Map()
    gltfAnimations.filter(a => a.name != 'TPose').forEach((a: THREE.AnimationClip) => {
        animationsMap.set(a.name, mixer.clipAction(a))
    })

    characterControls = new CharacterControls(model, mixer, animationsMap, orbitControls, camera,  'Idle')
});

// MODEL WITH ANIMATIONS (CAR)
const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath('https://www.gstatic.com/draco/versioned/decoders/1.5.6/');

// Carregar o carro
const gltfLoader = new GLTFLoader();
gltfLoader.setDRACOLoader(dracoLoader); // Associa o DRACOLoader ao GLTFLoader

// Agora carregue o modelo
gltfLoader.load(
    'models/ferrari.glb',
    (gltf) => {
        const car = gltf.scene;
        car.position.set(5, 0, 2);
        scene.add(car);
        console.log('Carro carregado com Draco!');
    },
    undefined,
    (error) => {
        console.error('Erro ao carregar:', error);
    }
);

// CONTROL KEYS
const keysPressed = {  }
const keyDisplayQueue = new KeyDisplay();
document.addEventListener('keydown', (event) => {
    keyDisplayQueue.down(event.key)
    if (event.shiftKey && characterControls) {
        characterControls.switchRunToggle()
    } else {
        (keysPressed as any)[event.key.toLowerCase()] = true
    }
}, false);
document.addEventListener('keyup', (event) => {
    keyDisplayQueue.up(event.key);
    (keysPressed as any)[event.key.toLowerCase()] = false
}, false);

const clock = new THREE.Clock();
// ANIMATE
function animate() {
    let mixerUpdateDelta = clock.getDelta();
    if (characterControls) {
        characterControls.update(mixerUpdateDelta, keysPressed);
    }
    orbitControls.update()
    renderer.render(scene, camera);
    requestAnimationFrame(animate);
}
document.body.appendChild(renderer.domElement);
animate();

// RESIZE HANDLER
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    
    // Atualiza posição dos elementos da interface
    keyDisplayQueue.updatePosition();
    
    // Se estiver usando algum efeito de pós-processamento, seria necessário atualizá-lo aqui
}

window.addEventListener('resize', onWindowResize);

function generateFloor() {
    // TEXTURES
    const textureLoader = new THREE.TextureLoader();
    const sandBaseColor = textureLoader.load("./textures/sand/textura-rachada-asfalto.jpg");
    const sandNormalMap = textureLoader.load("./textures/sand/Sand 002_NRM.jpg");
    const sandHeightMap = textureLoader.load("./textures/sand/Sand 002_DISP.jpg");
    const sandAmbientOcclusion = textureLoader.load("./textures/sand/Sand 002_OCC.jpg");

    const WIDTH = 80
    const LENGTH = 80

    const geometry = new THREE.PlaneGeometry(WIDTH, LENGTH, 512, 512);
    const material = new THREE.MeshStandardMaterial(
        {
            map: sandBaseColor, normalMap: sandNormalMap,
            displacementMap: sandHeightMap, displacementScale: 0.1,
            aoMap: sandAmbientOcclusion
        })
    wrapAndRepeatTexture(material.map)
    wrapAndRepeatTexture(material.normalMap)
    wrapAndRepeatTexture(material.displacementMap)
    wrapAndRepeatTexture(material.aoMap)
    // const material = new THREE.MeshPhongMaterial({ map: placeholder})

    const floor = new THREE.Mesh(geometry, material)
    floor.receiveShadow = true
    floor.rotation.x = - Math.PI / 2
    scene.add(floor)
}

function wrapAndRepeatTexture (map: THREE.Texture) {
    map.wrapS = map.wrapT = THREE.RepeatWrapping
    map.repeat.x = map.repeat.y = 10
}

// Adicione estas variáveis no início do seu código, com as outras declarações
let ambientLight: THREE.AmbientLight;
let directionalLight: THREE.DirectionalLight;
let pointLight: THREE.PointLight;

function light() {
    scene.add(new THREE.AmbientLight(0xffffff, 0.7))

    const dirLight = new THREE.DirectionalLight(0xffffff, 1)
    dirLight.position.set(- 60, 100, - 10);
    dirLight.castShadow = true;
    dirLight.shadow.camera.top = 50;
    dirLight.shadow.camera.bottom = - 50;
    dirLight.shadow.camera.left = - 50;
    dirLight.shadow.camera.right = 50;
    dirLight.shadow.camera.near = 0.1;
    dirLight.shadow.camera.far = 200;
    dirLight.shadow.mapSize.width = 4096;
    dirLight.shadow.mapSize.height = 4096;
    scene.add(dirLight);
    // scene.add( new THREE.CameraHelper(dirLight.shadow.camera))
}

function setupLights() {
    // Luz ambiente
    ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
    
    // Luz direcional (sol)
    directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(-60, 100, -10);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 4096;
    directionalLight.shadow.mapSize.height = 4096;
    scene.add(directionalLight);
    
    // Ponto de luz (lâmpada)
    pointLight = new THREE.PointLight(0xffaa00, 1, 20);
    pointLight.position.set(5, 5, 5);
    pointLight.castShadow = true;
    scene.add(pointLight);
    
    // Adiciona helpers para visualizar as luzes (opcional)
    // scene.add(new THREE.DirectionalLightHelper(directionalLight));
    // scene.add(new THREE.PointLightHelper(pointLight));
}

// Chama a função de configuração de luzes
setupLights();

// Adiciona controles de teclado para as luzes
document.addEventListener('keydown', (event) => {
    keyDisplayQueue.down(event.key);
    
    if (event.shiftKey && characterControls) {
        characterControls.switchRunToggle();
    } else if (event.key === '1') {
        // Toggle luz ambiente
        ambientLight.visible = !ambientLight.visible;
        console.log('Ambient light:', ambientLight.visible ? 'ON' : 'OFF');
    } else if (event.key === '2') {
        // Toggle luz direcional
        directionalLight.visible = !directionalLight.visible;
        console.log('Directional light:', directionalLight.visible ? 'ON' : 'OFF');
    } else if (event.key === '3') {
        // Toggle ponto de luz
        pointLight.visible = !pointLight.visible;
        console.log('Point light:', pointLight.visible ? 'ON' : 'OFF');
    } else {
        (keysPressed as any)[event.key.toLowerCase()] = true;
    }
}, false);