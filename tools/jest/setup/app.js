import DummyApp from '../__mocks__/DummyApp.html';

const target = document.body;
let currentComponent;

const newComponent = (ComponentConstructor, { data, slots } = {}) => {
  if (currentComponent) {
    currentComponent.destroy();
  }

  currentComponent = new ComponentConstructor({
    target,
    root: new DummyApp({ target }),
    data,
    slots,
  });

  return currentComponent;
};

global.newComponent = newComponent;
