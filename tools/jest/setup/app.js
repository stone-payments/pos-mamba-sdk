import DummyApp from '../__mocks__/DummyApp.html';

const target = document.body;
let currentApp;

const newComponent = (ComponentConstructor, { data, slots } = {}) => {
  if (currentApp) {
    currentApp.destroy();
  }

  currentApp = new DummyApp({
    target,
    data: {
      ComponentConstructor,
      data,
      slots,
    },
  });

  return currentApp.get().instance;
};

global.newComponent = newComponent;
