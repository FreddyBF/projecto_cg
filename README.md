# 🎮 Projeto 3D Interativo com Three.js

**Universidade Agostinho Neto**  
*Faculdade de Ciências Naturais – Licenciatura em Ciências da Computação*  
**Disciplina:** Computação Gráfica  
**Professor:** Lukau Garcia  
**Ano Letivo:** 2024/2025

---

## 👥 Equipa de Desenvolvimento

- Alfredo Fernando Baptista  
- Constantini Manuel Domingos Gola  
- Manuel Samuel Fuxi  
- Soares José Marques  

---

## 🎯 Objetivo Geral

Este projeto visa desenvolver uma **cena 3D interativa** utilizando tecnologias modernas da computação gráfica para a web. A experiência contempla:

- 👤 Um **boneco humanoide** em 3D  
- 🚗 Um **carro modelado externamente**  
- 🌍 Um **plano de solo** como base para os objetos  
- 📸 Navegação com **câmera orbitável e zoom**  
- 💡 Controle individual de **múltiplas fontes de luz**

> Toda a interatividade e renderização são realizadas em tempo real, proporcionando uma simulação gráfica dinâmica e envolvente.

---

## 📐 Especificações Técnicas

### 🔷 Elementos da Cena
- ✅ Boneco 3D (formato `.glb` ou `.obj`)
- ✅ Carro 3D (modelo externo)
- ✅ Plano/solo como base da simulação

### 🎥 Câmera
- 🔄 Rotação horizontal e vertical em torno dos objetos
- 🔍 Zoom com scroll do mouse
- 🚫 Limitação para impedir que a câmera atravesse o chão

### 💡 Iluminação
- 💡 Mínimo de **3 fontes de luz**:
  - Luz ambiente
  - Luz direcional
  - Ponto de luz
- 🎛️ Controle individual via teclado ou interface visual
- 🌑 Efeitos de escurecimento visível ao desligar fontes de luz
- 🎬 Os objetos continuam renderizados mesmo em escuridão total

### 🕹️ Controles de Interação

| Tecla/Ação             | Descrição                              |
|------------------------|-----------------------------------------|
| `1`                    | Liga/Desliga luz ambiente               |
| `2`                    | Liga/Desliga luz direcional             |
| `3`                    | Liga/Desliga ponto de luz               |
| Mouse (arrastar)       | Orbita a câmera                         |
| Scroll do mouse        | Zoom in/out                             |

---

## ⚙️ Tecnologias Utilizadas

![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![Three.js](https://img.shields.io/badge/Three.js-000000?style=for-the-badge&logo=three.js&logoColor=white)
![Parcel](https://img.shields.io/badge/Parcel-3C3C3C?style=for-the-badge&logo=parcel&logoColor=white)
![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)

---

## 🚀 Como Executar o Projeto

### 📦 Pré-requisitos

- [Node.js](https://nodejs.org/) instalado (recomendado v16+)
- Navegador moderno (Chrome, Firefox, Edge)

### ⚙️ Passo a passo com Parcel

```bash
# Clone o repositório
git clone https://github.com/seu-usuario/projeto-3d-interativo.git
cd projeto-3d-interativo

# Instale as dependências
npm install

# Inicie o projeto
npm run dev
