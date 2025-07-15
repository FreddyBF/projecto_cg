// === Constantes que representam as teclas de controle ===
export const W = 'w'        // Para frente
export const A = 'a'        // Para esquerda
export const S = 's'        // Para trás
export const D = 'd'        // Para direita
export const SHIFT = 'shift' // Alternar corrida (run)

export const DIRECTIONS = [W, A, S, D] // Teclas relacionadas à movimentação

// === Classe para exibir visualmente o estado das teclas no DOM ===
export class KeyDisplay {

    // Mapeia cada tecla para seu respectivo elemento HTML visível na tela
    map: Map<string, HTMLDivElement> = new Map()

    constructor() {
        // Criação visual dos elementos de tecla (divs)
        const w: HTMLDivElement = document.createElement("div")
        const a: HTMLDivElement = document.createElement("div")
        const s: HTMLDivElement = document.createElement("div")
        const d: HTMLDivElement = document.createElement("div")
        const shift: HTMLDivElement = document.createElement("div")

        // Mapeia cada tecla ao respectivo elemento
        this.map.set(W, w)
        this.map.set(A, a)
        this.map.set(S, s)
        this.map.set(D, d)
        this.map.set(SHIFT, shift)

        // Posiciona os elementos na tela
        this.updatePosition()

        // Adiciona todos os elementos ao body do documento
        this.map.forEach((v, _) => {
            document.body.append(v)
        })
    }

    // Atualiza a posição absoluta dos elementos no viewport
    public updatePosition() {
        // Define a posição vertical (topo) dos elementos
        this.map.get(W).style.top = `${window.innerHeight - 150}px`
        this.map.get(A).style.top = `${window.innerHeight - 100}px`
        this.map.get(S).style.top = `${window.innerHeight - 100}px`
        this.map.get(D).style.top = `${window.innerHeight - 100}px`
        this.map.get(SHIFT).style.top = `${window.innerHeight - 100}px`

        // Define a posição horizontal (esquerda) dos elementos
        this.map.get(W).style.left = `300px`
        this.map.get(A).style.left = `200px`
        this.map.get(S).style.left = `300px`
        this.map.get(D).style.left = `400px`
        this.map.get(SHIFT).style.left = `50px`
    }

    // Muda a cor da tecla para vermelho quando pressionada
    public down(key: string) {
        const element = this.map.get(key.toLowerCase())
        if (element) {
            element.style.color = 'red'
        }
    }

    // Muda a cor da tecla para azul quando liberada
    public up(key: string) {
        const element = this.map.get(key.toLowerCase())
        if (element) {
            element.style.color = 'blue'
        }
    }

}
