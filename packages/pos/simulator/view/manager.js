import ViewWrapper from './pos/Wrapper.html';
import EventTarget from '../libs/EventTarget.js';
import extend from '../../extend.js';

const View = extend({}, EventTarget());

let instance;
let panelsToAdd = [];
// let device = 'S920';

View.drivers = Object.freeze({
  device: 'S920',
});

const updatePanels = () => {
  const { panels } = instance.refs.controlPanel.get();

  instance.refs.controlPanel.set({
    panels: [...panels, ...panelsToAdd],
  });

  panelsToAdd = [];
};

View.addPanel = panel => {
  panelsToAdd.push(panel);
  if (instance) {
    updatePanels();
  }
};

View.show = () => {
  if (!instance) {
    instance = new ViewWrapper({ target: document.body });

    if (panelsToAdd.length) {
      updatePanels();
    }
  }
  return instance;
};

View.getInstance = () => instance;

View.setDevice = device => {
  View.drivers = Object.freeze({
    ...View.drivers,
    device,
  });
};

View.getDevice = () => {
  return View.drivers.device;
};

export default View;
