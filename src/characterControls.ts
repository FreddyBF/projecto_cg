// Importações do Three.js e utilitários
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { A, D, DIRECTIONS, S, W } from './utils' // Constantes para teclas e direções

// Classe responsável por controlar um personagem animado
export class CharacterControls {

    // === Atributos principais ===

    model: THREE.Group // Referência ao modelo 3D do personagem
    mixer: THREE.AnimationMixer // Controlador de animações
    animationsMap: Map<string, THREE.AnimationAction> = new Map() // Mapa das animações: 'Idle', 'Walk', 'Run'
    orbitControl: OrbitControls // Controle de órbita da câmera
    camera: THREE.Camera // Câmera da cena

    // === Estado atual do personagem ===

    toggleRun: boolean = true // Define se o personagem está correndo (true) ou andando (false)
    currentAction: string // A ação/estado atual: 'Idle', 'Walk', 'Run'

    // === Vetores e quaternions auxiliares ===

    walkDirection = new THREE.Vector3() // Direção do movimento
    rotateAngle = new THREE.Vector3(0, 1, 0) // Eixo de rotação (Y)
    rotateQuarternion: THREE.Quaternion = new THREE.Quaternion() // Para rotacionar o modelo
    cameraTarget = new THREE.Vector3() // Ponto que a câmera irá mirar

    // === Constantes de configuração ===

    fadeDuration: number = 0.2 // Tempo de transição entre animações
    runVelocity = 5 // Velocidade ao correr
    walkVelocity = 2 // Velocidade ao andar

    // === Construtor ===

    constructor(
        model: THREE.Group,
        mixer: THREE.AnimationMixer,
        animationsMap: Map<string, THREE.AnimationAction>,
        orbitControl: OrbitControls,
        camera: THREE.Camera,
        currentAction: string
    ) {
        this.model = model
        this.mixer = mixer
        this.animationsMap = animationsMap
        this.currentAction = currentAction

        // Inicia a animação atual
        this.animationsMap.forEach((value, key) => {
            if (key == currentAction) {
                value.play()
            }
        })

        this.orbitControl = orbitControl
        this.camera = camera

        // Atualiza o alvo da câmera
        this.updateCameraTarget(0, 0)
    }

    // Alterna entre correr e andar
    public switchRunToggle() {
        this.toggleRun = !this.toggleRun
    }

    // Atualiza a posição, animação e orientação do personagem
    public update(delta: number, keysPressed: any) {
        // Verifica se alguma tecla de direção foi pressionada
        const directionPressed = DIRECTIONS.some(key => keysPressed[key] == true)

        // Define a animação apropriada
        var play = ''
        if (directionPressed && this.toggleRun) {
            play = 'Run'
        } else if (directionPressed) {
            play = 'Walk'
        } else {
            play = 'Idle'
        }

        // Troca de animação, se necessário
        if (this.currentAction != play) {
            const toPlay = this.animationsMap.get(play)
            const current = this.animationsMap.get(this.currentAction)

            current.fadeOut(this.fadeDuration) // Suaviza a transição
            toPlay.reset().fadeIn(this.fadeDuration).play() // Inicia nova animação

            this.currentAction = play
        }

        // Atualiza a animação atual de acordo com o tempo
        this.mixer.update(delta)

        // Move o personagem apenas se estiver andando ou correndo
        if (this.currentAction == 'Run' || this.currentAction == 'Walk') {
            // Calcula o ângulo entre a câmera e o personagem
            var angleYCameraDirection = Math.atan2(
                (this.camera.position.x - this.model.position.x),
                (this.camera.position.z - this.model.position.z)
            )

            // Offset direcional baseado nas teclas pressionadas
            var directionOffset = this.directionOffset(keysPressed)

            // Rotaciona o modelo em direção ao movimento
            this.rotateQuarternion.setFromAxisAngle(this.rotateAngle, angleYCameraDirection + directionOffset)
            this.model.quaternion.rotateTowards(this.rotateQuarternion, 0.2)

            // Calcula a direção do movimento a partir da câmera
            this.camera.getWorldDirection(this.walkDirection)
            this.walkDirection.y = 0 // Remove componente vertical
            this.walkDirection.normalize()
            this.walkDirection.applyAxisAngle(this.rotateAngle, directionOffset)

            // Define velocidade com base na ação atual
            const velocity = this.currentAction == 'Run' ? this.runVelocity : this.walkVelocity

            // Aplica o movimento ao modelo
            const moveX = this.walkDirection.x * velocity * delta
            const moveZ = this.walkDirection.z * velocity * delta
            this.model.position.x += moveX
            this.model.position.z += moveZ

            // Atualiza posição da câmera e seu alvo
            this.updateCameraTarget(moveX, moveZ)
        }
    }

    // Atualiza a posição da câmera e o ponto que ela mira
    private updateCameraTarget(moveX: number, moveZ: number) {
        // Move a câmera junto com o personagem
        this.camera.position.x += moveX
        this.camera.position.z += moveZ

        // Mira a câmera na posição do personagem
        this.cameraTarget.x = this.model.position.x
        this.cameraTarget.y = this.model.position.y + 1 // Ajuste vertical
        this.cameraTarget.z = this.model.position.z
        this.orbitControl.target = this.cameraTarget
    }

    // Calcula o offset de rotação baseado nas teclas pressionadas
    private directionOffset(keysPressed: any) {
        var directionOffset = 0 // Direção padrão: W (frente)

        // Verifica combinações de teclas para diagonais
        if (keysPressed[W]) {
            if (keysPressed[A]) {
                directionOffset = Math.PI / 4 // W + A → frente-esquerda
            } else if (keysPressed[D]) {
                directionOffset = -Math.PI / 4 // W + D → frente-direita
            }
        } else if (keysPressed[S]) {
            if (keysPressed[A]) {
                directionOffset = Math.PI / 4 + Math.PI / 2 // S + A → trás-esquerda
            } else if (keysPressed[D]) {
                directionOffset = -Math.PI / 4 - Math.PI / 2 // S + D → trás-direita
            } else {
                directionOffset = Math.PI // S → para trás
            }
        } else if (keysPressed[A]) {
            directionOffset = Math.PI / 2 // A → esquerda
        } else if (keysPressed[D]) {
            directionOffset = -Math.PI / 2 // D → direita
        }

        return directionOffset
    }
}
