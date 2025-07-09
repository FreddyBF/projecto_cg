/**
 * Cria botões para controle das luzes e mostra estado visual.
 * @param {Object} lights Objeto contendo as luzes
 */
export function createLightUI(lights) {
  const container = document.createElement('div');
  container.style.position = 'absolute';
  container.style.top = '10px';
  container.style.left = '10px';
  container.style.color = 'white';
  container.style.fontFamily = 'sans-serif';

  Object.entries(lights).forEach(([key, light], index) => {
    const button = document.createElement('button');
    button.textContent = `${key} ON`;
    button.style.margin = '5px';
    button.style.background = '#444';
    button.style.color = 'white';
    button.style.border = '1px solid #ccc';
    button.style.padding = '5px';

    button.onclick = () => {
      light.visible = !light.visible;
      button.textContent = `${key} ${light.visible ? 'LIGADO' : 'DESLIGADO'}`;
    };

    container.appendChild(button);
  });

  document.body.appendChild(container);
}
