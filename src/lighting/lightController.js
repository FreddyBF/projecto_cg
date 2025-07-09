export function setupLightControls(lights) {
  window.addEventListener('keydown', (event) => {
    switch (event.key) {
      case '1':
        lights.ambient.visible = !lights.ambient.visible;
        break;
      case '2':
        lights.directional.visible = !lights.directional.visible;
        break;
      case '3':
        lights.point.visible = !lights.point.visible;
        break;
    }
  });
}
