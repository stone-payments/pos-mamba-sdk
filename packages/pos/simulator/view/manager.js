import ViewWrapper from './pos/Wrapper.html';
import EventTarget from '../libs/EventTarget.js';
import extend from '../../extend.js';
import { Registry } from '../index.js';

const View = extend({}, EventTarget());

let instance;
let panelsToAdd = [];
const { device } = Registry.persistent.get().$Device;

View.drivers = Object.freeze({
  device,
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

View.getDevice = () => {
  return View.drivers.device;
};

export default View;
