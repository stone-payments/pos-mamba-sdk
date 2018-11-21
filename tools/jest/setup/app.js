import DummyApp from '../__mocks__/DummyApp.html';

let currentApp;

global.newComponent = (ComponentConstructor, { data, slots } = {}) => {
  if (currentApp) {
    currentApp.destroy();
  }

  currentApp = new DummyApp({
    target: document.body,
    data: {
      ComponentConstructor,
      data,
      slots,
    },
  });

  return currentApp.refs.instance;
};

global.getTarget = () => document.body.querySelector('.app');
